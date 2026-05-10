"""FastAPI application for AI Quiz Assistant - RAG-powered Q&A system.

Architecture:
  Frontend (React) → FastAPI AI Service → ChromaDB Vector Store
                                   ↘ PostgreSQL (source data)

Key features:
  - RAG-based Q&A with source citations
  - Document ingestion from text/files/questions
  - Conversation history support
  - Subject/topic filtering
  - Streaming responses
"""

import uuid
import json
from datetime import datetime
from typing import List, Optional, Dict, Any

from fastapi import FastAPI, HTTPException, UploadFile, File, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import asyncio

from config import get_settings
from database import test_connection, engine, SessionLocal, text
from schemas import (
    ChatRequest, ChatResponse, ChatStreamRequest, ChatMessage,
    IngestTextRequest, IngestQuestionsRequest, IngestResult,
    SearchRequest, SearchResponse, SearchResult,
    HealthResponse, VectorStatsResponse, SourceDocument,
)
from rag.vectorstore import get_vectorstore, VectorStoreManager
from rag.loaders import load_raw_text
from rag.chunker import chunk_documents
from rag.chain import get_rag_chain
from models.llm import get_llm
from models.embeddings import get_embeddings

settings = get_settings()

app = FastAPI(
    title="Mezon AI Quiz Assistant",
    description="AI-powered Q&A system for quiz/test preparation using RAG",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session storage (replace with Redis in production)
chat_sessions: Dict[str, List[Dict[str, str]]] = {}


# =============================================================================
# Utility Functions
# =============================================================================

def get_or_create_session(session_id: Optional[str]) -> tuple[str, List[Dict[str, str]]]:
    if session_id and session_id in chat_sessions:
        return session_id, chat_sessions[session_id]
    new_id = session_id or str(uuid.uuid4())
    chat_sessions[new_id] = []
    return new_id, chat_sessions[new_id]


# =============================================================================
# Health & Status Endpoints
# =============================================================================

@app.get("/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    """Check health status of all service dependencies."""
    vs_manager = VectorStoreManager.get_instance()
    db_ok = test_connection()
    return HealthResponse(
        status="healthy" if db_ok else "degraded",
        vectorstore_doc_count=vs_manager.count(),
        db_connected=db_ok,
        llm_provider=settings.llm_provider,
        llm_model=settings.ollama_model if settings.llm_provider == "ollama" else settings.openai_model,
    )


@app.get("/stats", response_model=VectorStatsResponse, tags=["Status"])
async def get_stats():
    """Get vector store statistics."""
    vs_manager = VectorStoreManager.get_instance()
    vs = vs_manager.get_vectorstore()
    try:
        all_data = vs.get(include=["metadatas"])
        subjects = set()
        topics = set()
        for meta in (all_data.get("metadatas") or []):
            if meta.get("subject"):
                subjects.add(meta["subject"])
            if meta.get("topic"):
                topics.add(meta["topic"])
        return VectorStatsResponse(
            total_documents=vs_manager.count(),
            subjects=sorted(subjects),
            topics=sorted(topics),
        )
    except Exception:
        return VectorStatsResponse(total_documents=vs_manager.count(), subjects=[], topics=[])


# =============================================================================
# Chat Endpoints
# =============================================================================

@app.post("/chat", response_model=ChatResponse, tags=["Chat"])
async def chat(request: ChatRequest):
    """Process a chat message and return an RAG-augmented response."""
    try:
        session_id, history = get_or_create_session(request.session_id)

        rag_chain = get_rag_chain()

        retrieval_filter = {}
        if request.subject_id:
            retrieval_filter["subject_id"] = request.subject_id

        docs_with_scores = []
        if retrieval_filter:
            docs_with_scores = get_vectorstore().similarity_search_with_score(
                request.message, k=request.top_k, filter=retrieval_filter
            )
        else:
            docs_with_scores = get_vectorstore().similarity_search_with_score(
                request.message, k=request.top_k
            )

        retrieved_docs = [doc for doc, score in docs_with_scores]

        context = "\n\n---\n\n".join([
            f"[Nguồn: {doc.metadata.get('source', 'Unknown')}] {doc.page_content}"
            for doc in retrieved_docs
        ])

        if not context:
            context = "Không tìm thấy tài liệu liên quan trong cơ sở kiến thức."

        chat_history_str = "\n".join([
            f"User: {msg['role'] == 'user' and msg['content'] or msg['content']}"
            for msg in history[-6:]
        ] if False else [])

        full_prompt = f"""Bạn là trợ lý AI chuyên về kiến thức trắc nghiệm của hệ thống Mezon.
Hãy trả lời dựa trên ngữ cảnh được cung cấp. Nếu ngữ cảnh không đủ, bổ sung bằng hiểu biết chung.

Ngữ cảnh:
{context}

Lịch sử hội thoại:
{chat_history_str}

Câu hỏi: {request.message}

Trả lời (bằng tiếng Việt):"""

        llm = get_llm(temperature=0.3)
        answer = await asyncio.to_thread(lambda: llm.invoke(full_prompt))

        if hasattr(answer, "content"):
            answer_text = answer.content
        elif isinstance(answer, str):
            answer_text = answer
        else:
            answer_text = str(answer)

        history.append({"role": "user", "content": request.message})
        history.append({"role": "assistant", "content": answer_text})

        sources = [
            SourceDocument(
                content=doc.page_content[:500] + "..." if len(doc.page_content) > 500 else doc.page_content,
                metadata=doc.metadata,
                score=round(score, 4)
            )
            for doc, score in docs_with_scores
        ]

        return ChatResponse(
            answer=answer_text,
            sources=sources,
            session_id=session_id,
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi xử lý chat: {str(e)}")


@app.post("/chat/stream", tags=["Chat"])
async def chat_stream(request: ChatStreamRequest):
    """Streaming chat endpoint for real-time AI responses."""
    async def event_generator():
        try:
            session_id, history = get_or_create_session(request.session_id)

            retrieval_filter = {}
            if request.subject_id:
                retrieval_filter["subject_id"] = request.subject_id

            docs_with_scores = []
            if retrieval_filter:
                docs_with_scores = get_vectorstore().similarity_search_with_score(
                    request.message, k=request.top_k, filter=retrieval_filter
                )
            else:
                docs_with_scores = get_vectorstore().similarity_search_with_score(
                    request.message, k=request.top_k
                )

            retrieved_docs = [doc for doc, _ in docs_with_scores]

            context = "\n\n".join([
                f"[{doc.metadata.get('source', 'N/A')}] {doc.page_content}"
                for doc in retrieved_docs
            ]) or "Không tìm thấy tài liệu liên quan."

            full_prompt = f"""Bạn là trợ lý AI chuyên về kiến thức trắc nghiệm. Trả lời bằng tiếng Việt.

Ngữ cảnh:
{context}

Câu hỏi: {request.message}

Trả lời:"""

            llm = get_llm(temperature=0.3, streaming=True)
            full_response = ""

            for chunk in llm.stream(full_prompt):
                if hasattr(chunk, "content"):
                    token = chunk.content
                else:
                    token = str(chunk)
                full_response += token
                yield f"data: {json.dumps({'token': token, 'done': False})}\n\n"

            history.append({"role": "user", "content": request.message})
            history.append({"role": "assistant", "content": full_response})

            yield f"data: {json.dumps({'token': '', 'done': True, 'session_id': session_id})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'error': str(e), 'done': True})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        }
    )


# =============================================================================
# Ingestion Endpoints
# =============================================================================

@app.post("/ingest/text", response_model=IngestResult, tags=["Ingestion"])
async def ingest_text(request: IngestTextRequest):
    """Ingest raw text into the vector store."""
    try:
        from langchain_core.documents import Document

        metadata = {
            **(request.metadata or {}),
            "source": request.title or "raw_text",
            "subject": request.subject,
            "topic": request.topic,
            "difficulty": request.difficulty,
            "ingested_at": datetime.now().isoformat(),
        }

        docs = load_raw_text(request.content, metadata)
        chunks = chunk_documents(docs)

        if not chunks:
            return IngestResult(ingested=0, failed=0, ids=[], message="No chunks generated")

        ids = [str(uuid.uuid4()) for _ in chunks]
        vs_manager = VectorStoreManager.get_instance()
        vs_manager.add_documents(chunks, ids)

        return IngestResult(
            ingested=len(ids),
            failed=0,
            ids=ids,
            message=f"Successfully ingested {len(ids)} chunks",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi ingest text: {str(e)}")


@app.post("/ingest/questions", response_model=IngestResult, tags=["Ingestion"])
async def ingest_questions(request: IngestQuestionsRequest):
    """Ingest questions with answers into the vector store from structured data."""
    try:
        from langchain_core.documents import Document

        chunks_to_add = []
        ids = []

        for i, q in enumerate(request.questions):
            question_text = q.get("question", q.get("content", ""))
            answers_text = ""
            for j, ans in enumerate(q.get("answers", [])):
                correct_marker = " [CORRECT]" if ans.get("valid", ans.get("correct", False)) else ""
                answers_text += f"{chr(65+j)}. {ans.get('description', ans.get('text', ''))}{correct_marker}\n"

            difficulty_map = {1: "Dễ", 2: "Trung bình", 3: "Khó"}
            diff_label = difficulty_map.get(q.get("difficulty", 0), "")

            full_content = (
                f"Câu hỏi: {question_text}\n"
                f"Đáp án:\n{answers_text}"
                f"Giải thích: {q.get('explanation', 'Không có giải thích')}"
            )

            doc = Document(
                page_content=full_content,
                metadata={
                    "source": "question_bank",
                    "type": "multiple_choice",
                    "subject": q.get("subject", request.subject),
                    "topic": q.get("topic", ""),
                    "difficulty": q.get("difficulty"),
                    "difficulty_label": diff_label,
                    "question_id": q.get("id", i),
                    "correct_answer": next(
                        (chr(65+j) for j, a in enumerate(q.get("answers", []))
                         if a.get("valid", a.get("correct", False))),
                        None
                    ),
                    "ingested_at": datetime.now().isoformat(),
                }
            )
            chunks = chunk_documents([doc])
            chunks_to_add.extend(chunks)
            ids.extend([str(uuid.uuid4()) for _ in chunks])

        if not chunks_to_add:
            return IngestResult(ingested=0, failed=0, ids=[], message="No questions to ingest")

        vs_manager = VectorStoreManager.get_instance()
        vs_manager.add_documents(chunks_to_add, ids)

        return IngestResult(
            ingested=len(ids),
            failed=0,
            ids=ids,
            message=f"Successfully ingested {len(chunks_to_add)} chunks from {len(request.questions)} questions",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi ingest questions: {str(e)}")


@app.post("/ingest/file", response_model=IngestResult, tags=["Ingestion"])
async def ingest_file(
    file: UploadFile = File(...),
    subject: Optional[str] = Form(None),
    topic: Optional[str] = Form(None),
    chunk_size: int = Form(1000),
    chunk_overlap: int = Form(200),
):
    """Ingest a PDF, DOCX, or TXT file into the vector store."""
    try:
        contents = await file.read()
        from rag.loaders import load_text

        metadata = {
            "source": file.filename,
            "subject": subject,
            "topic": topic,
            "ingested_at": datetime.now().isoformat(),
        }

        docs = load_text(contents, file.filename, metadata)
        chunks = chunk_documents(docs, chunk_size=chunk_size, chunk_overlap=chunk_overlap)

        if not chunks:
            return IngestResult(ingested=0, failed=0, ids=[], message="No content extracted")

        ids = [str(uuid.uuid4()) for _ in chunks]
        vs_manager = VectorStoreManager.get_instance()
        vs_manager.add_documents(chunks, ids)

        return IngestResult(
            ingested=len(ids),
            failed=0,
            ids=ids,
            message=f"Successfully ingested {file.filename} ({len(ids)} chunks)",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi ingest file: {str(e)}")


@app.delete("/ingest/reset", tags=["Ingestion"])
async def reset_vectorstore():
    """Reset (clear) the entire vector store. Use with caution."""
    vs_manager = VectorStoreManager.get_instance()
    vs_manager.reset()
    return {"message": "Vector store has been reset"}


# =============================================================================
# Search Endpoints
# =============================================================================

@app.post("/search", response_model=SearchResponse, tags=["Search"])
async def search(request: SearchRequest):
    """Semantic search over the knowledge base."""
    try:
        vs_manager = VectorStoreManager.get_instance()
        filter_dict = {"subject": request.subject} if request.subject else None

        if filter_dict:
            results = vs_manager.similarity_search_with_score(
                request.query, k=request.top_k, filter=filter_dict
            )
        else:
            results = vs_manager.similarity_search_with_score(
                request.query, k=request.top_k
            )

        search_results = [
            SearchResult(
                content=doc.page_content[:800],
                metadata=doc.metadata,
                score=round(score, 4)
            )
            for doc, score in results
        ]

        return SearchResponse(results=search_results, total=len(search_results))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi search: {str(e)}")


@app.get("/search/subject/{subject}", response_model=SearchResponse, tags=["Search"])
async def search_by_subject(
    subject: str,
    query: str = Query(..., min_length=1),
    top_k: int = Query(5, ge=1, le=20),
):
    """Search within a specific subject."""
    return await search(SearchRequest(query=query, top_k=top_k, subject=subject))


# =============================================================================
# Database Integration Endpoints
# =============================================================================

@app.post("/ingest/from-db", response_model=IngestResult, tags=["Ingestion"])
async def ingest_from_database(
    subject_ids: Optional[str] = Query(None, description="Comma-separated subject IDs"),
    limit: int = Query(1000, ge=1, le=10000),
):
    """Ingest questions from the PostgreSQL database into the vector store."""
    try:
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
        if subject_ids:
            id_list = [int(x.strip()) for x in subject_ids.split(",")]
            query += " WHERE q.subject_id = ANY(:subject_ids)"
            params["subject_ids"] = id_list

        query += " ORDER BY q.id LIMIT :limit"
        params["limit"] = limit

        result = db.execute(text(query), params)
        rows = result.fetchall()

        db.close()

        question_map: Dict[int, Dict[str, Any]] = {}
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

        questions = list(question_map.values())

        if not questions:
            return IngestResult(
                ingested=0, failed=0, ids=[],
                message="No questions found in the database with given criteria"
            )

        return await ingest_questions(IngestQuestionsRequest(questions=questions))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi ingest from DB: {str(e)}")


@app.get("/db/subjects", tags=["Database"])
async def list_db_subjects():
    """List all subjects from the database."""
    try:
        db = SessionLocal()
        result = db.execute(text('SELECT id, name FROM "Subject" ORDER BY name'))
        subjects = [{"id": row.id, "name": row.name} for row in result.fetchall()]
        db.close()
        return subjects
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi lấy subjects: {str(e)}")


@app.get("/db/questions/count", tags=["Database"])
async def get_db_question_count(subject_id: Optional[int] = None):
    """Get total question count from database."""
    try:
        db = SessionLocal()
        if subject_id:
            result = db.execute(
                text('SELECT COUNT(*) FROM "Questions" WHERE subject_id = :sid'),
                {"sid": subject_id}
            )
        else:
            result = db.execute(text('SELECT COUNT(*) FROM "Questions"'))
        count = result.scalar()
        db.close()
        return {"count": count}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lỗi đếm questions: {str(e)}")


# =============================================================================
# Startup
# =============================================================================

@app.on_event("startup")
async def startup_event():
    print(f"\n{'='*60}")
    print(f"Mezon AI Quiz Assistant")
    print(f"{'='*60}")
    print(f"LLM Provider: {settings.llm_provider}")
    if settings.llm_provider == "openai":
        print(f"OpenAI Model: {settings.openai_model}")
    else:
        print(f"Ollama URL: {settings.ollama_base_url}")
        print(f"Ollama Model: {settings.ollama_model}")
        print(f"Embeddings: {settings.ollama_embeddings}")
    print(f"ChromaDB Dir: {settings.chroma_persist_directory}")
    print(f"DB Connected: {test_connection()}")
    print(f"Vector Store Docs: {VectorStoreManager.get_instance().count()}")
    print(f"{'='*60}\n")
    get_embeddings()


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=True,
    )
