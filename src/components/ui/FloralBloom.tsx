import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { cn } from "@utils/cn";

// Hand-drawn sticker artwork (public/images/decor) replacing the old CSS-drawn florals.
const STICKERS = [
  "bloom-1", "bloom-2", "bloom-3", "bloom-4",
  "flower-1", "flower-2", "flower-3", "flower-4",
  "flower-5", "flower-6", "flower-7", "flower-8", "flower-9",
];

interface FloralBloomProps {
  size: number;
  petalColor?: string;
  innerColor?: string;
  centerColor?: string;
  isBloomed: boolean;
  delay?: number;
  reducedMotion?: boolean;
  settled?: boolean;
  petalCount?: number;
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}

export function FloralBloom({
  size,
  isBloomed,
  delay = 0,
  reducedMotion = false,
  settled = false,
  petalCount = 6,
  rotate = 0,
  className,
  style,
}: FloralBloomProps) {
  // pick a stable-but-varied sticker per call site (petalCount/rotate act as the seed)
  const variant = STICKERS[((petalCount * 2 + Math.round(rotate / 20)) % STICKERS.length + STICKERS.length) % STICKERS.length];

  return (
    <motion.div
      className={cn("relative isolate", className)}
      style={{ width: size, height: size, ...style }}
      initial={false}
      animate={isBloomed ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.25, y: size * 0.14 }}
      transition={reducedMotion ? { duration: 0.01, delay } : { type: "spring", stiffness: 68, damping: 14, mass: 0.9, delay: delay + 0.02 }}
    >
      <motion.img
        src={`/images/decor/${variant}.png`}
        alt=""
        draggable={false}
        className="h-full w-full object-contain"
        style={{ filter: "drop-shadow(0 5px 10px rgba(122,67,79,0.28))" }}
        animate={
          settled && !reducedMotion
            ? { rotate: [rotate, rotate + 3.5, rotate], y: [0, -4, 0] }
            : { rotate }
        }
        transition={
          settled && !reducedMotion
            ? { duration: 7 + (size % 5) * 0.4, delay, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.01 }
        }
      />
    </motion.div>
  );
}

export function StrawberryMark({ className }: { className?: string }) {
  return (
    <img
      src="/images/decor/strawberry.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn("select-none object-contain drop-shadow-[0_3px_6px_rgba(122,67,79,0.3)]", className)}
    />
  );
}
