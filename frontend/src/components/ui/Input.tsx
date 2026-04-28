import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, type, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-950 outline-none transition-colors",
                "placeholder:text-zinc-400 focus:border-zinc-400 focus-visible:ring-2 focus-visible:ring-zinc-200",
                "disabled:cursor-not-allowed disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}
