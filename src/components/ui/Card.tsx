import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outlined" | "glass";
  padding?: "sm" | "md" | "lg";
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      variant = "default",
      padding = "md",
      hoverable = false,
      className,
      ...props
    },
    ref
  ) => {
    const variants = {
      default: "surface-card",
      outlined: "border border-border bg-transparent",
      glass: "border border-warm-white/60 bg-warm-white/60 backdrop-blur-sm",
    };

    const paddings = {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-card",
          variants[variant],
          paddings[padding],
          hoverable && "transition duration-200 hover:-translate-y-0.5 hover:shadow-card",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
