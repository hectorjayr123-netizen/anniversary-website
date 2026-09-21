import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@utils/cn";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  fullHeight?: boolean;
  padding?: "compact" | "default" | "spacious";
  tone?: "base" | "paper" | "blush";
}

export const Section = forwardRef<HTMLSectionElement, SectionProps>(
  (
    {
      children,
      fullHeight = false,
      padding = "default",
      tone = "base",
      className,
      ...props
    },
    ref
  ) => {
    const paddings = {
      compact: "py-12 sm:py-16",
      default: "py-16 sm:py-20 lg:py-24",
      spacious: "py-20 sm:py-28 lg:py-32",
    };

    const tones = {
      base: "",
      paper: "bg-warm-white/55",
      blush: "bg-blush-pink/35",
    };

    return (
      <section
        ref={ref}
        className={cn(
          "relative w-full",
          paddings[padding],
          tones[tone],
          fullHeight && "flex min-h-[100svh] items-center",
          className
        )}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = "Section";
