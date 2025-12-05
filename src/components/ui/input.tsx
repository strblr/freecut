import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils";

export const inputVariants = cva(
  "w-full min-w-0 rounded-md bg-transparent transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default: "border border-input shadow-xs dark:bg-input/30",
        ghost: "border-0"
      },
      size: {
        default: "h-9 px-3 py-1 text-base",
        xs: "h-6 px-2.5 text-xs",
        sm: "h-8 px-3 py-1 text-sm",
        lg: "h-10 px-3 py-2 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export function Input({
  className,
  variant,
  size,
  type,
  ...props
}: Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(inputVariants({ variant, size, className }))}
      {...props}
    />
  );
}
