import { ANNIVERSARY_DATA } from "@constants";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Button, Container, FloralBloom, StrawberryMark } from "@ui";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";

const softEase = [0.22, 1, 0.36, 1] as const;
const photo = "/images/finale.png";

const petals = [
  { left: "8%", top: "22%", drift: 22, dur: 12, delay: 0 },
  { left: "20%", top: "68%", drift: -18, dur: 14, delay: 2.6 },
  { left: "84%", top: "18%", drift: -22, dur: 13, delay: 1.2 },
  { left: "90%", top: "64%", drift: 24, dur: 15, delay: 3.8 },
  { left: "42%", top: "84%", drift: 16, dur: 12.5, delay: 5 },
  { left: "66%", top: "90%", drift: -14, dur: 11.5, delay: 2 },
] as const;

const hearts = [
  { left: "14%", top: "38%", size: "h-3.5 w-3.5", dur: 6.5 },
  { left: "82%", top: "42%", size: "h-3 w-3", dur: 7.5 },
  { left: "70%", top: "14%", size: "h-2.5 w-2.5", dur: 8.5 },
] as const;

function build(delay: number) {
  return {
    initial: { opacity: 0, y: 26, filter: "blur(8px)" },
    whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 1.1, delay, ease: softEase },
  } as const;
}

export function FinaleSection({ onReplay }: { onReplay: () => void }) {
  const prefersReducedMotion = useReducedMotion();
  const [photoBroken, setPhotoBroken] = useState(false);
  const firstName = ANNIVERSARY_DATA.partnerName.split(" ")[0];

  return (
    <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-cream py-20 sm:py-24" aria-labelledby="finale-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 26%, rgba(255,253,249,0.95), transparent 46%), radial-gradient(circle at 16% 84%, rgba(246,216,219,0.65), transparent 28rem), radial-gradient(circle at 86% 78%, rgba(240,181,192,0.5), transparent 28rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/20" aria-hidden="true" />

      <motion.div
        className="absolute left-1/2 top-[38%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl sm:h-[34rem] sm:w-[34rem]"
        style={{ background: "radial-gradient(circle, rgba(255,252,246,0.95), rgba(246,216,219,0.4) 48%, transparent 74%)" }}
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: prefersReducedMotion ? 0.5 : 0.85, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: prefersReducedMotion ? 0.01 : 2.6, ease: "easeOut" }}
        aria-hidden="true"
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {petals.map((petal, index) => (
          <motion.span
            key={`${petal.left}-${petal.top}`}
            className={`absolute h-2.5 w-1.5 bg-rose/45 shadow-[0_2px_5px_rgba(122,67,79,0.14)] ${index % 2 === 0 ? "rounded-[80%_20%_70%_30%]" : "rounded-[70%_30%_80%_20%]"}`}
            style={{ left: petal.left, top: petal.top }}
            animate={
              prefersReducedMotion
                ? undefined
                : {
                    opacity: [0, 0.5, 0.35, 0],
                    x: [0, petal.drift * 0.5, petal.drift],
                    y: [0, 52, 112],
                    rotate: [0, 22, 46],
                  }
            }
            transition={{ duration: petal.dur, delay: petal.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {hearts.map((heart) => (
          <motion.span
            key={heart.left}
            className={`absolute ${heart.size} text-primary/25`}
            style={{ left: heart.left, top: heart.top }}
            animate={prefersReducedMotion ? undefined : { y: [0, -7, 0], opacity: [0.14, 0.3, 0.14] }}
            transition={{ duration: heart.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="h-full w-full fill-current" />
          </motion.span>
        ))}
      </div>

      <Container className="relative z-10">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <motion.div {...build(0.1)} className="relative">
            <div className="relative h-64 w-64 sm:h-72 sm:w-72" style={{ filter: "drop-shadow(0 24px 30px rgba(122,67,79,0.32))" }}>
              <div
                className="heart-mask absolute inset-0"
                style={{ background: "linear-gradient(160deg, #f3b7c3, #e58ea2 60%, #d97691)" }}
                aria-hidden="true"
              />
              <div
                className="heart-mask absolute inset-[4.5%] flex items-end justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, #ffe9ee 0%, #fbd3dc 55%, #f6bcc9 100%)" }}
              >
                {!photoBroken ? (
                  <img
                    src={photo}
                    alt="The two of us"
                    className="h-[92%] w-auto max-w-[90%] object-contain"
                    onError={() => setPhotoBroken(true)}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <Heart className="mb-[26%] h-16 w-16 fill-warm-white/90 text-warm-white/90" aria-hidden="true" />
                )}
              </div>
            </div>

            <div className="absolute -left-8 -top-7 sm:-left-10">
              <FloralBloom size={84} petalColor="#d97691" innerColor="#f8dce2" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={6} rotate={14} />
            </div>
            <div className="absolute -bottom-4 -right-7 sm:-right-9">
              <FloralBloom size={70} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={5} rotate={-18} />
            </div>
            <StrawberryMark className="absolute -bottom-2 -left-7 h-8 w-8 -rotate-12 sm:-left-9" />
          </motion.div>

          <motion.p {...build(0.5)} className="section-kicker mt-12">
            Today and always
          </motion.p>

          <motion.h2
            {...build(0.85)}
            id="finale-title"
            className="mt-5 max-w-[14ch] text-balance font-display text-[clamp(2.9rem,9vw,6.5rem)] leading-[0.95] text-foreground"
          >
            Happy 2nd Anniversary, {firstName}.
          </motion.h2>

          <motion.div {...build(1.25)} className="mt-8 flex items-center gap-3 sm:mt-10">
            <Heart className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
            <time className="text-xs font-medium uppercase tracking-[0.18em] text-muted sm:text-sm" dateTime="2026-09-28">
              {ANNIVERSARY_DATA.date}
            </time>
            <Heart className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
          </motion.div>

          <motion.div {...build(1.7)} className="mt-12 sm:mt-14">
            <Button
              onClick={onReplay}
              variant="secondary"
              icon={<Heart className="h-4 w-4 fill-current" aria-hidden="true" />}
              className="min-w-48 px-7 py-3.5"
            >
              Replay Our Story
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
