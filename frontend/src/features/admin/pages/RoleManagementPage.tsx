export function RoleManagementPage() {
  return (
    <div className="animate-fade-up">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-neutral-900">Quản lý Role</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Danh sách các vai trò trong hệ thống.
        </p>
      </div>
      <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
        <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-neutral-100">
          <svg className="size-5 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-neutral-500">Đang phát triển</p>
        <p className="mt-1 text-xs text-neutral-400">Tính năng quản lý role sẽ sớm ra mắt.</p>
      </div>
    </div>
  );
}
