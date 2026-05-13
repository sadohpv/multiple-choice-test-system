import { Button } from "@/components/ui/Button";
import { useSubjectsStore } from "@/lib/store/subjects.store";
import { FlowShell } from "../components/FlowShell";

export function PracticePage() {
    const subjects = useSubjectsStore(state => state.subjects);

    return (
        <FlowShell
            description="Chọn môn học và bắt đầu một lượt luyện tập khi ngân hàng câu hỏi sẵn sàng."
            title="Thi thử">
            <div className="grid gap-4 sm:grid-cols-3">
                {subjects.map(subject => {
                    const subjectName = subject.name ?? subject.subjectName ?? subject.slug;

                    return (
                        <div
                            key={subject.id ?? subjectName}
                            className="rounded-xl border border-neutral-200 bg-white p-5 hover-lift">
                            <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg border text-sm font-semibold">
                                {subjectName}
                            </div>
                            <h2 className="text-sm font-semibold text-neutral-900">{subjectName}</h2>
                            <Button className="mt-4 w-full" disabled variant="outline" size="sm">
                                Sắp mở
                            </Button>
                        </div>
                    );
                })}
            </div>
        </FlowShell>
    );
}
