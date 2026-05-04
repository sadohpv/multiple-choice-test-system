import { useState } from "react";

interface CreateSubjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit;
}
export default function CreateSubjectModal({ isOpen, onClose, onSubmit }: CreateSubjectModalProps) {
    const [subjectName, setSubjectName] = useState("");
    const [slug, setSlug] = useState("");

    if (!isOpen) return null;

    const handleSubmit = () => {
        const newSubject = {
            subjectName,
            slug,
            createdAt: Date.now(), // thời gian hiện tại
        };

        onSubmit?.(newSubject);

        // reset form
        setSubjectName("");
        setSlug("");
        onClose?.();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                {/* Header */}
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Create Subject</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black">
                        ✕
                    </button>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-600">Subject Name</label>
                        <input
                            value={subjectName}
                            onChange={e => setSubjectName(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="Enter subject name"
                        />
                    </div>

                    <div>
                        <label className="text-sm text-gray-600">Slug</label>
                        <input
                            value={slug}
                            onChange={e => setSlug(e.target.value)}
                            className="mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
                            placeholder="example-slug"
                        />
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Created At: {new Date().toLocaleString()}</p>
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
