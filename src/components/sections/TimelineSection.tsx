import { JOURNEY_CHAPTERS, TIMELINE_CONFIG, type JourneyChapter } from "@constants/timeline";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Container, FloralBloom, StrawberryMark } from "@ui";
import { cn } from "@utils/cn";
import { motion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import { useState } from "react";

const softEase = [0.22, 1, 0.36, 1] as const;

const decorSticker: Record<JourneyChapter["decor"], string | null> = {
  rose: "/images/decor/flower-1.png",
  blossom: "/images/decor/bloom-1.png",
  heart: null,
  strawberry: "/images/decor/strawberry.png",
  anniversary: "/images/decor/flower-5.png",
};

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: "blur(5px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: 0.75, delay, ease: softEase },
});

function ChapterNode({ decor, delay }: { decor: JourneyChapter["decor"]; delay: number }) {
  const sticker = decorSticker[decor];
  return (
    <motion.span
      className="absolute left-[1.4rem] top-0 z-10 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-gold/60 bg-warm-white shadow-soft sm:left-1/2"
      initial={{ opacity: 0, scale: 0.4 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, delay, ease: softEase }}
      aria-hidden="true"
    >
      {sticker ? (
        <img src={sticker} alt="" className="h-7 w-7 object-contain" draggable={false} />
      ) : (
        <Heart className="h-4.5 w-4.5 fill-strawberry-red text-strawberry-red" />
      )}
    </motion.span>
  );
}

function ChapterPhoto({ chapter, index }: { chapter: JourneyChapter; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const [broken, setBroken] = useState(false);
  const showPhoto = chapter.image && !broken;

  return (
    <motion.div
      className={cn("relative", chapter.decor === "anniversary" && "sm:px-2")}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: prefersReducedMotion ? 0 : 0.24, ease: softEase }}
    >
      {chapter.decor === "anniversary" && (
        <motion.div
          className="absolute -inset-5 rounded-[2.5rem] blur-2xl"
          style={{ background: "radial-gradient(circle at 50% 45%, rgba(246,181,196,0.55), transparent 70%)" }}
          animate={prefersReducedMotion ? undefined : { opacity: [0.6, 0.95, 0.6] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        />
      )}
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden rounded-3xl border border-blush-pink/60 shadow-card",
          chapter.decor === "anniversary" ? "border-gold/50" : ""
        )}
        style={{ background: "linear-gradient(150deg, #fff6f3, #fce4e9 60%, #f8d3dc)" }}
      >
        {showPhoto ? (
          <img
            src={chapter.image}
            alt={`Our photo from chapter ${chapter.chapter} — ${chapter.title}`}
            className="h-full w-full object-cover"
            onError={() => setBroken(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="grid h-full w-full place-items-center">
            <motion.div
              className="relative"
              animate={prefersReducedMotion ? undefined : { y: [0, -5, 0], rotate: [-3, 3, -3] }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
            >
              <img
                src={decorSticker[chapter.decor] ?? "/images/decor/bloom-2.png"}
                alt=""
                className={cn("object-contain drop-shadow-[0_6px_12px_rgba(122,67,79,0.25)]", chapter.decor === "strawberry" ? "h-24" : "h-28")}
                draggable={false}
              />
              <Heart className="absolute -right-3 -top-2 h-4 w-4 fill-rose-pink/80 text-rose-pink/80" aria-hidden="true" />
              <Sparkles className="absolute -left-4 bottom-0 h-3.5 w-3.5 text-gold" aria-hidden="true" />
            </motion.div>
          </div>
        )}
        {chapter.decor === "anniversary" && (
          <>
            <Heart className="absolute left-4 top-4 h-4 w-4 fill-strawberry-red/60 text-strawberry-red/60" aria-hidden="true" />
            <Heart className="absolute bottom-4 right-4 h-3.5 w-3.5 fill-rose-pink/80 text-rose-pink/80" aria-hidden="true" />
          </>
        )}
      </div>
    </motion.div>
  );
}

function ChapterRow({ chapter, index }: { chapter: JourneyChapter; index: number }) {
  const prefersReducedMotion = useReducedMotion();
  const leftSide = index % 2 === 0;
  const textCol = leftSide ? "sm:col-start-1 sm:text-right" : "sm:col-start-3";
  const photoCol = leftSide ? "sm:col-start-3" : "sm:col-start-1";

  return (
    <li className="relative pb-14 pl-14 last:pb-4 sm:grid sm:grid-cols-[1fr_4.5rem_1fr] sm:items-center sm:gap-0 sm:pl-0">
      <ChapterNode decor={chapter.decor} delay={prefersReducedMotion ? 0 : 0.05} />

      <div className={cn("relative", textCol)}>
        {chapter.decor === "anniversary" && (
          <motion.div
            className="absolute -inset-8 -z-10 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgba(255,250,240,0.9), transparent 72%)" }}
            aria-hidden="true"
          />
        )}
        <motion.p
          {...reveal(0)}
          className={cn(
            "inline-flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-gold-foreground",
            chapter.decor === "anniversary" && "text-strawberry-red"
          )}
        >
          {decorSticker[chapter.decor] && (
            <img src={decorSticker[chapter.decor] ?? ""} alt="" className="h-6 w-6 object-contain" draggable={false} />
          )}
          Chapter {chapter.chapter}
          {chapter.decor === "anniversary" && <Heart className="h-3 w-3 fill-current text-strawberry-red" aria-hidden="true" />}
        </motion.p>
        <motion.h3
          {...reveal(0.12)}
          className={cn(
            "mt-2 font-display text-[clamp(1.7rem,5vw,2.6rem)] leading-tight text-foreground",
            chapter.decor === "anniversary" && "text-strawberry-red"
          )}
        >
          {chapter.title}
        </motion.h3>
      </div>

      <div className={cn("mt-4 sm:mt-0", photoCol, "sm:row-span-2 sm:self-center")}>
        <ChapterPhoto chapter={chapter} index={index} />
      </div>

      <motion.p
        {...reveal(0.36)}
        className={cn("mt-4 max-w-md text-sm leading-7 text-foreground/85 sm:mt-2 sm:text-[0.95rem] sm:leading-8", textCol)}
      >
        {chapter.story}
      </motion.p>
    </li>
  );
}

export function TimelineSection() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative isolate overflow-hidden bg-warm-white py-20 sm:py-28" aria-labelledby="timeline-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 14% 8%, rgba(246,216,219,0.55), transparent 26rem), radial-gradient(circle at 88% 90%, rgba(201,164,83,0.12), transparent 26rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/20" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-8 top-24 opacity-70 sm:opacity-100">
          <FloralBloom size={104} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={6} rotate={-14} />
        </div>
        <div className="absolute -right-10 bottom-32 hidden opacity-80 sm:block">
          <FloralBloom size={92} petalColor="#d97691" innerColor="#f8dce2" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={5} rotate={20} />
        </div>
        <StrawberryMark className="absolute right-[9%] top-[12%] h-8 w-8 rotate-12 opacity-75" />
        <StrawberryMark className="absolute bottom-[8%] left-[7%] hidden h-7 w-7 -rotate-12 opacity-70 sm:block" />
      </div>

      <Container size="md" className="relative z-10">
        <motion.header
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.65, ease: softEase }}
        >
          <p className="section-kicker">Chapter by chapter</p>
          <h2 id="timeline-title" className="mt-4">{TIMELINE_CONFIG.title}</h2>
          <p className="mt-4 text-sm text-muted sm:text-base">{TIMELINE_CONFIG.subtitle}</p>
        </motion.header>

        <ol className="relative mx-auto mt-12 max-w-4xl sm:mt-16">
          <div
            className="absolute bottom-6 left-[1.4rem] top-3 hidden w-px sm:left-1/2 sm:block"
            style={{ background: "linear-gradient(180deg, transparent, rgba(222,145,161,0.6) 5%, rgba(222,145,161,0.6) 95%, transparent)" }}
            aria-hidden="true"
          />
          {JOURNEY_CHAPTERS.map((chapter, index) => (
            <ChapterRow key={chapter.id} chapter={chapter} index={index} />
          ))}
        </ol>

        <motion.div
          {...reveal(0)}
          className="mt-2 flex flex-col items-center gap-3"
          aria-hidden="true"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-14 bg-gold/50" />
            <Heart className="h-4 w-4 fill-strawberry-red/80 text-strawberry-red/80" />
            <span className="h-px w-14 bg-gold/50" />
          </div>
          <p className="text-center text-[0.7rem] text-muted/80">
            Photos can be added in <span className="font-semibold">public/images/journey/</span>
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
