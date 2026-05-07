import * as React from "react";
import { cn } from "@/lib/utils";

type AlertTone = "default" | "success" | "error";

const alertToneClassName: Record<AlertTone, string> = {
    default: "border-neutral-200 bg-neutral-50 text-neutral-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    error: "border-rose-200 bg-rose-50 text-rose-700",
};

const alertIcon: Record<AlertTone, React.ReactNode> = {
    default: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
        </svg>
    ),
    success: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    ),
    error: (
        <svg className="size-4 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
    ),
};

type AlertProps = React.ComponentProps<"div"> & {
    tone?: AlertTone;
};

export function Alert({ className, tone = "default", children, ...props }: AlertProps) {
    return (
        <div
            role="alert"
            className={cn(
                "flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-sm",
                alertToneClassName[tone],
                className
            )}
            {...props}
        >
            {alertIcon[tone]}
            <span>{children}</span>
        </div>
    );
}
