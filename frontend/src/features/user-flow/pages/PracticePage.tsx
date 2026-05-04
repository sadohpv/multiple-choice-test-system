import { Button } from "@/components/ui/Button";
import { FlowShell } from "../components/FlowShell";

export function PracticePage() {
    return (
        <FlowShell
            description="Chọn môn học và bắt đầu một lượt luyện tập khi ngân hàng câu hỏi sẵn sàng."
            title="Thi thử">
            <div className="grid gap-4 sm:grid-cols-3">
                {["Toán", "Lý", "Hóa"].map(subject => (
                    <div key={subject} className="rounded-lg border border-zinc-200 p-4">
                        <h2 className="font-semibold text-zinc-950">{subject}</h2>
                        <p className="mt-2 text-sm text-zinc-500">20 câu hỏi</p>
                        <Button className="mt-4 w-full" disabled variant="outline">
                            Sắp mở
                        </Button>
                    </div>
                ))}
            </div>
        </FlowShell>
    );
}
