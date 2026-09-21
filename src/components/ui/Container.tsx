import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  (
    {
      children,
      size = "lg",
      className,
      ...props
    },
    ref
  ) => {
    const sizes = {
      sm: "max-w-3xl",
      md: "max-w-5xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
    };

    return (
      <div
        ref={ref}
        className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizes[size], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
