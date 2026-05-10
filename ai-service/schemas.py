"""Pydantic schemas for API request/response validation."""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal, Any
from datetime import datetime


# --- Chat Schemas ---

class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000, description="Câu hỏi của người dùng")
    session_id: Optional[str] = Field(None, description="ID phiên hội thoại để duy trì ngữ cảnh")
    subject_id: Optional[int] = Field(None, description="Lọc theo môn học cụ thể")
    top_k: int = Field(5, ge=1, le=20, description="Số lượng documents để truy xuất")


class SourceDocument(BaseModel):
    content: str
    metadata: dict
    score: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDocument] = []
    session_id: str
    citations: Optional[List[str]] = None


class ChatStreamRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=4000)
    session_id: Optional[str] = None
    subject_id: Optional[int] = None
    top_k: int = Field(5, ge=1, le=20)


# --- Ingestion Schemas ---

class IngestTextRequest(BaseModel):
    content: str = Field(..., description="Nội dung văn bản để ingest")
    title: Optional[str] = Field(None, description="Tiêu đề tài liệu")
    subject: Optional[str] = Field(None, description="Môn học")
    topic: Optional[str] = Field(None, description="Chủ đề")
    difficulty: Optional[int] = Field(None, ge=1, le=3, description="Độ khó (1=Dễ, 2=Trung bình, 3=Khó)")
    metadata: Optional[dict] = Field(default_factory=dict, description="Metadata bổ sung")


class IngestQuestionsRequest(BaseModel):
    questions: List[dict] = Field(..., description="Danh sách câu hỏi dạng dict")
    subject: Optional[str] = Field(None, description="Môn học mặc định")


class IngestResult(BaseModel):
    ingested: int
    failed: int
    ids: List[str]
    message: str


# --- Search Schemas ---

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    top_k: int = Field(5, ge=1, le=20)
    subject: Optional[str] = None


class SearchResult(BaseModel):
    content: str
    metadata: dict
    score: float


class SearchResponse(BaseModel):
    results: List[SearchResult]
    total: int


# --- Health & Status ---

class HealthResponse(BaseModel):
    status: str
    vectorstore_doc_count: int
    db_connected: bool
    llm_provider: str
    llm_model: str


class VectorStatsResponse(BaseModel):
    total_documents: int
    subjects: List[str]
    topics: List[str]
