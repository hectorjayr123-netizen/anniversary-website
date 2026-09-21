import { Container, FloralBloom, StrawberryMark } from "@ui";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { motion, useMotionValue, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";

const flowers = [
  { left: "5%", top: "7%", size: 118, delay: 0.34, petalColor: "#cf667e", innerColor: "#f6d8db", direction: -1, petalCount: 6, rotate: -12, className: "scale-[0.72] sm:scale-100" },
  { left: "17%", top: "-2%", size: 76, delay: 0.5, petalColor: "#e6a0ad", innerColor: "#fff0f2", direction: -1, petalCount: 5, rotate: 16, className: "scale-[0.72] sm:scale-100" },
  { left: "95%", top: "78%", size: 128, delay: 0.42, petalColor: "#cf667e", innerColor: "#f6d8db", direction: 1, petalCount: 6, rotate: 8, className: "scale-[0.72] sm:scale-100" },
  { left: "82%", top: "92%", size: 78, delay: 0.62, petalColor: "#e6a0ad", innerColor: "#fff0f2", direction: 1, petalCount: 8, rotate: -20, className: "hidden scale-[0.78] sm:block sm:scale-100" },
] as const;

const petals = [
  { position: "left-[8%] top-[30%]", size: "h-3 w-2", delay: 0.3, duration: 9.5, spin: 42 },
  { position: "left-[20%] top-[72%]", size: "h-2.5 w-2", delay: 2.4, duration: 11, spin: -38 },
  { position: "right-[12%] top-[26%]", size: "h-3.5 w-2.5", delay: 1.1, duration: 10.5, spin: 46 },
  { position: "right-[23%] top-[68%]", size: "h-3 w-2", delay: 3.6, duration: 12, spin: -44 },
  { position: "left-[44%] top-[13%]", size: "h-2.5 w-2", delay: 4.8, duration: 10, spin: 40 },
] as const;

const textReveal: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.0, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function OpeningReveal() {
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const upperFlowersY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -28]);
  const lowerFlowersY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : 36]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, prefersReducedMotion ? 0 : -10]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 42, damping: 16, mass: 0.6 });
  const smoothY = useSpring(pointerY, { stiffness: 42, damping: 16, mass: 0.6 });
  const farX = useTransform(smoothX, (value) => value * 7);
  const farY = useTransform(smoothY, (value) => value * 5);
  const midX = useTransform(smoothX, (value) => value * -11);
  const midY = useTransform(smoothY, (value) => value * -8);
  const nearX = useTransform(smoothX, (value) => value * -19);
  const nearY = useTransform(smoothY, (value) => value * -13);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const handleMove = (event: PointerEvent) => {
      pointerX.set(event.clientX / window.innerWidth - 0.5);
      pointerY.set(event.clientY / window.innerHeight - 0.5);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [prefersReducedMotion, pointerX, pointerY]);

  return (
    <section ref={sectionRef} className="relative min-h-[112svh] w-full bg-cream" aria-labelledby="romantic-intro-title">
      <div className="sticky top-0 isolate flex min-h-svh w-full items-center justify-center overflow-hidden px-5 py-16 sm:px-8 sm:py-20">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-background)_0%,var(--color-cream)_68%,var(--color-blush)_145%)]" />
        <div aria-hidden="true" className="absolute left-1/2 top-1/2 h-[48%] w-[78%] max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-background/65 blur-3xl" />

        <div className="pointer-events-none absolute inset-0 z-10" aria-hidden="true">
          <motion.div className="absolute inset-0" style={{ x: farX, y: farY }}>
            <motion.div
              className="absolute left-[13%] top-[65%] grid h-10 w-10 place-items-center rounded-full bg-background/70 shadow-soft sm:left-[18%] sm:h-12 sm:w-12"
              style={{ y: lowerFlowersY }}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0, rotate: -6 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, delay: prefersReducedMotion ? 0 : 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              <StrawberryMark className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.div>

            <motion.div
              className="absolute right-[9%] top-[44%] text-primary/25 sm:right-[16%]"
              animate={prefersReducedMotion ? false : { y: [0, -5, 0], opacity: [0.2, 0.38, 0.2] }}
              transition={{ duration: 5.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Heart className="h-4 w-4 fill-current" />
            </motion.div>
            <motion.div
              className="absolute bottom-[29%] left-[11%] text-primary/20 sm:left-[19%]"
              animate={prefersReducedMotion ? false : { y: [0, 5, 0], opacity: [0.18, 0.34, 0.18] }}
              transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Heart className="h-3 w-3 fill-current" />
            </motion.div>
            <span className="absolute left-[15%] top-[22%] h-1 w-1 rounded-full bg-gold shadow-glow" />
            <span className="absolute bottom-[20%] right-[18%] h-1 w-1 rounded-full bg-gold shadow-glow" />
          </motion.div>

          <motion.div className="absolute inset-0" style={{ x: midX, y: midY }}>
            {flowers.map((flower, index) => (
              <motion.div
                key={`${flower.left}-${flower.top}`}
                className={`absolute ${flower.className}`}
                style={{
                  left: `calc(${flower.left} - ${flower.size / 2}px)`,
                  top: flower.top,
                  y: index < 2 ? upperFlowersY : lowerFlowersY,
                }}
                initial={prefersReducedMotion ? false : { opacity: 0, x: flower.direction * 46 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 1.35, delay: prefersReducedMotion ? 0 : flower.delay, ease: [0.22, 1, 0.36, 1] }}
              >
                <FloralBloom
                  size={flower.size}
                  petalColor={flower.petalColor}
                  innerColor={flower.innerColor}
                  isBloomed
                  reducedMotion={prefersReducedMotion}
                  settled
                  petalCount={flower.petalCount}
                  rotate={flower.rotate}
                  delay={flower.delay}
                />
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="absolute inset-0" style={{ x: nearX, y: nearY }}>
            {petals.map((petal, index) => (
              <motion.span
                key={petal.position}
                className={`absolute ${petal.position} ${petal.size} rounded-[90%_10%_75%_25%] bg-rose/45`}
                animate={
                  prefersReducedMotion
                    ? false
                    : {
                        x: [0, index % 2 === 0 ? 9 : -8, index % 2 === 0 ? 14 : -12],
                        y: [-6, 30, 66],
                        rotate: [index * 16, index * 16 + petal.spin * 0.5, index * 16 + petal.spin],
                        opacity: [0, 0.62, 0],
                      }
                }
                transition={{ duration: petal.duration, delay: petal.delay, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />
            ))}
          </motion.div>
        </div>

        <Container size="md" className="relative z-30">
          <motion.div style={{ y: copyY }} className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <motion.div
              custom={0.25}
              variants={textReveal}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className="mb-6 flex items-center gap-3 text-gold-foreground sm:mb-8"
            >
              <span className="h-px w-8 bg-gold/70 sm:w-12" />
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span className="text-caption">Our 2nd Anniversary</span>
              <span className="h-px w-8 bg-gold/70 sm:w-12" />
            </motion.div>

            <motion.h1
              id="romantic-intro-title"
              custom={0.48}
              variants={textReveal}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className="max-w-[11ch] text-balance font-display text-[clamp(3.35rem,12vw,8rem)] leading-[0.9] text-foreground"
            >
              Marilou Blen Canlom
            </motion.h1>

            <motion.p
              custom={0.78}
              variants={textReveal}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className="mt-7 font-romantic text-[clamp(2.25rem,8vw,4.75rem)] leading-none text-primary sm:mt-9"
            >
              Two years with you.
            </motion.p>

            <motion.div
              custom={1.02}
              variants={textReveal}
              initial={prefersReducedMotion ? false : "hidden"}
              animate="visible"
              className="mt-8 flex items-center gap-3 sm:mt-10"
            >
              <Heart className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
              <time className="text-xs font-medium uppercase tracking-[0.18em] text-muted sm:text-sm" dateTime="2026-09-28">
                September 28, 2026
              </time>
              <Heart className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
            </motion.div>
          </motion.div>
        </Container>

        <motion.div
          aria-hidden="true"
          className="absolute bottom-7 left-1/2 z-30 h-9 w-px -translate-x-1/2 bg-gold/55 sm:bottom-9"
          initial={prefersReducedMotion ? false : { opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.8, delay: 1.35, ease: "easeOut" }}
        />
      </div>
    </section>
  );
}
