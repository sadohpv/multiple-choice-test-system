import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FlowShell } from "../components/FlowShell";

export function ContributeQuestionPage() {
    return (
        <FlowShell
            description="Gửi câu hỏi mới để bổ sung cho kho đề luyện tập."
            title="Đóng góp câu hỏi">
            <form className="grid gap-4 rounded-lg border border-zinc-200 bg-white p-5">
                <label className="grid gap-2 text-sm font-medium text-zinc-700">
                    Câu hỏi
                    <Input disabled placeholder="Nhập nội dung câu hỏi" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-zinc-700">
                    Đáp án đúng
                    <Input disabled placeholder="A, B, C hoặc D" />
                </label>
                <Button className="w-full sm:w-fit" disabled>
                    Gửi đóng góp
                </Button>
            </form>
        </FlowShell>
    );
}
