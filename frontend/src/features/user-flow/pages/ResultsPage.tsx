import { FlowShell } from "../components/FlowShell";

export function ResultsPage() {
    return (
        <FlowShell
            description="Kết quả sau khi nộp bài sẽ được hiển thị theo từng lượt thi."
            title="Kết quả">
            <div className="grid gap-4 sm:grid-cols-3">
                {[
                    ["Điểm", "-"],
                    ["Số câu đúng", "-"],
                    ["Thời gian", "-"],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-zinc-200 bg-white p-5">
                        <p className="text-sm text-zinc-500">{label}</p>
                        <p className="mt-2 text-2xl font-semibold text-zinc-950">{value}</p>
                    </div>
                ))}
            </div>
        </FlowShell>
    );
}
