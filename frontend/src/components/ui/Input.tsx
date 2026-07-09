import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition-colors",
                "placeholder:text-neutral-400",
                "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100",
                "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
                className
            )}
            {...props}
        />
    );
}
