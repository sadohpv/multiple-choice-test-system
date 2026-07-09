"""Seed script - populate vector store with sample quiz knowledge."""
import uuid
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rag.vectorstore import VectorStoreManager
from rag.chunker import chunk_documents
from langchain_core.documents import Document
from datetime import datetime

SAMPLE_KNOWLEDGE = [
    {
        "subject": "Toán",
        "topic": "Đại số",
        "content": """Câu hỏi: Phương trình bậc 2 có dạng ax² + bx + c = 0 (a ≠ 0). Nghiệm của phương trình được tính bằng công thức nào?
Đáp án:
A. x = b² - 4ac
B. x = (-b ± √(b² - 4ac)) / 2a [CORRECT]
C. x = -b / a
D. x = c / b
Giải thích: Công thức nghiệm của phương trình bậc 2 là x = (-b ± √Δ) / 2a với Δ = b² - 4ac"""
    },
    {
        "subject": "Toán",
        "topic": "Hình học",
        "content": """Câu hỏi: Trong tam giác vuông, định lý Pythagore phát biểu rằng:
Đáp án:
A. a + b = c
B. a² + b² = c² [CORRECT]
C. a × b = c
D. a/b = b/c
Giải thích: Trong tam giác vuông, bình phương cạnh huyền bằng tổng bình phương hai cạnh góc vuông: c² = a² + b²"""
    },
    {
        "subject": "Vật lý",
        "topic": "Cơ học",
        "content": """Câu hỏi: Công thức tính vận tốc trung bình là gì?
Đáp án:
A. v = a × t
B. v = s / t [CORRECT]
C. v = s × t
D. v = d / t
Giải thích: Vận tốc trung bình = quãng đường / thời gian = s / t"""
    },
    {
        "subject": "Vật lý",
        "topic": "Điện học",
        "content": """Câu hỏi: Định luật Ohm phát biểu rằng hiệu điện thế V bằng:
Đáp án:
A. V = I / R
B. V = I × R [CORRECT]
C. V = R / I
D. V = I + R
Giải thích: Định luật Ohm: V = I × R, trong đó V là hiệu điện thế (Volt), I là cường độ dòng điện (Ampere), R là điện trở (Ohm)"""
    },
    {
        "subject": "Hóa học",
        "topic": "Nguyên tử",
        "content": """Câu hỏi: Số hiệu nguyên tử (Z) của một nguyên tố hóa học là:
Đáp án:
A. Số neutron
B. Số proton trong hạt nhân [CORRECT]
C. Số electron
D. Số khối
Giải thích: Số hiệu nguyên tử Z = số proton trong hạt nhân = số electron (trong nguyên tử trung hòa)"""
    },
    {
        "subject": "Hóa học",
        "topic": "Phản ứng",
        "content": """Câu hỏi: Phương trình hóa học cần thỏa mãn định luật nào?
Đáp án:
A. Định luật bảo toàn năng lượng
B. Định luật bảo toàn khối lượng [CORRECT]
C. Định luật Coulomb
D. Định luật Avogadro
Giải thích: Định luật bảo toàn khối lượng: tổng khối lượng các chất tham gia = tổng khối lượng các chất sản phẩm"""
    },
    {
        "subject": "Sinh học",
        "topic": "Di truyền",
        "content": """Câu hỏi: ADN (DNA) viết tắt của thuật ngữ tiếng Anh nào?
Đáp án:
A. Acid DeoxyriboNucleic [CORRECT]
B. Acid DioxyriboNucleic
C. Acid DeoxyriboNitric
D. Acid DeoxyriboNuclide
Giải thích: ADN = Acid DeoxyriboNucleic (Axit Deoxyribonucleic) - là vật chất di truyền mang thông tin genetic"""
    },
    {
        "subject": "Tiếng Anh",
        "topic": "Ngữ pháp",
        "content": """Câu hỏi: Which tense is used for actions happening at the moment of speaking?
Đáp án:
A. Simple Present
B. Present Continuous [CORRECT]
C. Present Perfect
D. Past Continuous
Giải thích: Present Continuous (S + am/is/are + V-ing) dùng cho hành động đang xảy ra ngay lúc nói"""
    },
    {
        "subject": "Tin học",
        "topic": "Lập trình",
        "content": """Câu hỏi: Trong Python, hàm print() dùng để:
Đáp án:
A. Nhập dữ liệu từ bàn phím
B. Xuất dữ liệu ra màn hình [CORRECT]
C. Khai báo biến
D. Tạo hàm mới
Giải thích: Hàm print() là hàm xuất dữ liệu, trong khi input() là hàm nhập dữ liệu"""
    },
    {
        "subject": "Lịch sử",
        "topic": "Việt Nam",
        "content": """Câu hỏi: Cách mạng Tháng Tám năm 1945 thành công vào ngày nào?
Đáp án:
A. 2/9/1945
B. 14/8/1945
C. 19/8/1945 [CORRECT]
D. 2/5/1945
Giải thích: Cách mạng Tháng Tám thành công ngày 19/8/1945 tại Hà Nội, sau đó lan rộng cả nước"""
    },
    {
        "subject": "Địa lý",
        "topic": "Việt Nam",
        "content": """Câu hỏi: Việt Nam có bao nhiêu tỉnh, thành phố trực thuộc trung ương tính đến năm 2024?
Đáp án:
A. 63 tỉnh/thành
B. 64 tỉnh/thành
C. 65 tỉnh/thành [CORRECT]
D. 63 tỉnh, 5 thành phố
Giải thích: Việt Nam hiện có 63 tỉnh và 5 thành phố trực thuộc trung ương, tổng cộng 68 đơn vị hành chính cấp tỉnh"""
    },
    {
        "subject": "GDCD",
        "topic": "Quyền và nghĩa vụ",
        "content": """Câu hỏi: Công dân Việt Nam có nghĩa vụ gì theo Hiến pháp?
Đáp án:
A. Chỉ cần tuân thủ pháp luật
B. Trả thuế và bảo vệ Tổ quốc [CORRECT]
C. Chỉ cần lao động
D. Chỉ cần học tập
Giải thích: Công dân có các nghĩa vụ: tuân thủ Hiến pháp và pháp luật, bảo vệ Tổ quốc, nộp thuế, bảo vệ môi trường..."""
    },
]


def seed_knowledge():
    vs_manager = VectorStoreManager.get_instance()
    docs = []

    for item in SAMPLE_KNOWLEDGE:
        doc = Document(
            page_content=item["content"],
            metadata={
                "source": "seed_data",
                "type": "multiple_choice",
                "subject": item["subject"],
                "topic": item["topic"],
                "ingested_at": datetime.now().isoformat(),
            }
        )
        docs.append(doc)

    chunks = chunk_documents(docs)
    ids = [str(uuid.uuid4()) for _ in chunks]

    vs_manager.add_documents(chunks, ids)
    print(f"Seeded {len(chunks)} chunks from {len(SAMPLE_KNOWLEDGE)} sample questions")
    print(f"Total docs in vector store: {vs_manager.count()}")


if __name__ == "__main__":
    print("Seeding sample knowledge into vector store...")
    seed_knowledge()
