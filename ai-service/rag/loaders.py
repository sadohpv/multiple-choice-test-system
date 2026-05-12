"""Document loaders for various formats."""
from typing import List, Optional
from io import BytesIO
from langchain_core.documents import Document
from langchain_community.document_loaders import (
    TextLoader,
    UnstructuredPDFLoader,
    UnstructuredWordDocumentLoader,
)
import tempfile
import os


def load_text(file_bytes: bytes, filename: str, metadata: Optional[dict] = None) -> List[Document]:
    suffix = os.path.splitext(filename)[1].lower()
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            loader = UnstructuredPDFLoader(tmp_path)
        elif suffix in [".docx", ".doc"]:
            loader = UnstructuredWordDocumentLoader(tmp_path)
        elif suffix in [".txt", ".md"]:
            loader = TextLoader(tmp_path, encoding="utf-8")
        else:
            loader = TextLoader(tmp_path, encoding="utf-8")

        docs = loader.load()
        if metadata:
            for doc in docs:
                doc.metadata.update(metadata)
        return docs
    finally:
        os.unlink(tmp_path)


def load_raw_text(text: str, metadata: Optional[dict] = None) -> List[Document]:
    doc = Document(page_content=text, metadata=metadata or {})
    return [doc]
