import { FlowShell } from "../components/FlowShell";

const statCards = [
    { label: "Điểm", value: "-", accent: "text-indigo-600" },
    { label: "Số câu đúng", value: "-", accent: "text-emerald-600" },
    { label: "Thời gian", value: "-", accent: "text-amber-600" },
];

export function ResultsPage() {
    return (
        <FlowShell
            description="Kết quả sau khi nộp bài sẽ được hiển thị theo từng lượt thi."
            title="Kết quả"
        >
            <div className="grid gap-4 sm:grid-cols-3">
                {statCards.map(card => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-neutral-200 bg-white p-6"
                    >
                        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
                            {card.label}
                        </p>
                        <p className={`mt-2 text-3xl font-bold ${card.accent}`}>{card.value}</p>
                    </div>
                ))}
            </div>
        </FlowShell>
    );
}
