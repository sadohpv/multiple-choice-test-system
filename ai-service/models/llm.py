"""LLM model factory - supports OpenAI and Ollama via LangChain."""
from typing import Optional, List, Dict, Any
from langchain_ollama import ChatOllama
from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage
from config import get_settings

_settings = get_settings()


def get_llm(temperature: float = 0.3, streaming: bool = False) -> any:
    """Get the configured LLM."""
    if _settings.llm_provider == "openai":
        return ChatOpenAI(
            api_key=_settings.openai_api_key,
            model=_settings.openai_model,
            temperature=temperature,
            streaming=streaming,
        )
    return ChatOllama(
        base_url=_settings.ollama_base_url,
        model=_settings.ollama_model,
        temperature=temperature,
        stream=streaming,
    )
