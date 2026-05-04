import type { ReactNode } from "react";

type FlowShellProps = {
    title: string;
    description: string;
    children?: ReactNode;
};

export function FlowShell({ children, description, title }: FlowShellProps) {
    return (
        <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-6xl px-4 py-10 sm:px-6">
            <div className="max-w-2xl">
                <h1 className="text-3xl font-semibold text-zinc-950">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-zinc-500">{description}</p>
            </div>

            {children ? <section className="mt-6">{children}</section> : null}
        </main>
    );
}
