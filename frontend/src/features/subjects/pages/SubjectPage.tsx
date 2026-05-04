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
        <div className="flex w-full gap-2 ">
            {data.map(subject => (
                <div className="w-28 h-16">
                    <p>{subject.subjectName}</p>
                    <p>{subject.slug}</p>
                    <p>{subject.createdAt}</p>
                    <p>{typeof subject.createdAt}</p>
                </div>
            ))}
        </div>
    );
}
