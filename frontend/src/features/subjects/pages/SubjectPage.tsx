import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FlowShell } from "@/features/user-flow/components/FlowShell";
import { useSubjectsStore } from "@/lib/store/subjects.store";
import { useModal } from "react-modal-hook";
import CreateSubjectModal from "./CreateSubjectModal";
import { apiService } from "@/services/apiService";
import { Icons } from "@/components/Icons";
import CreateQuestionModal from "./CreatQuestionModal";

export function SubjectPage() {
    const subjects = useSubjectsStore(state => state.subjects);

    const [openModalCreateSubject, closeModalCreateSubject] = useModal(() => {
        return <CreateSubjectModal onClose={closeModalCreateSubject} />;
    }, []);

    const [openModalCreateQuestion, closeModalCreateQuestion] = useModal(() => {
        return <CreateQuestionModal onClose={closeModalCreateQuestion} subjects={subjects} />;
    }, [subjects]);

    const handleDeleteSubject = async (id: string) => {
        await apiService.deleteSubject({
            id,
        });
    };

    return (
        <FlowShell
            description="Chọn môn học và bắt đầu một lượt luyện tập khi ngân hàng câu hỏi sẵn sàng."
            title="Subjects">
            <div className="flex items-center justify-between w-full pb-4">
                <Input className="w-1/3" placeholder="Enter subject name or slug..." />
                <div className="flex gap-2">
                    <Button
                        onClick={openModalCreateQuestion}
                        className="cursor-pointer bg-green-500 h-10 px-2 flex items-center justify-center"
                        aria-label="Add subject">
                        Create New Question
                    </Button>
                    <Button
                        onClick={openModalCreateSubject}
                        className="cursor-pointer bg-green-500 h-10 px-2 flex items-center justify-center"
                        aria-label="Add subject">
                        Create New Subject
                    </Button>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                {subjects.map(subject => (
                    <div
                        key={subject.name}
                        className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 hover-lift">
                        <div className="flex items-center gap-4">
                            <div className="inline-flex h-10 items-center justify-center rounded-lg border px-3 text-sm font-semibold bg-neutral-50">
                                {subject.name}
                            </div>

                            <span className="text-sm text-neutral-500">Thi thử trực tuyến</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                                <span className="flex items-center gap-1">
                                    <b className="font-semibold text-neutral-700">{subject.questionCount || 0}</b>
                                    question
                                </span>
                                <span className="text-neutral-300">|</span>
                                <span className="flex items-center gap-1">
                                    <b className="font-semibold text-neutral-700">{subject.examCodeCount || 0}</b> exam
                                    code
                                </span>
                            </div>
                            <Button className="w-28" disabled variant="outline" size="sm">
                                Sắp mở
                            </Button>
                            <Button
                                className="size-10 bg-red-500 text-white hover:text-black cursor-pointer p-0"
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteSubject(subject.id)}>
                                <Icons.TrashIcon className="size-5!" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </FlowShell>
    );
}
