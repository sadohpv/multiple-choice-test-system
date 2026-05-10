"""Embedding model factory - supports OpenAI and Ollama."""
from typing import Optional
from langchain_ollama import OllamaEmbeddings
from langchain_openai import OpenAIEmbeddings
from config import get_settings

_settings = get_settings()


def get_embeddings() -> any:
    """Get the configured embedding model."""
    if _settings.llm_provider == "openai":
        return OpenAIEmbeddings(
            api_key=_settings.openai_api_key,
            model="text-embedding-3-small",
        )
    return OllamaEmbeddings(
        base_url=_settings.ollama_base_url,
        model=_settings.ollama_embeddings,
    )
