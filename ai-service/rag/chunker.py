"""Document chunking utilities using LangChain text splitters."""
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from typing import List


def create_chunker(chunk_size: int = 1000, chunk_overlap: int = 200):
    return RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        add_start_index=True,
    )


def chunk_documents(docs: List[Document], chunk_size: int = 1000, chunk_overlap: int = 200) -> List[Document]:
    """Split documents into overlapping chunks for embedding."""
    if not docs:
        return []
    chunker = create_chunker(chunk_size, chunk_overlap)
    return chunker.split_documents(docs)
