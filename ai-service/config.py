"""Application settings loaded from environment variables."""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "postgres"
    db_user: str = "postgres"
    db_password: str = "password"

    # Vector Store (Chroma)
    chroma_persist_directory: str = "./chroma_db"

    # LLM Provider: "openai" | "ollama"
    llm_provider: str = "ollama"
    # OpenAI
    openai_api_key: str = ""
    openai_model: str = "gpt-4o-mini"
    # Ollama
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "llama3.2:latest"
    ollama_embeddings: str = "nomic-embed-text:latest"

    # Embedding
    embedding_model: str = "nomic-embed-text"
    embedding_dim: int = 768

    # Server
    host: str = "0.0.0.0"
    port: int = 8000
    cors_origins: str = "*"

    class Config:
        env_file = ".env"
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
