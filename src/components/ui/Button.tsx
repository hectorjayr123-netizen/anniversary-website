import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@utils/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      icon,
      className,
      type,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: "button-primary",
      secondary: "button-secondary",
    };

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn("disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
        {...props}
      >
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
