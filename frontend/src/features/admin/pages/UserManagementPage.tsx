import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/axiosInstance";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import type { AuthUser } from "@/features/auth/types";

// Role entity definition from backend
type Role = {
  id: number;
  roleName: string;
  description: string;
  roleLevel: number;
};

export function UserManagementPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for role assignment dialog
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [userRoles, setUserRoles] = useState<number[]>([]);
  const [savingRoles, setSavingRoles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([
          axiosInstance.get<AuthUser[]>("/users"),
          axiosInstance.get<Role[]>("/roles"),
        ]);
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      } catch (err) {
        console.error(err);
        setError(
          "Không thể tải danh sách người dùng hoặc roles. Kiểm tra quyền của bạn.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditRoles = async (user: AuthUser) => {
    setEditingUser(user);
    setUserRoles([]); // Reset while fetching
    try {
      const res = await axiosInstance.get<Role[]>(`/users/${user.id}/roles`);
      setUserRoles(res.data.map((r) => r.id));
    } catch (err) {
      console.error("Failed to load user roles", err);
      // Optionally handle error
    }
  };

  const handleSaveRoles = async () => {
    if (!editingUser) return;
    setSavingRoles(true);
    try {
      await axiosInstance.put(`/users/${editingUser.id}/roles`, userRoles);
      setEditingUser(null);
      // Optionally show a success toast
    } catch (err) {
      console.error("Failed to save roles", err);
      alert("Lỗi khi lưu roles");
    } finally {
      setSavingRoles(false);
    }
  };

  const toggleRole = (roleId: number) => {
    setUserRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId],
    );
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <svg className="size-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Đang tải...
      </div>
    );
  }
  if (error) return <Alert tone="error">{error}</Alert>;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Quản lý Người dùng</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Xem và chỉnh sửa vai trò của từng tài khoản.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="min-w-full divide-y divide-neutral-100">
          <thead className="bg-neutral-50">
            <tr>
              {["ID", "Người dùng", "Email", ""].map(col => (
                <th
                  key={col}
                  className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-400"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50 transition-colors">
                <td className="whitespace-nowrap px-5 py-3.5 text-xs text-neutral-400">
                  {user.id}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex size-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
                      {(user.displayname || user.username || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-neutral-900">{user.username}</div>
                      <div className="text-xs text-neutral-400">{user.displayname}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-sm text-neutral-500">
                  {user.email}
                </td>
                <td className="whitespace-nowrap px-5 py-3.5 text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditRoles(user)}
                  >
                    Sửa roles
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Editing Roles */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl animate-fade-up">
            {/* Modal header */}
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Chỉnh sửa Roles
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  @{editingUser.username}
                </p>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Role list */}
            <div className="space-y-1.5">
              {roles.map((role) => (
                <label
                  key={role.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2.5 hover:bg-neutral-50 transition-colors has-[:checked]:border-indigo-100 has-[:checked]:bg-indigo-50"
                >
                  <input
                    type="checkbox"
                    className="size-4 rounded border-neutral-300 accent-indigo-600"
                    checked={userRoles.includes(role.id)}
                    onChange={() => toggleRole(role.id)}
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-900">{role.roleName}</div>
                    <div className="text-xs text-neutral-400 truncate">{role.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {/* Modal footer */}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditingUser(null)}>
                Hủy
              </Button>
              <Button variant="accent" size="sm" disabled={savingRoles} onClick={handleSaveRoles}>
                {savingRoles ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
