# Mezon AI Quiz Assistant - FastAPI + LangChain Service

AI-powered Q&A system cho hệ thống thi trắc nghiệm Mezon. Sử dụng **RAG (Retrieval-Augmented Generation)** với **FastAPI + LangChain + ChromaDB**.

## Architecture

```
┌─────────────────┐
│  React Frontend │  ← Gọi thẳng AI Service (FE → AI, không qua BE)
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐     ┌─────────────────┐
│  FastAPI Server  │────▶│   ChromaDB      │
│  (LangChain RAG)  │     │  (Vector Store) │
└────────┬────────┘     └─────────────────┘
         │
         │ (optional, for ingestion)
         ▼
┌─────────────────┐
│   PostgreSQL    │
└─────────────────┘
```

## Quick Start

### 1. Cài đặt Ollama (LLM local)

```bash
# macOS / Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows: tải từ https://ollama.com/download

# Pull models
ollama pull llama3.2:latest
ollama pull nomic-embed-text:latest

# Kiểm tra
ollama list
```

### 2. Cài đặt Python dependencies

```bash
cd ai-service
pip install -r requirements.txt
```

### 3. Cấu hình

```bash
cp .env.example .env
# Chỉnh sửa .env theo môi trường của bạn
```

### 4. Chạy AI Service

```bash
# Cách 1: Trực tiếp
python main.py

# Cách 2: Uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Service chạy tại: **http://localhost:8000**

Docs tự động: **http://localhost:8000/docs**

### 5. Seed dữ liệu mẫu (optional)

```bash
# Seed 12 câu hỏi mẫu để test
python -m ingest.seed_knowledge
```

### 6. Ingest từ PostgreSQL

```bash
# Ingest tất cả câu hỏi từ DB
python -m ingest.ingest_from_db

# Ingest từ subject cụ thể
python -m ingest.ingest_from_db --subject 1

# Ingest giới hạn 100 câu
python -m ingest.ingest_from_db --limit 100
```

## API Endpoints

### Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/chat` | Gửi câu hỏi, nhận câu trả lời (non-streaming) |
| `POST` | `/chat/stream` | Streaming response |

### Ingestion

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ingest/text` | Ingest văn bản tự do |
| `POST` | `/ingest/questions` | Ingest câu hỏi trắc nghiệm |
| `POST` | `/ingest/file` | Ingest file PDF/DOCX/TXT |
| `POST` | `/ingest/from-db` | Ingest trực tiếp từ PostgreSQL |
| `DELETE` | `/ingest/reset` | Xóa toàn bộ vector store |

### Search

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/search` | Semantic search |
| `GET` | `/search/subject/{subject}` | Search theo môn |

### Status

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/stats` | Vector store stats |
| `GET` | `/db/subjects` | Danh sách môn từ DB |

## Frontend Integration

Frontend gọi thẳng vào AI Service (không qua Backend):

```
VITE_AI_URL=http://localhost:8000
```

```typescript
// src/features/ai/services/aiApi.ts
import { sendChat, streamChat } from "@/features/ai/services/aiApi";

// Non-streaming
const response = await sendChat("Giải thích định lý Pythagore");

// Streaming
for await (const chunk of streamChat("Cách giải bất phương trình?")) {
  console.log(chunk.token);
}
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LLM_PROVIDER` | `ollama` | `ollama` hoặc `openai` |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3.2:latest` | LLM model |
| `OLLAMA_EMBEDDINGS` | `nomic-embed-text:latest` | Embedding model |
| `OPENAI_API_KEY` | - | OpenAI API key (nếu dùng OpenAI) |
| `OPENAI_MODEL` | `gpt-4o-mini` | OpenAI model |
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `postgres` | Database name |
| `DB_USER` | `postgres` | DB username |
| `DB_PASSWORD` | `password` | DB password |
| `CHROMA_PERSIST_DIRECTORY` | `./chroma_db` | ChromaDB storage path |

## Tech Stack

- **FastAPI** - Web framework
- **LangChain** - LLM orchestration & RAG
- **LangChain-Ollama** - Local LLM integration
- **LangChain-OpenAI** - OpenAI integration
- **ChromaDB** - Vector database
- **PostgreSQL** - Source data (questions bank)
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server
