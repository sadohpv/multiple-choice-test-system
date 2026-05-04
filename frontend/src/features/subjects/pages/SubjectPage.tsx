import type { SubjectEntity } from "@/constants/entity";
import { useApi } from "@/lib/Context/useAPI";
import { useEffect, useState } from "react";

export function SubjectPage() {
    const api = useApi();
    const [data, setData] = useState<SubjectEntity[]>([]);

    useEffect(() => {
        const load = async () => {
            const data = await api.get("/subjects");
            setData(data);
        };
        load();
    }, []);

    return (
        <div className="flex flex-wrap gap-4 w-full">
            {data.map((subject, index) => (
                <div
                    key={subject.id ?? index}
                    className="w-56 rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="mb-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">{subject.subjectName}</p>
                        <p className="text-xs text-gray-500">{subject.slug}</p>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-gray-600">
                        <p>
                            <span className="font-medium text-gray-500">Created:</span> {String(subject.createdAt)}
                        </p>
                        <p>
                            <span className="font-medium text-gray-500">Type:</span> {typeof subject.createdAt}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}
