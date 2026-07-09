import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FlowShell } from "../components/FlowShell";

export function ContributeQuestionPage() {
    return (
        <FlowShell
            description="Gửi câu hỏi mới để bổ sung cho kho đề luyện tập."
            title="Đóng góp câu hỏi"
        >
            <div className="max-w-lg rounded-xl border border-neutral-200 bg-white p-6">
                <form className="grid gap-4">
                    <div className="grid gap-1.5">
                        <label className="text-sm font-medium text-neutral-700">
                            Câu hỏi
                        </label>
                        <Input disabled placeholder="Nhập nội dung câu hỏi" />
                    </div>
                    <div className="grid gap-1.5">
                        <label className="text-sm font-medium text-neutral-700">
                            Đáp án đúng
                        </label>
                        <Input disabled placeholder="A, B, C hoặc D" />
                    </div>
                    <div className="pt-1">
                        <Button className="w-full sm:w-auto" disabled variant="accent">
                            Gửi đóng góp
                        </Button>
                        <p className="mt-2 text-xs text-neutral-400">
                            Tính năng này đang trong giai đoạn phát triển.
                        </p>
                    </div>
                </form>
            </div>
        </FlowShell>
    );
}
