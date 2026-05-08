import { FlowShell } from "../components/FlowShell";

const rows = [
    { subject: "Toán", date: "Chưa có dữ liệu", score: "-" },
    { subject: "Lý", date: "Chưa có dữ liệu", score: "-" },
];

export function HistoryPage() {
    return (
        <FlowShell
            description="Các lượt thi thử của bạn sẽ xuất hiện tại đây."
            title="Lịch sử thi"
        >
            <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-neutral-100 bg-neutral-50">
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                Môn
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                Thời gian
                            </th>
                            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                Điểm
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {rows.map(row => (
                            <tr key={row.subject} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-5 py-3.5 font-medium text-neutral-800">{row.subject}</td>
                                <td className="px-5 py-3.5 text-neutral-400">{row.date}</td>
                                <td className="px-5 py-3.5 text-neutral-400">{row.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FlowShell>
    );
}
