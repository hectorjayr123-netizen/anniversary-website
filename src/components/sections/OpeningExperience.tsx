import { Button, Container, FloralBloom, StrawberryMark } from "@ui";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { cn } from "@utils/cn";
import { motion } from "framer-motion";
import { Flower2, Heart, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface OpeningExperienceProps {
  onComplete: () => void;
}

const blooms = [
  { left: "50%", top: "15%", size: 102, delay: 0.64, petalColor: "#d97691", innerColor: "#f8dce2", depth: 2, petalCount: 8, rotate: 10, className: "scale-[0.76] sm:scale-100" },
  { left: "12%", top: "48%", size: 106, delay: 0.94, petalColor: "#bd4658", innerColor: "#f6d8db", depth: 1, petalCount: 6, rotate: -8, className: "scale-[0.7] sm:scale-100" },
  { left: "88%", top: "47%", size: 112, delay: 1.14, petalColor: "#de91a1", innerColor: "#fbe7ea", depth: 1, petalCount: 6, rotate: 22, className: "scale-[0.7] sm:scale-100" },
  { left: "23%", top: "18%", size: 82, delay: 1.36, petalColor: "#c8576e", innerColor: "#f8dce2", depth: 0, petalCount: 5, rotate: 14, className: "hidden scale-[0.78] sm:block sm:scale-100" },
  { left: "77%", top: "20%", size: 90, delay: 1.52, petalColor: "#d97691", innerColor: "#fff0f2", depth: 0, petalCount: 6, rotate: -18, className: "hidden scale-[0.78] sm:block sm:scale-100" },
] as const;

const petals = [
  { left: "9%", top: "26%", delay: 0.0, dur: 3.1, drift: 36, size: 1.0, mode: "rise" },
  { left: "21%", top: "74%", delay: 0.16, dur: 2.7, drift: -30, size: 1.15, mode: "rise" },
  { left: "76%", top: "13%", delay: 0.3, dur: 3.3, drift: -32, size: 0.85, mode: "rise" },
  { left: "90%", top: "58%", delay: 0.08, dur: 2.9, drift: 28, size: 1.1, mode: "rise" },
  { left: "63%", top: "80%", delay: 0.42, dur: 3.4, drift: 22, size: 0.9, mode: "rise" },
  { left: "38%", top: "9%", delay: 0.55, dur: 3.0, drift: -20, size: 0.85, mode: "rise" },
  { left: "14%", top: "62%", delay: 0.24, dur: 4.2, drift: 44, size: 0.8, mode: "fall", hideMobile: true },
  { left: "82%", top: "28%", delay: 0.5, dur: 4.6, drift: -40, size: 0.75, mode: "fall", hideMobile: true },
] as const;

const bloomEase = [0.22, 1, 0.36, 1] as const;

export function OpeningExperience({ onComplete }: OpeningExperienceProps) {
  const prefersReducedMotion = useReducedMotion();
  const [isOpening, setIsOpening] = useState(false);
  const completionTimer = useRef<number | undefined>(undefined);
  const totalDuration = prefersReducedMotion ? 250 : 3750;

  useEffect(
    () => () => {
      if (completionTimer.current !== undefined) window.clearTimeout(completionTimer.current);
    },
    []
  );

  const openGift = () => {
    if (isOpening) return;

    setIsOpening(true);
    completionTimer.current = window.setTimeout(onComplete, totalDuration);
  };

  return (
    <motion.section
      className="relative isolate flex min-h-[100svh] overflow-hidden bg-cream"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.14, filter: "blur(6px)" }}
      transition={{ duration: prefersReducedMotion ? 0.01 : 1.05, ease: "easeInOut" }}
      aria-labelledby="opening-title"
    >
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 18% 14%, rgba(246, 216, 219, 0.95), transparent 30rem), radial-gradient(circle at 88% 78%, rgba(201, 164, 83, 0.2), transparent 28rem)" }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 54%, rgba(240, 181, 192, 0.74), transparent 47%), radial-gradient(circle at 50% 50%, rgba(255, 253, 249, 0.9), transparent 70%)" }}
        initial={false}
        animate={{ opacity: isOpening ? [0.06, 0.2, 0.85] : 0.06 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 3.3, delay: isOpening ? 0.45 : 0, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[20rem] w-[20rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[30rem] sm:w-[30rem]"
        style={{ background: "radial-gradient(circle, rgba(255,253,249,0.96), rgba(246,216,219,0.34) 45%, transparent 72%)" }}
        initial={false}
        animate={isOpening ? { opacity: [0, 0.2, 0.82, 0.4], scale: [0.32, 0.54, 1.12, 1.35] } : { opacity: 0, scale: 0.32 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 2.2, delay: isOpening ? 1.85 : 0, ease: "easeInOut" }}
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {blooms.map((bloom) => (
          <div
            key={`${bloom.left}-${bloom.top}`}
            className={cn("absolute", bloom.className)}
            style={{ left: `calc(${bloom.left} - ${bloom.size / 2}px)`, top: bloom.top, zIndex: bloom.depth }}
          >
            <FloralBloom
              size={bloom.size}
              petalColor={bloom.petalColor}
              innerColor={bloom.innerColor}
              delay={prefersReducedMotion ? 0 : bloom.delay}
              isBloomed={isOpening}
              reducedMotion={prefersReducedMotion}
              petalCount={bloom.petalCount}
              rotate={bloom.rotate}
            />
          </div>
        ))}

        <motion.div
          className="absolute left-[16%] top-[63%] grid h-11 w-11 place-items-center rounded-full border border-rose-pink/20 bg-warm-white/75 shadow-card sm:h-12 sm:w-12"
          initial={false}
          animate={isOpening ? { opacity: 1, y: 0, rotate: -7, scale: 1 } : { opacity: 0, y: 12, rotate: 6, scale: 0.65 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.48, delay: prefersReducedMotion ? 0 : 1.74, ease: bloomEase }}
        >
          <StrawberryMark className="h-7 w-7 sm:h-8 sm:w-8" />
        </motion.div>
        <motion.div
          className="absolute right-[16%] top-[28%] grid h-10 w-10 place-items-center rounded-full border border-rose-pink/20 bg-warm-white/75 shadow-card sm:h-12 sm:w-12"
          initial={false}
          animate={isOpening ? { opacity: 1, y: 0, rotate: 8, scale: 1 } : { opacity: 0, y: 11, rotate: -6, scale: 0.65 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.46, delay: prefersReducedMotion ? 0 : 1.94, ease: bloomEase }}
        >
          <StrawberryMark className="h-6 w-6 sm:h-7 sm:w-7" />
        </motion.div>

        {petals.map((petal, index) => {
          const rising = petal.mode === "rise";
          const drift = petal.drift;

          return (
            <motion.span
              key={`${petal.left}-${petal.top}`}
              className={cn(
                "absolute bg-rose-pink/75 shadow-[0_2px_5px_rgba(122,67,79,0.16)]",
                index % 2 === 0 ? "rounded-[80%_20%_70%_30%]" : "rounded-[70%_30%_80%_20%]",
                petal.hideMobile && "hidden sm:block"
              )}
              style={{ left: petal.left, top: petal.top, width: `${petal.size * 0.48}rem`, height: `${petal.size * 0.74}rem` }}
              initial={false}
              animate={
                isOpening
                  ? rising
                    ? { opacity: [0, 0.75, 0.55, 0.28, 0], x: [0, drift * 0.42, drift * 0.9, drift * 0.72, drift * 1.08], y: [8, -16, -44, -76, -108], rotate: [0, 16, 36, 58, 82] }
                    : { opacity: [0, 0.6, 0.45, 0], x: [0, drift * 0.5, drift * 0.85, drift], y: [0, 44, 96, 156], rotate: [0, -22, -46, -74] }
                  : { opacity: [0.16, 0.42, 0.16], y: [0, -6, 0], rotate: [0, 8, 0] }
              }
              transition={{
                duration: isOpening ? (prefersReducedMotion ? 0.01 : petal.dur) : 8,
                delay: isOpening ? 1.5 + petal.delay : petal.delay,
                repeat: isOpening ? 0 : Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>

      <Container size="md" className="relative z-10 flex min-h-[100svh] items-center py-10 sm:py-14">
        <div className="mx-auto w-full max-w-xl text-center">
          <motion.p
            className="section-kicker"
            animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? -8 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.28, ease: "easeOut" }}
          >
            A little something for you
          </motion.p>

          <motion.div
            className="relative mx-auto mt-7 h-[18rem] w-full max-w-[31rem] [perspective:1200px] sm:mt-9 sm:h-[21rem]"
            initial={false}
            animate={isOpening ? { y: [0, -6, -44], rotateZ: [0, -0.8, -2.6], scale: [1, 1.02, 0.9], opacity: [1, 1, 0] } : { y: 0, rotateZ: 0, scale: 1, opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 3.15, delay: isOpening ? 0.08 : 0, times: [0, 0.2, 1], ease: bloomEase }}
          >
            <motion.article
              className="absolute inset-x-[10%] top-[16%] z-20 rounded-3xl border border-blush-pink/55 bg-warm-white px-5 py-7 shadow-card sm:px-8 sm:py-9"
              aria-hidden="true"
              initial={false}
              animate={isOpening ? { opacity: [0, 1, 1, 0], y: [30, -22, -54, -74], rotateX: [0, 0, -2, -8], scale: [0.96, 1, 1.02, 1.04] } : { opacity: 0, y: 30, rotateX: 0, scale: 0.96 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 2.7, delay: isOpening ? 0.36 : 0, times: [0, 0.3, 0.7, 1], ease: bloomEase }}
            >
              <Flower2 className="mx-auto h-5 w-5 text-rose-pink" strokeWidth={1.25} aria-hidden="true" />
              <p className="mt-3 font-script text-4xl text-rose-pink sm:text-5xl">For Marilou</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-soft-brown sm:text-sm">Our 2nd Anniversary</p>
              <p className="mt-2 text-sm text-muted">September 28, 2026</p>
            </motion.article>

            <motion.div
              className="absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-b-3xl rounded-t-2xl border border-rose-pink/30 shadow-envelope"
              style={{ height: "72%", background: "linear-gradient(145deg, #f9e6e6, #f2cdd2)" }}
              animate={isOpening ? { y: 19, opacity: 0.82 } : { y: 0, opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.86, delay: isOpening ? 0.16 : 0, ease: bloomEase }}
            >
              <div className="absolute inset-0" style={{ background: "linear-gradient(36deg, transparent 49%, rgba(255, 253, 249, 0.68) 50%, transparent 51%)" }} />
              <div className="absolute inset-x-0 top-0" style={{ height: "55%", background: "linear-gradient(135deg, rgba(255, 253, 249, 0.56), transparent 55%)" }} />
            </motion.div>

            <motion.div
              className="absolute inset-x-0 top-0 z-30 origin-top"
              style={{ height: "72%", clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformPerspective: 1200 }}
              initial={false}
              animate={
                isOpening
                  ? { rotateX: [0, -70, -130, -165], y: [0, -2, -5, -7], zIndex: [30, 30, 30, 8] }
                  : { rotateX: 0, y: 0, zIndex: 30 }
              }
              transition={
                isOpening
                  ? { duration: prefersReducedMotion ? 0.01 : 1.05, delay: 0.18, times: [0, 0.45, 0.8, 1], ease: ["easeOut", "easeInOut", "easeOut"] }
                  : { duration: 0.01 }
              }
            >
              <div className="absolute inset-0 shadow-[0_8px_24px_rgba(120,70,80,0.14)]" style={{ background: "linear-gradient(145deg, #f6d8db, #e9abb7)" }} />
              <motion.div
                className="absolute"
                style={{ left: "8%", right: "8%", top: "8%" }}
                initial={false}
                animate={{ opacity: isOpening ? [1, 1, 0] : 1 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: isOpening ? 0.18 : 0, ease: "easeIn" }}
              >
                <h1 id="opening-title" className="text-center font-script text-4xl leading-none text-strawberry-red sm:text-5xl">
                  For Marilou
                </h1>
                <p className="mt-1 text-center text-[0.55rem] font-bold uppercase tracking-[0.14em] text-soft-brown sm:text-[0.65rem]">Our 2nd Anniversary</p>
                <p className="mt-1 text-center text-[0.7rem] text-soft-brown sm:text-xs">September 28, 2026</p>
              </motion.div>
              <motion.div
                className="absolute left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-gold/65 bg-gold text-warm-white shadow-[0_5px_10px_rgba(132,100,34,0.2)] sm:h-12 sm:w-12"
                style={{ top: "58%" }}
                initial={false}
                animate={{ opacity: isOpening ? [1, 1, 0] : 1 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: isOpening ? 0.18 : 0, ease: "easeIn" }}
              >
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="mt-7 sm:mt-9"
            whileTap={isOpening ? undefined : { scale: 0.96 }}
            animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? 12 : 0, scale: isOpening ? 0.95 : 1, filter: isOpening ? "blur(3px)" : "blur(0px)" }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.34, ease: "easeOut" }}
          >
            <p className="mb-4 text-sm text-muted">Open this when you&apos;re ready.</p>
            <Button onClick={openGift} disabled={isOpening} icon={<Sparkles className="h-4 w-4" aria-hidden="true" />} className="min-w-44 px-7 py-3.5 shadow-[0_0_0_rgba(189,70,88,0)] transition-shadow duration-300 hover:shadow-[0_0_22px_rgba(189,70,88,0.26)]">
              Open My Gift
            </Button>
          </motion.div>
          <p className="sr-only" aria-live="polite">{isOpening ? "Your card is opening and blooming." : ""}</p>
        </div>
      </Container>
    </motion.section>
  );
}
