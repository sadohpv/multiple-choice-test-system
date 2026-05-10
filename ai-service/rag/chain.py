"""RAG chain builder - assembles retrieval + generation pipeline."""
from typing import Optional, Dict, Any
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate
from models.llm import get_llm
from rag.vectorstore import get_vectorstore

SYSTEM_PROMPT = """Bạn là một trợ lý AI chuyên nghiệp trong hệ thống thi trắc nghiệm Mezon.
Nhiệm vụ của bạn là trả lời các câu hỏi liên quan đến:
- Câu hỏi trắc nghiệm và đáp án
- Kiến thức các môn học (Toán, Lý, Hóa, Sinh, Văn, Sử, Địa, Anh...)
- Cách giải bài tập, giải thích đáp án
- Thông tin về các kỳ thi, bài kiểm tra
- Mẹo học tập và ôn thi hiệu quả

Sử dụng thông tin được cung cấp trong ngữ cảnh (context) để trả lời CHÍNH XÁC và CHI TIẾT.
Nếu câu hỏi không liên quan đến kiến thức trong context, hãy trả lời dựa trên hiểu biết chung của bạn.
Khi có câu hỏi về đáp án, hãy giải thích rõ TẠI SAO đáp án đó đúng và các đáp án khác sai.

Trả lời bằng tiếng Việt, ngắn gọn và dễ hiểu.
"""


class RagChainBuilder:
    def __init__(self):
        self._chain: Optional[Any] = None

    def build(self, k: int = 5) -> Any:
        """Build the basic RAG chain (retrieval + answer)."""
        if self._chain is None:
            llm = get_llm(temperature=0.2)
            vectorstore = get_vectorstore()

            retriever = vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": k}
            )

            qa_prompt = ChatPromptTemplate.from_messages([
                ("system", SYSTEM_PROMPT),
                ("human", "Ngữ cảnh:\n{context}\n\nCâu hỏi: {input}"),
            ])

            qa_chain = create_stuff_documents_chain(llm, qa_prompt, document_variable_name="context")
            self._chain = create_retrieval_chain(retriever, qa_chain)

        return self._chain

    def invoke(self, question: str, chat_history: Optional[list] = None) -> Dict[str, Any]:
        """Invoke the RAG chain."""
        chain = self.build()
        result = chain.invoke({
            "input": question,
            "chat_history": chat_history or []
        })
        return result


_rag_builder = RagChainBuilder()


def get_rag_chain() -> RagChainBuilder:
    return _rag_builder
