import type { ReactNode } from "react";

type FlowShellProps = {
    title: string;
    description: string;
    children?: ReactNode;
};

export function FlowShell({ children, description, title }: FlowShellProps) {
    return (
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-5xl px-5 py-10 sm:px-6">
            {/* Page header */}
            <div className="mb-8 max-w-xl animate-fade-up">
                <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{description}</p>
            </div>

            {children ? (
                <section className="animate-fade-up delay-100">{children}</section>
            ) : null}
        </main>
    );
}
