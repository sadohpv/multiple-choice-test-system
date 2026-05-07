import { Button } from "@/components/ui/Button";
import { FlowShell } from "../components/FlowShell";

const subjects = [
    { name: "Toán", count: 20, color: "bg-indigo-50 border-indigo-100 text-indigo-600" },
    { name: "Lý", count: 20, color: "bg-emerald-50 border-emerald-100 text-emerald-600" },
    { name: "Hóa", count: 20, color: "bg-amber-50 border-amber-100 text-amber-600" },
];

export function PracticePage() {
    return (
        <FlowShell
            description="Chọn môn học và bắt đầu một lượt luyện tập khi ngân hàng câu hỏi sẵn sàng."
            title="Thi thử"
        >
            <div className="grid gap-4 sm:grid-cols-3">
                {subjects.map(subject => (
                    <div
                        key={subject.name}
                        className="rounded-xl border border-neutral-200 bg-white p-5 hover-lift"
                    >
                        <div className={`mb-4 inline-flex size-10 items-center justify-center rounded-lg border text-sm font-semibold ${subject.color}`}>
                            {subject.name[0]}
                        </div>
                        <h2 className="text-sm font-semibold text-neutral-900">{subject.name}</h2>
                        <p className="mt-1 text-xs text-neutral-400">{subject.count} câu hỏi</p>
                        <Button className="mt-4 w-full" disabled variant="outline" size="sm">
                            Sắp mở
                        </Button>
                    </div>
                ))}
            </div>
        </FlowShell>
    );
}
