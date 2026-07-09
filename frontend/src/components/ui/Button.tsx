import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-150 outline-none disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 shrink-0",
    {
        variants: {
            variant: {
                default:
                    "bg-neutral-900 text-white hover:bg-neutral-700 active:scale-[0.98]",
                outline:
                    "border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98]",
                ghost:
                    "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                accent:
                    "bg-indigo-600 text-white hover:bg-indigo-500 active:scale-[0.98] shadow-sm shadow-indigo-200",
            },
            size: {
                default: "h-9 px-4 py-2",
                lg: "h-11 px-6 py-2.5 text-base",
                sm: "h-8 px-3 text-xs",
                icon: "size-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export type ButtonProps = React.ComponentProps<"button"> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };

export function Button({
    asChild = false,
    className,
    size,
    variant,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button";

    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    );
}
