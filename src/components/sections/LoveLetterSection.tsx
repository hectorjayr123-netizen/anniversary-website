import { LOVE_LETTER_CONTENT } from "@constants/loveLetter";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Container, FloralBloom, StrawberryMark } from "@ui";
import { cn } from "@utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Flower2, Heart, Undo2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type LetterStage = "sealed" | "opening" | "reading";

const bloomEase = [0.22, 1, 0.36, 1] as const;

const ambientPetals = [
  { left: "7%", top: "18%", drift: 26, dur: 11, delay: 0 },
  { left: "16%", top: "64%", drift: -20, dur: 13, delay: 2.2 },
  { left: "88%", top: "24%", drift: -24, dur: 12, delay: 1.1 },
  { left: "80%", top: "70%", drift: 30, dur: 14, delay: 3.4 },
  { left: "47%", top: "9%", drift: 18, dur: 12.5, delay: 4.6 },
  { left: "62%", top: "82%", drift: -16, dur: 10.5, delay: 1.8 },
] as const;

function renderRichText(text: string, keyPrefix: string, strongClassName = "font-semibold text-foreground"): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${index}`} className={strongClassName}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export function LoveLetterSection() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<LetterStage>("sealed");
  const openTimer = useRef<number | undefined>(undefined);
  const letterHeadingRef = useRef<HTMLParagraphElement>(null);
  const envelopeButtonRef = useRef<HTMLButtonElement>(null);
  const shouldRefocusEnvelope = useRef(false);
  const isOpening = stage !== "sealed";

  const { envelopeFront, letter, metadata } = LOVE_LETTER_CONTENT;

  useEffect(
    () => () => {
      if (openTimer.current !== undefined) window.clearTimeout(openTimer.current);
    },
    []
  );

  useEffect(() => {
    if (stage !== "opening") return;

    openTimer.current = window.setTimeout(
      () => setStage("reading"),
      prefersReducedMotion ? 250 : 1600
    );
    return () => {
      if (openTimer.current !== undefined) window.clearTimeout(openTimer.current);
    };
  }, [stage, prefersReducedMotion]);

  useEffect(() => {
    if (stage === "reading") {
      letterHeadingRef.current?.focus();
      return;
    }
    if (stage === "sealed" && shouldRefocusEnvelope.current) {
      shouldRefocusEnvelope.current = false;
      envelopeButtonRef.current?.focus();
    }
  }, [stage]);

  useEffect(() => {
    if (stage !== "reading") return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") foldLetter();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  const openLetter = () => {
    if (isOpening) return;
    setStage("opening");
  };

  const foldLetter = () => {
    shouldRefocusEnvelope.current = true;
    setStage("sealed");
  };

  return (
    <section
      className="relative isolate overflow-hidden bg-blush-pink/30 py-20 sm:py-28"
      aria-labelledby="love-letter-title"
    >
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 20% 12%, rgba(255,253,249,0.85), transparent 26rem), radial-gradient(circle at 84% 86%, rgba(240,181,192,0.5), transparent 28rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/25" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {stage === "reading" &&
          ambientPetals.map((petal, index) => (
            <motion.span
              key={`${petal.left}-${petal.top}`}
              className={cn(
                "absolute h-2.5 w-1.5 bg-rose/45 shadow-[0_2px_5px_rgba(122,67,79,0.14)]",
                index % 2 === 0 ? "rounded-[80%_20%_70%_30%]" : "rounded-[70%_30%_80%_20%]"
              )}
              style={{ left: petal.left, top: petal.top }}
              initial={{ opacity: 0 }}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      opacity: [0, 0.55, 0.4, 0],
                      x: [0, petal.drift * 0.5, petal.drift],
                      y: [0, 60, 130],
                      rotate: [0, 24, 52],
                    }
              }
              transition={{ duration: petal.dur, delay: petal.delay, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
      </div>

      <Container size="sm" className="relative z-10">
        <motion.header
          className="relative z-30 mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: bloomEase }}
        >
          <p className="section-kicker">One more thing</p>
          <h2 id="love-letter-title" className="mt-4">A letter for you</h2>
          <p className="mt-4 text-sm text-muted sm:text-base">Sealed with a little wax heart, written with a lot of love.</p>
        </motion.header>

        <AnimatePresence mode="wait" initial={false}>
          {stage !== "reading" ? (
            <motion.div
              key="envelope"
              className="mx-auto mt-10 w-full max-w-[27rem] sm:mt-14"
              exit={{ opacity: 0, scale: 0.93, y: 26, filter: "blur(5px)" }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: bloomEase }}
            >
              <motion.div
                className="relative mx-auto h-[19rem] w-full [perspective:1400px] sm:h-[20rem]"
                initial={false}
                animate={isOpening ? { y: [0, -8, -6] } : { y: 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 1.3, ease: bloomEase }}
              >
                <motion.div
                  className="absolute -inset-8 rounded-full blur-2xl"
                  style={{ background: "radial-gradient(circle, rgba(255,250,240,0.95), rgba(246,216,219,0.4) 52%, transparent 74%)" }}
                  initial={false}
                  animate={isOpening ? { opacity: [0, 0.25, 0.7] } : { opacity: 0 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 1.4, delay: isOpening ? 0.25 : 0, ease: "easeInOut" }}
                  aria-hidden="true"
                />

                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <div className="absolute -left-5 bottom-2">
                    <FloralBloom size={92} petalColor="#d97691" innerColor="#f8dce2" isBloomed={isOpening} reducedMotion={prefersReducedMotion} delay={prefersReducedMotion ? 0 : 0.42} petalCount={6} rotate={16} />
                  </div>
                  <div className="absolute -right-6 top-1">
                    <FloralBloom size={82} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed={isOpening} reducedMotion={prefersReducedMotion} delay={prefersReducedMotion ? 0 : 0.58} petalCount={5} rotate={-20} />
                  </div>
                  <motion.div
                    className="absolute -bottom-3 right-6 grid h-11 w-11 place-items-center rounded-full border border-rose-pink/20 bg-warm-white/80 shadow-card"
                    initial={false}
                    animate={isOpening ? { opacity: 1, scale: 1, rotate: -9, y: 0 } : { opacity: 0, scale: 0.6, rotate: 5, y: 10 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: prefersReducedMotion ? 0 : 0.66, ease: bloomEase }}
                  >
                    <StrawberryMark className="h-7 w-7" />
                  </motion.div>
                  <motion.div
                    className="absolute -left-2 top-8 grid h-9 w-9 place-items-center rounded-full border border-rose-pink/20 bg-warm-white/80 shadow-card"
                    initial={false}
                    animate={isOpening ? { opacity: 1, scale: 1, rotate: 10, y: 0 } : { opacity: 0, scale: 0.6, rotate: -6, y: 10 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, delay: prefersReducedMotion ? 0 : 0.78, ease: bloomEase }}
                  >
                    <StrawberryMark className="h-5.5 w-5.5" />
                  </motion.div>
                </div>

                <div
                  className="absolute inset-x-3 bottom-2 top-8 rounded-2xl border border-rose-pink/25 shadow-[inset_0_2px_10px_rgba(122,67,79,0.14)]"
                  style={{ background: "linear-gradient(160deg, #f3c3cb, #e9a7b3)", transform: "translateZ(0)" }}
                  aria-hidden="true"
                />

                <motion.div
                  className="absolute inset-x-[8%] top-[16%] z-10 flex h-[62%] flex-col items-center justify-center rounded-xl border border-blush-pink/70 px-4 text-center"
                  style={{ background: "linear-gradient(180deg, #fffdf9, #fdf4ea)", boxShadow: "0 14px 30px -14px rgba(122,67,79,0.3)" }}
                  initial={false}
                  animate={isOpening ? { y: [10, -34, -72], scale: [0.96, 1, 1.03], opacity: [0, 1, 1], zIndex: [10, 40, 40] } : { y: 10, scale: 0.96, opacity: 0, zIndex: 10 }}
                  transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 1.05, delay: 0.5, times: [0, 0.55, 1], ease: bloomEase }}
                >
                  <p className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-soft-brown">{metadata.date}</p>
                  <p className="mt-2 font-script text-3xl leading-tight text-strawberry-red">{letter.salutation.split(",")[0].replace(/\*\*/g, "")},</p>
                  <p className="mt-2 line-clamp-2 max-w-[90%] text-xs leading-5 text-muted">a little something written just for you…</p>
                </motion.div>

                <motion.div
                  className="absolute inset-x-0 bottom-0 z-20 h-[74%] overflow-hidden rounded-b-2xl rounded-t-lg border border-blush-pink/60 shadow-envelope"
                  style={{ background: "linear-gradient(150deg, #fdf0e9, #f6ddd8)" }}
                  initial={false}
                  animate={isOpening ? { y: 8, opacity: 0.96 } : { y: 0, opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.7, delay: isOpening ? 0.2 : 0, ease: bloomEase }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-y-0 left-0 w-[38%]" style={{ background: "linear-gradient(105deg, transparent 62%, rgba(255,253,249,0.55) 63%, transparent 65%)" }} />
                  <div className="absolute inset-y-0 right-0 w-[38%]" style={{ background: "linear-gradient(255deg, transparent 62%, rgba(255,253,249,0.55) 63%, transparent 65%)" }} />
                  <div className="absolute inset-x-6 top-5 flex items-center justify-center gap-2 text-rose-pink/50">
                    <Heart className="h-3 w-3 fill-current" />
                    <Flower2 className="h-4 w-4" />
                    <Heart className="h-3 w-3 fill-current" />
                  </div>
                </motion.div>

                <motion.div
                  className="absolute inset-x-0 top-0 z-30 h-[62%] origin-top"
                  style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)", transformPerspective: 1400, background: "linear-gradient(160deg, #f9e3e0, #efc2c4)" }}
                  initial={false}
                  animate={isOpening ? { rotateX: [0, -76, -150], y: [0, -3, -6], zIndex: [30, 30, 6] } : { rotateX: 0, y: 0, zIndex: 30 }}
                  transition={prefersReducedMotion ? { duration: 0.01 } : { duration: 0.95, delay: 0.14, times: [0, 0.5, 1], ease: ["easeOut", "easeInOut"] }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 shadow-[0_10px_26px_rgba(120,70,80,0.16)]" />
                </motion.div>

                <motion.div
                  className="absolute left-1/2 top-[54%] z-40 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
                  style={{
                    background: "radial-gradient(circle at 34% 28%, #d65a67, #a8323f 72%)",
                    boxShadow: "0 6px 14px rgba(122,50,60,0.4), inset 0 2px 4px rgba(255,255,255,0.35)",
                  }}
                  initial={false}
                  animate={isOpening ? { scale: [1, 1.14, 0], rotate: [0, -12, 48], opacity: [1, 1, 0] } : { scale: 1, rotate: 0, opacity: 1 }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 0.42, delay: isOpening ? 0.06 : 0, ease: bloomEase }}
                  aria-hidden="true"
                >
                  <Heart className="h-5 w-5 fill-warm-white/90 text-warm-white/90" />
                </motion.div>
              </motion.div>

              <motion.button
                ref={envelopeButtonRef}
                type="button"
                onClick={openLetter}
                disabled={isOpening}
                className="mx-auto mt-8 flex min-h-11 items-center gap-2 rounded-full border border-rose-pink/35 bg-warm-white/80 px-6 py-3 text-sm font-bold text-strawberry-red shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                animate={{ opacity: isOpening ? 0 : 1, y: isOpening ? 8 : 0 }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: "easeOut" }}
                aria-expanded={isOpening}
                aria-controls="love-letter-panel"
              >
                <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
                {envelopeFront.instruction}
              </motion.button>
              <p className="sr-only" aria-live="polite">{isOpening ? "The letter is opening." : ""}</p>
            </motion.div>
          ) : (
            <motion.div
              key="letter"
              id="love-letter-panel"
              className="relative mx-auto mt-10 w-full max-w-2xl sm:mt-14"
              initial={{ opacity: 0, y: 40, scale: 0.97, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, ease: bloomEase }}
            >
              <div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] blur-2xl" style={{ background: "radial-gradient(circle at 50% 20%, rgba(255,253,249,0.9), transparent 70%)" }} aria-hidden="true" />

              <div
                className="relative rounded-[1.75rem] border border-blush-pink/70 p-1.5 shadow-card sm:p-2"
                style={{ background: "linear-gradient(160deg, #fbe0dd, #f3c8cb)" }}
              >
                <div
                  className="relative max-h-[min(72svh,44rem)] overflow-y-auto rounded-[1.35rem] border border-warm-white/80 px-5 py-7 sm:px-10 sm:py-10"
                  style={{ background: "linear-gradient(180deg, #fffdf9 0%, #fdf6ee 60%, #fbf1e6 100%)", scrollbarWidth: "thin" }}
                  role="region"
                  aria-label="Anniversary love letter"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5" style={{ background: "linear-gradient(90deg, transparent, rgba(222,145,161,0.55), transparent)" }} aria-hidden="true" />
                  <div className="pointer-events-none absolute -right-4 -top-4 origin-top-right scale-75 opacity-80 sm:scale-100" aria-hidden="true">
                    <FloralBloom size={74} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed reducedMotion={prefersReducedMotion} petalCount={5} rotate={12} />
                  </div>
                  <div className="pointer-events-none absolute -bottom-4 -left-4 opacity-70" aria-hidden="true">
                    <StrawberryMark className="h-9 w-9 -rotate-12" />
                  </div>

                  <div className="flex items-center justify-center gap-2 text-gold-foreground sm:gap-3">
                    <span className="h-px w-6 bg-gold/60 sm:w-10" />
                    <Flower2 className="h-4 w-4 shrink-0 text-rose-pink" aria-hidden="true" />
                    <span className="text-caption whitespace-nowrap">{metadata.date}</span>
                    <span className="h-px w-6 bg-gold/60 sm:w-10" />
                  </div>

                  <p
                    ref={letterHeadingRef}
                    tabIndex={-1}
                    className="mt-6 outline-none font-script text-[1.7rem] leading-snug text-strawberry-red sm:text-3xl"
                  >
                    {renderRichText(letter.salutation, "salutation", "font-semibold")}
                  </p>

                  <div className="mt-6 space-y-4 text-[0.95rem] leading-7 text-foreground/90 sm:text-base sm:leading-8">
                    {letter.body.map((paragraph, index) => (
                      <p key={`body-${index}`}>{renderRichText(paragraph, `body-${index}`)}</p>
                    ))}
                  </div>

                  <div className="mt-8">
                    <p className="font-script text-2xl text-strawberry-red">{renderRichText(letter.closing, "closing")}</p>
                    {letter.signature.split("\n").map((line, index) => (
                      <p key={`signature-${index}`} className="mt-1 font-script text-xl leading-snug text-foreground sm:text-2xl">
                        {renderRichText(line, `signature-${index}`, "font-semibold")}
                      </p>
                    ))}
                    {letter.postscript && (
                      <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-gold-foreground">
                        <Heart className="h-3 w-3 fill-current" aria-hidden="true" />
                        {letter.postscript}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-7 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={foldLetter}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-rose-pink/35 bg-warm-white/80 px-6 py-3 text-sm font-bold text-strawberry-red shadow-soft transition-transform hover:-translate-y-0.5"
                >
                  <Undo2 className="h-4 w-4" aria-hidden="true" />
                  Fold the letter back
                </button>
                <p className="text-xs text-muted">Press Esc anytime to close it.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
