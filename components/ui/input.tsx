import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, type = "text", ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex w-full rounded-lg border bg-white px-4 py-2 text-base transition-colors",
          "placeholder:text-slate-400",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          error
            ? "border-rose-300 focus:ring-rose-500"
            : "border-slate-300 focus:ring-green-500",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export default Input;
