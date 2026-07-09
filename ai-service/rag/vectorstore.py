"""Vector store (ChromaDB) management."""
import os
from typing import Optional, List, Dict, Any
from langchain_chroma import Chroma
from langchain_core.documents import Document
from models.embeddings import get_embeddings
from config import get_settings

_settings = get_settings()


class VectorStoreManager:
    _instance: Optional["VectorStoreManager"] = None

    def __init__(self):
        self.persist_dir = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            _settings.chroma_persist_directory
        )
        self._vectorstore: Optional[Chroma] = None

    @classmethod
    def get_instance(cls) -> "VectorStoreManager":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def get_vectorstore(self) -> Chroma:
        if self._vectorstore is None:
            os.makedirs(self.persist_dir, exist_ok=True)
            embeddings = get_embeddings()
            self._vectorstore = Chroma(
                persist_directory=self.persist_dir,
                embedding_function=embeddings,
                collection_name="quiz_knowledge_base",
            )
        return self._vectorstore

    def add_documents(self, documents: List[Document], ids: Optional[List[str]] = None) -> List[str]:
        vs = self.get_vectorstore()
        return vs.add_documents(documents=documents, ids=ids)

    def similarity_search(
        self, query: str, k: int = 5, filter: Optional[Dict[str, Any]] = None
    ) -> List[Document]:
        vs = self.get_vectorstore()
        return vs.similarity_search(query=query, k=k, filter=filter)

    def similarity_search_with_score(
        self, query: str, k: int = 5, filter: Optional[Dict[str, Any]] = None
    ) -> List[tuple[Document, float]]:
        vs = self.get_vectorstore()
        return vs.similarity_search_with_score(query=query, k=k, filter=filter)

    def delete(self, ids: Optional[List[str]] = None, where: Optional[Dict] = None) -> None:
        vs = self.get_vectorstore()
        vs.delete(ids=ids, where=where)

    def count(self) -> int:
        vs = self.get_vectorstore()
        return vs._collection.count()

    def reset(self) -> None:
        """Delete all documents from the vector store."""
        self._vectorstore = None
        import shutil
        if os.path.exists(self.persist_dir):
            shutil.rmtree(self.persist_dir)


def get_vectorstore() -> Chroma:
    return VectorStoreManager.get_instance().get_vectorstore()
