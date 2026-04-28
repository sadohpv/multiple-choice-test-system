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
        <label className={cn("flex flex-col gap-3", wrapperClassName)} htmlFor={fieldId}>
            <Label htmlFor={fieldId}>{label}</Label>
            <Input
                className={cn(
                    error && "border-rose-300 focus:border-rose-500 focus-visible:ring-rose-100",
                    className,
                )}
                id={fieldId}
                name={name}
                type={type}
                {...props}
            />
            {error || helperText ? (
                <span className={cn("text-xs leading-5", error ? "text-rose-600" : "text-zinc-500")}>
                    {error ?? helperText}
                </span>
            ) : null}
        </label>
    );
}
