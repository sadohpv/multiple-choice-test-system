import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
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

type ApiErrorBody = {
  message?: string;
  error?: string;
};

const EMPTY_FORM: RoleFormState = {
  roleName: "",
  description: "",
  roleLevel: "",
};

const SYSTEM_ROLE_ADMIN = "ADMIN";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | string | undefined;
    if (typeof data === "string" && data.trim()) {
      return data;
    }
    if (typeof data !== "object" || data === null) {
      return fallback;
    }
    return data?.message || data?.error || fallback;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function formatTime(value?: number | null) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleString("vi-VN");
}

function isSystemRole(role: RoleEntity | null) {
  return role?.roleName.toUpperCase() === SYSTEM_ROLE_ADMIN;
}

export function RoleManagementPage() {
  const api = useApi();
  const [roles, setRoles] = useState<RoleEntity[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [form, setForm] = useState<RoleFormState>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const selectedRole = useMemo(
    () => roles.find((role) => role.id === selectedRoleId) ?? null,
    [roles, selectedRoleId],
  );

  const canSubmit =
    !isSaving && !isDeleting && (mode === "create" || Boolean(selectedRole));
  const canMutateSelectedRole = Boolean(
    mode === "edit" && selectedRole && !isSystemRole(selectedRole),
  );

  useEffect(() => {
    void loadRoles();
  }, []);

  useEffect(() => {
    if (mode === "create") {
      setForm(EMPTY_FORM);
      return;
    }

    if (!selectedRole) {
      setForm(EMPTY_FORM);
      return;
    }

    setForm({
      roleName: selectedRole.roleName ?? "",
      description: selectedRole.description ?? "",
      roleLevel:
        typeof selectedRole.roleLevel === "number"
          ? String(selectedRole.roleLevel)
          : "",
    });
  }, [mode, selectedRole]);

  const loadRoles = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await api.get<RoleEntity[]>("/roles");
      setRoles(data);
      setSelectedRoleId((currentId) => {
        if (currentId && data.some((role) => role.id === currentId)) {
          return currentId;
        }
        return null;
      });
    } catch (loadError) {
      setError(getErrorMessage(loadError, "Không thể tải danh sách roles."));
    } finally {
      setIsLoading(false);
    }
  };

  const startCreate = () => {
    setMode("create");
    setSelectedRoleId(null);
    setError("");
    setSuccess("");
  };

  const startEdit = (role: RoleEntity) => {
    setMode("edit");
    setSelectedRoleId(role.id);
    setError("");
    setSuccess("");
  };

  const buildPayload = () => {
    const roleName = form.roleName.trim();
    const description = form.description.trim();
    const roleLevel = Number(form.roleLevel);

    if (!roleName) {
      throw new Error("Tên role không được để trống.");
    }
    if (roleName.length > 50) {
      throw new Error("Tên role tối đa 50 ký tự.");
    }
    if (description.length > 50) {
      throw new Error("Mô tả tối đa 50 ký tự.");
    }
    if (!Number.isInteger(roleLevel) || roleLevel <= 0) {
      throw new Error("Role level phải là số nguyên lớn hơn 0.");
    }

    return {
      roleName,
      description: description || null,
      roleLevel,
    };
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    let payload: ReturnType<typeof buildPayload>;
    try {
      payload = buildPayload();
    } catch (validationError) {
      setError(getErrorMessage(validationError, "Dữ liệu role chưa hợp lệ."));
      return;
    }

    if (mode === "edit" && !selectedRole) {
      setError("Vui lòng chọn role cần cập nhật.");
      return;
    }
    if (canMutateSelectedRole === false && mode === "edit") {
      setError("Không thể sửa role hệ thống ADMIN.");
      return;
    }

    setIsSaving(true);
    try {
      if (mode === "create") {
        const created = await api.post<RoleEntity>("/roles", payload);
        setRoles((prev) =>
          [created, ...prev].sort(
            (a, b) => (b.roleLevel ?? 0) - (a.roleLevel ?? 0),
          ),
        );
        setSelectedRoleId(created.id);
        setMode("edit");
        setSuccess("Đã tạo role thành công.");
      } else if (selectedRole) {
        const updated = await api.put<RoleEntity>(
          `/roles/${selectedRole.id}`,
          payload,
        );
        setRoles((prev) =>
          prev.map((role) => (role.id === updated.id ? updated : role)),
        );
        setSuccess("Đã cập nhật role thành công.");
      }
    } catch (saveError) {
      setError(
        getErrorMessage(
          saveError,
          mode === "create" ? "Tạo role thất bại." : "Cập nhật role thất bại.",
        ),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRole) {
      return;
    }
    if (isSystemRole(selectedRole)) {
      setError("Không thể xóa role hệ thống ADMIN.");
      return;
    }

    const confirmed = window.confirm(`Xóa role "${selectedRole.roleName}"?`);
    if (!confirmed) {
      return;
    }

    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      await api.del(`/roles/${selectedRole.id}`);
      setRoles((prev) => prev.filter((role) => role.id !== selectedRole.id));
      setSelectedRoleId(null);
      setMode("create");
      setSuccess("Đã xóa role thành công.");
    } catch (deleteError) {
      setError(getErrorMessage(deleteError, "Xóa role thất bại."));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900">Quản lý Role</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Tạo, cập nhật và xóa các vai trò dùng để phân quyền trong hệ thống.
          </p>
        </div>
        <Button
          onClick={startCreate}
          type="button"
          variant={mode === "create" ? "accent" : "outline"}
        >
          Tạo role mới
        </Button>
      </div>

      {error ? <Alert tone="error">{error}</Alert> : null}
      {success ? <Alert tone="success">{success}</Alert> : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold text-neutral-900">
              Danh sách roles
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-100">
              <thead className="bg-neutral-50">
                <tr>
                  {["ID", "Tên role", "Mô tả", "Level", "Cập nhật"].map(
                    (col) => (
                      <th
                        className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400"
                        key={col}
                      >
                        {col}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading ? (
                  <tr>
                    <td
                      className="px-5 py-5 text-sm text-neutral-400"
                      colSpan={5}
                    >
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td
                      className="px-5 py-5 text-sm text-neutral-400"
                      colSpan={5}
                    >
                      Chưa có role nào.
                    </td>
                  </tr>
                ) : (
                  roles.map((role) => (
                    <tr
                      className={
                        role.id === selectedRoleId
                          ? "cursor-pointer bg-indigo-50"
                          : "cursor-pointer transition-colors hover:bg-neutral-50"
                      }
                      key={role.id}
                      onClick={() => startEdit(role)}
                    >
                      <td className="whitespace-nowrap px-5 py-3.5 text-xs text-neutral-400">
                        {role.id}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm font-medium text-neutral-900">
                        {role.roleName}
                      </td>
                      <td className="min-w-48 px-5 py-3.5 text-sm text-neutral-500">
                        {role.description || "-"}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5">
                        <span className="inline-flex rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
                          {role.roleLevel ?? "-"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-sm text-neutral-500">
                        {formatTime(role.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-5">
            <h2 className="text-sm font-semibold text-neutral-900">
              {mode === "create" ? "Tạo role" : "Cập nhật role"}
            </h2>
            <p className="mt-1 text-xs text-neutral-400">
              {mode === "create"
                ? "Nhập thông tin role mới."
                : selectedRole
                  ? `Đang chỉnh sửa role #${selectedRole.id}.`
                  : "Chọn một role trong bảng để chỉnh sửa."}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-neutral-700"
                htmlFor="roleName"
              >
                Tên role
              </label>
              <Input
                disabled={isSaving || isDeleting || isSystemRole(selectedRole)}
                id="roleName"
                maxLength={50}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, roleName: event.target.value }))
                }
                placeholder="VD: MOD"
                value={form.roleName}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-neutral-700"
                htmlFor="description"
              >
                Mô tả
              </label>
              <Input
                disabled={isSaving || isDeleting || isSystemRole(selectedRole)}
                id="description"
                maxLength={50}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="VD: Quản trị nội dung"
                value={form.description}
              />
            </div>

            <div>
              <label
                className="mb-1.5 block text-sm font-medium text-neutral-700"
                htmlFor="roleLevel"
              >
                Role level
              </label>
              <Input
                disabled={isSaving || isDeleting || isSystemRole(selectedRole)}
                id="roleLevel"
                min={1}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    roleLevel: event.target.value,
                  }))
                }
                placeholder="VD: 50"
                type="number"
                value={form.roleLevel}
              />
            </div>

            {isSystemRole(selectedRole) && mode === "edit" ? (
              <Alert>
                Role hệ thống ADMIN chỉ được xem, không được sửa hoặc xóa.
              </Alert>
            ) : null}

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Button
                disabled={!canSubmit || isSystemRole(selectedRole)}
                type="submit"
                variant="accent"
              >
                {isSaving
                  ? "Đang lưu..."
                  : mode === "create"
                    ? "Tạo role"
                    : "Lưu thay đổi"}
              </Button>
              <Button
                disabled={isLoading || isSaving || isDeleting}
                onClick={() => void loadRoles()}
                type="button"
                variant="outline"
              >
                Làm mới
              </Button>
              {mode === "edit" ? (
                <Button
                  disabled={!canMutateSelectedRole || isDeleting || isSaving}
                  onClick={() => void handleDelete()}
                  type="button"
                  variant="ghost"
                >
                  {isDeleting ? "Đang xóa..." : "Xóa"}
                </Button>
              ) : null}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
