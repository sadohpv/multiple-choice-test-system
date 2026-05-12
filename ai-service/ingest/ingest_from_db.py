"""Standalone ingestion script - ingest questions from PostgreSQL into ChromaDB.

Usage:
  python -m ingest.ingest_from_db              # ingest all questions
  python -m ingest.ingest_from_db --subject 1 # ingest from subject ID 1
  python -m ingest.ingest_from_db --sample 50 # ingest sample of 50 questions
"""
import argparse
import uuid
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal, text
from rag.vectorstore import VectorStoreManager
from rag.chunker import chunk_documents
from langchain_core.documents import Document


def build_question_documents(rows, limit=None):
    question_map = {}

    for row in rows:
        q_id = row.question_id
        if q_id not in question_map:
            difficulty_labels = {1: "Dễ", 2: "Trung bình", 3: "Khó"}
            question_map[q_id] = {
                "id": q_id,
                "question": row.question_text,
                "subject": row.subject_name,
                "difficulty": row.difficult,
                "difficulty_label": difficulty_labels.get(row.difficult, ""),
                "answers": [],
            }
        if row.answer_text:
            question_map[q_id]["answers"].append({
                "id": row.answer_id,
                "description": row.answer_text,
                "valid": row.valid,
            })

    if limit:
        question_map = dict(list(question_map.items())[:limit])

    docs_to_ingest = []
    for q_id, q in question_map.items():
        answers_text = ""
        correct_ans = None
        for j, ans in enumerate(q["answers"]):
            marker = " [CORRECT]" if ans["valid"] else ""
            answers_text += f"{chr(65+j)}. {ans['description']}{marker}\n"
            if ans["valid"]:
                correct_ans = chr(65+j)

        full_content = (
            f"Môn: {q['subject']} | Độ khó: {q['difficulty_label']}\n"
            f"Câu hỏi: {q['question']}\n"
            f"Đáp án:\n{answers_text}"
            f"Đáp án đúng: {correct_ans}"
        )

        doc = Document(
            page_content=full_content,
            metadata={
                "source": "postgresql",
                "type": "multiple_choice",
                "subject": q["subject"],
                "subject_id": q_id,
                "difficulty": q["difficulty"],
                "difficulty_label": q["difficulty_label"],
                "question_id": q_id,
                "correct_answer": correct_ans,
            }
        )
        docs_to_ingest.append(doc)

    return docs_to_ingest


def ingest_all(limit=1000, subject_id=None):
    db = SessionLocal()

    query = """
        SELECT
            q.id as question_id,
            q.description as question_text,
            q.difficult,
            s.name as subject_name,
            a.id as answer_id,
            a.desciption as answer_text,
            a.valid
        FROM "Questions" q
        LEFT JOIN "Subject" s ON q.subject_id = s.id
        LEFT JOIN "Answers" a ON a.question_id = q.id
    """

    params = {}
    if subject_id:
        query += " WHERE q.subject_id = :sid"
        params["sid"] = subject_id

    query += " ORDER BY q.id LIMIT :limit"
    params["limit"] = limit

    result = db.execute(text(query), params)
    rows = result.fetchall()
    db.close()

    if not rows:
        print("No questions found.")
        return

    print(f"Fetched {len(rows)} rows from DB")

    docs = build_question_documents(rows)
    print(f"Built {len(docs)} documents")

    chunks = chunk_documents(docs)
    print(f"Created {len(chunks)} chunks")

    ids = [str(uuid.uuid4()) for _ in chunks]

    vs_manager = VectorStoreManager.get_instance()
    vs_manager.add_documents(chunks, ids)

    print(f"\nDone! Ingested {len(ids)} chunks into ChromaDB")
    print(f"Total docs in vector store: {vs_manager.count()}")


def ingest_sample(n=10):
    db = SessionLocal()
    result = db.execute(text(f'SELECT * FROM "Questions" ORDER BY RANDOM() LIMIT {n}'))
    rows = result.fetchall()
    db.close()
    print(f"Sampled {len(rows)} questions from DB")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest questions from PostgreSQL into ChromaDB")
    parser.add_argument("--subject", type=int, default=None, help="Subject ID to filter")
    parser.add_argument("--limit", type=int, default=1000, help="Max questions to ingest")
    parser.add_argument("--sample", type=int, default=None, help="Sample N random questions")
    args = parser.parse_args()

    print(f"Ingesting from PostgreSQL to ChromaDB...")
    print(f"  Subject filter: {args.subject or 'all'}")
    print(f"  Limit: {args.limit}")

    ingest_all(limit=args.limit, subject_id=args.subject)
