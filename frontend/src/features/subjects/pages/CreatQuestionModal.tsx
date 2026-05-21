import type { ISubjectEntity } from "@/constants/entity";
import { useState } from "react";

type Answer = {
    description: string;
    isValid: boolean;
};

type QuestionForm = {
    description: string;
    content: string;
    subjectId: string;
    answers: Answer[];
};

type Props = {
    onClose: () => void;
    subjects: ISubjectEntity[];
};

const emptyAnswer: Answer = {
    description: "",
    isValid: false,
};

const initialState: QuestionForm = {
    description: "",
    content: "",
    subjectId: "",
    answers: [emptyAnswer],
};

export default function QuestionModal({ onClose, subjects }: Props) {
    const [form, setForm] = useState<QuestionForm>(initialState);

    const setField = <K extends keyof QuestionForm>(key: K, value: QuestionForm[K]) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const setAnswer = <K extends keyof Answer>(index: number, key: K, value: Answer[K]) => {
        setForm(prev => {
            const updated = [...prev.answers];
            updated[index] = { ...updated[index], [key]: value };
            return { ...prev, answers: updated };
        });
    };

    const addAnswer = () => {
        setForm(prev => ({
            ...prev,
            answers: [...prev.answers, emptyAnswer],
        }));
    };

    const removeAnswer = (index: number) => {
        setForm(prev => ({
            ...prev,
            answers: prev.answers.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        console.log("form: ", form);

        if (!form.subjectId) {
            alert("Please select subject");
            return;
        }

        const payload = {
            description: form.description,
            content: form.content,
            subjectId: form.subjectId,
            answers: form.answers,
        };
        console.log("payload: ", payload);

        try {
            const res = await fetch("http://localhost:8080/api/questions/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error("Failed to create question");
            }

            const data = await res.json();
            console.log("Created:", data);

            onClose();
        } catch (err) {
            console.error(err);
            alert("Create question failed");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Create Question</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Description */}
                    <div>
                        <label className="text-sm text-gray-600">Description</label>
                        <input
                            value={form.description}
                            onChange={e => setField("description", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter question description"
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="text-sm text-gray-600">Content</label>
                        <textarea
                            value={form.content}
                            onChange={e => setField("content", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter question content"
                            rows={3}
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="text-sm text-gray-600">Subject</label>
                        <select
                            value={form.subjectId}
                            onChange={e => setField("subjectId", e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500">
                            <option value="">Select subject</option>
                            {subjects.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Answers */}
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="text-sm text-gray-600">Answers</label>
                            <button onClick={addAnswer} className="text-sm text-blue-600 hover:underline">
                                + Add answer
                            </button>
                        </div>

                        <div className="mt-2 space-y-3">
                            {form.answers.map((a, i) => (
                                <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
                                    <input
                                        value={a.description}
                                        onChange={e => setAnswer(i, "description", e.target.value)}
                                        className="flex-1 rounded-md border px-2 py-1 text-sm outline-none focus:border-blue-500"
                                        placeholder="Answer"
                                    />

                                    <label className="flex items-center gap-1 text-sm text-gray-600">
                                        <input
                                            type="checkbox"
                                            checked={a.isValid}
                                            onChange={e => setAnswer(i, "isValid", e.target.checked)}
                                        />
                                        Correct
                                    </label>

                                    <button
                                        onClick={() => removeAnswer(i)}
                                        className="text-sm text-red-500 hover:underline">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
}
