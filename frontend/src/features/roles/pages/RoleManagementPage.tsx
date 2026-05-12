import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { RoleEntity } from "@/constants/entity";
import { useApi } from "@/lib/Context/useAPI";

type RoleFormState = {
    roleName: string;
    description: string;
    roleLevel: string;
};

const EMPTY_FORM: RoleFormState = {
    roleName: "",
    description: "",
    roleLevel: "",
};

export function RoleManagementPage() {
    const api = useApi();
    const [roles, setRoles] = useState<RoleEntity[]>([]);
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const selectedRole = useMemo(
        () => roles.find(role => role.id === selectedRoleId) ?? null,
        [roles, selectedRoleId],
    );

    useEffect(() => {
        void loadRoles();
    }, []);

    useEffect(() => {
        if (!selectedRole) {
            setForm(EMPTY_FORM);
            return;
        }

        setForm({
            roleName: selectedRole.roleName ?? "",
            description: selectedRole.description ?? "",
            roleLevel:
                typeof selectedRole.roleLevel === "number" ? String(selectedRole.roleLevel) : "",
        });
    }, [selectedRole]);

    const loadRoles = async () => {
        setIsLoading(true);
        setError("");
        try {
            const data = await api.get<RoleEntity[]>("/roles");
            setRoles(data);

            if (!selectedRoleId && data.length > 0) {
                setSelectedRoleId(data[0].id);
            }
        } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Không thể tải danh sách roles.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectRole = (id: number) => {
        setSelectedRoleId(id);
        setSuccess("");
        setError("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!selectedRole) {
            return;
        }

        if (!form.roleName.trim()) {
            setError("Tên role không được để trống.");
            return;
        }
        const parsedRoleLevel = Number(form.roleLevel);
        if (!Number.isInteger(parsedRoleLevel)) {
            setError("Role level phải là số nguyên.");
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccess("");
        try {
            await api.put(`/roles/${selectedRole.id}`, {
                roleName: form.roleName.trim(),
                description: form.description.trim(),
                roleLevel: parsedRoleLevel,
            });

            setRoles(prev =>
                prev.map(role =>
                    role.id === selectedRole.id
                        ? {
                              ...role,
                              roleName: form.roleName.trim(),
                              description: form.description.trim(),
                              roleLevel: parsedRoleLevel,
                              updatedAt: Date.now(),
                          }
                        : role,
                ),
            );
            setSuccess("Đã cập nhật role thành công.");
        } catch (saveError) {
            setError(saveError instanceof Error ? saveError.message : "Cập nhật role thất bại.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-10 sm:px-6">
            <div>
                <h1 className="text-3xl font-semibold text-zinc-950">Quản lý Roles</h1>
                <p className="mt-2 text-sm text-zinc-500">
                    Chọn một role trong bảng bên dưới để cập nhật tên và mô tả.
                </p>
            </div>

            {error ? (
                <Alert className="mt-6" tone="error">
                    {error}
                </Alert>
            ) : null}
            {success ? (
                <Alert className="mt-6" tone="success">
                    {success}
                </Alert>
            ) : null}

            <section className="mt-6 overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-zinc-200">
                        <thead className="bg-zinc-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    ID
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    Role name
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                                    Updated
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {isLoading ? (
                                <tr>
                                    <td className="px-4 py-5 text-sm text-zinc-500" colSpan={4}>
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : roles.length === 0 ? (
                                <tr>
                                    <td className="px-4 py-5 text-sm text-zinc-500" colSpan={4}>
                                        Chưa có role nào.
                                    </td>
                                </tr>
                            ) : (
                                roles.map(role => (
                                    <tr
                                        className={
                                            role.id === selectedRoleId
                                                ? "cursor-pointer bg-blue-50"
                                                : "cursor-pointer hover:bg-zinc-50"
                                        }
                                        key={role.id}
                                        onClick={() => handleSelectRole(role.id)}>
                                        <td className="px-4 py-3 text-sm text-zinc-700">{role.id}</td>
                                        <td className="px-4 py-3 text-sm font-medium text-zinc-900">
                                            {role.roleName}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-zinc-700">
                                            {role.description || "-"}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-zinc-500">
                                            {role.updatedAt ? new Date(role.updatedAt).toLocaleString("vi-VN") : "-"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-zinc-950">Cập nhật role</h2>
                <p className="mt-1 text-sm text-zinc-500">
                    {selectedRole ? `Đang chỉnh sửa role #${selectedRole.id}.` : "Vui lòng chọn role từ bảng."}
                </p>

                <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="roleName">
                            Tên role
                        </label>
                        <Input
                            disabled={!selectedRole || isSaving}
                            id="roleName"
                            onChange={event => setForm(prev => ({ ...prev, roleName: event.target.value }))}
                            value={form.roleName}
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="description">
                            Mô tả
                        </label>
                        <Input
                            disabled={!selectedRole || isSaving}
                            id="description"
                            onChange={event => setForm(prev => ({ ...prev, description: event.target.value }))}
                            value={form.description}
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700" htmlFor="roleLevel">
                            Role level
                        </label>
                        <Input
                            disabled={!selectedRole || isSaving}
                            id="roleLevel"
                            onChange={event => setForm(prev => ({ ...prev, roleLevel: event.target.value }))}
                            value={form.roleLevel}
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <Button disabled={!selectedRole || isSaving} type="submit">
                            {isSaving ? "Đang lưu..." : "Lưu cập nhật"}
                        </Button>
                        <Button disabled={isLoading} onClick={() => void loadRoles()} type="button" variant="outline">
                            Làm mới bảng
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
