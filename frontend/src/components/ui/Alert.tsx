import * as React from "react";
import { cn } from "@/lib/utils";

type AlertTone = "default" | "success" | "error";

const alertToneClassName: Record<AlertTone, string> = {
    default: "border-zinc-200 bg-zinc-50 text-zinc-700",
    success: "border-emerald-200 bg-emerald-50 text-emerald-800",
    error: "border-rose-200 bg-rose-50 text-rose-700",
};

type AlertProps = React.ComponentProps<"div"> & {
    tone?: AlertTone;
};

export function Alert({ className, tone = "default", ...props }: AlertProps) {
    return (
        <div
            role="alert"
            className={cn("rounded-lg border px-3 py-2 text-sm", alertToneClassName[tone], className)}
            {...props}
        />
    );
}
