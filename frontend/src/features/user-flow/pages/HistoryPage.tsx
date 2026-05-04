import { FlowShell } from "../components/FlowShell";

const rows = [
    { subject: "Toán", date: "Chưa có dữ liệu", score: "-" },
    { subject: "Lý", date: "Chưa có dữ liệu", score: "-" },
];

export function HistoryPage() {
    return (
        <FlowShell
            description="Các lượt thi thử của bạn sẽ xuất hiện tại đây."
            title="Lịch sử thi">
            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
                <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-100 text-zinc-600">
                        <tr>
                            <th className="px-4 py-3 font-medium">Môn</th>
                            <th className="px-4 py-3 font-medium">Thời gian</th>
                            <th className="px-4 py-3 font-medium">Điểm</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200">
                        {rows.map(row => (
                            <tr key={row.subject}>
                                <td className="px-4 py-3 text-zinc-950">{row.subject}</td>
                                <td className="px-4 py-3 text-zinc-500">{row.date}</td>
                                <td className="px-4 py-3 text-zinc-500">{row.score}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </FlowShell>
    );
}
