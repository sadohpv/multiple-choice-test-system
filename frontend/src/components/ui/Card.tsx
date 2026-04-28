import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.ComponentProps<"section">) {
    return (
        <section
            className={cn("rounded-2xl border border-zinc-200 bg-white shadow-sm", className)}
            {...props}
        />
    );
}

export function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.ComponentProps<"h1">) {
    return <h1 className={cn("text-xl font-semibold text-zinc-950", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={cn("px-6 pb-6", className)} {...props} />;
}
