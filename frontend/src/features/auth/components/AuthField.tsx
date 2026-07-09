import type { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

type AuthFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    error?: string;
    helperText?: string;
    label: string;
    wrapperClassName?: string;
};

export function AuthField({
    className,
    error,
    helperText,
    id,
    label,
    name,
    type = "text",
    wrapperClassName,
    ...props
}: AuthFieldProps) {
    const fieldId = id ?? name;

    return (
        <div className={cn("flex flex-col gap-1.5", wrapperClassName)}>
            <Label htmlFor={fieldId}>{label}</Label>
            <Input
                className={cn(
                    error && "border-rose-400 focus:border-rose-400 focus:ring-rose-100",
                    className
                )}
                id={fieldId}
                name={name}
                type={type}
                {...props}
            />
            {(error || helperText) && (
                <span className={cn("text-xs", error ? "text-rose-600" : "text-neutral-400")}>
                    {error ?? helperText}
                </span>
            )}
        </div>
    );
}
