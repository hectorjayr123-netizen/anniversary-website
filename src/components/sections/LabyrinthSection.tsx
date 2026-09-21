import { LABYRINTH_ENTRY, LABYRINTH_GRID, LABYRINTH_N } from "@constants/labyrinthGrid";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Button, Container, FloralBloom, StrawberryMark } from "@ui";
import { animate, AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart, RotateCcw, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";

const N = LABYRINTH_N;
const START = { x: ((LABYRINTH_ENTRY.x + 0.5) / N) * 100, y: ((LABYRINTH_ENTRY.y + 0.5) / N) * 100 };
const GOAL = { x: 50, y: 50 };
const softEase = [0.22, 1, 0.36, 1] as const;

type Stage = "intro" | "playing" | "won";
type Point = { x: number; y: number };

const isWall = (cx: number, cy: number) => {
  if (cx < 0 || cy < 0 || cx >= N || cy >= N) return true;
  return LABYRINTH_GRID[cy * N + cx] === "1";
};

const cellOpen = (fx: number, fy: number) => !isWall(Math.floor((fx / 100) * N), Math.floor((fy / 100) * N));

const segmentClear = (ax: number, ay: number, bx: number, by: number) => {
  const dist = Math.hypot(bx - ax, by - ay);
  const steps = Math.max(1, Math.ceil(dist / 1.1));
  for (let s = 1; s <= steps; s++) {
    if (!cellOpen(ax + (bx - ax) * (s / steps), ay + (by - ay) * (s / steps))) return false;
  }
  return true;
};

function HeartBurst({ show }: { show: boolean }) {
  const burst = [
    { x: -70, y: -55, s: 1 }, { x: 60, y: -62, s: 0.8 }, { x: -85, y: 20, s: 0.7 },
    { x: 82, y: 28, s: 1 }, { x: -40, y: 78, s: 0.75 }, { x: 46, y: 72, s: 0.85 },
  ];
  if (!show) return null;
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {burst.map((h, i) => (
        <motion.span
          key={i}
          className="absolute left-1/2 top-1/2 text-strawberry-red"
          initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
          animate={{ opacity: [0, 1, 0], x: h.x, y: h.y, scale: h.s }}
          transition={{ duration: 1.6, delay: 0.15 + i * 0.08, ease: "easeOut" }}
        >
          <Heart className="h-5 w-5 fill-current" />
        </motion.span>
      ))}
    </div>
  );
}

export function LabyrinthSection() {
  const prefersReducedMotion = useReducedMotion();
  const [stage, setStage] = useState<Stage>("intro");
  const [reached, setReached] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const drawingRef = useRef(false);
  const pointsRef = useRef<Point[]>([]);
  const reachedTimer = useRef<number | undefined>(undefined);
  const mazeRef = useRef<HTMLDivElement>(null);

  useEffect(
    () => () => {
      window.clearTimeout(reachedTimer.current);
    },
    []
  );

  const meX = useMotionValue(START.x);
  const meY = useMotionValue(START.y);
  const meSpringX = useSpring(meX, { stiffness: 260, damping: 26, mass: 0.6 });
  const meSpringY = useSpring(meY, { stiffness: 260, damping: 26, mass: 0.6 });
  const meLeft = useTransform(meSpringX, (v) => `${v}%`);
  const meTop = useTransform(meSpringY, (v) => `${v}%`);

  const rel = (event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = mazeRef.current?.getBoundingClientRect();
    if (!bounds) return null;
    return {
      x: Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)),
      y: Math.min(100, Math.max(0, ((event.clientY - bounds.top) / bounds.height) * 100)),
    };
  };

  const extendPath = useCallback((target: Point) => {
    const current = pointsRef.current;
    const last = current[current.length - 1] ?? START;
    const dist = Math.hypot(target.x - last.x, target.y - last.y);
    if (dist < 0.9) return;

    const step = 1.0;
    const steps = Math.ceil(dist / step);
    let accepted = last;
    for (let s = 1; s <= steps; s++) {
      const fraction = Math.min(1, (s * step) / dist);
      const nx = last.x + (target.x - last.x) * fraction;
      const ny = last.y + (target.y - last.y) * fraction;
      if (!segmentClear(last.x, last.y, nx, ny)) break;
      accepted = { x: nx, y: ny };
      if (fraction >= 1) break;
    }
    if (accepted === last) return;

    const next = [...current, accepted].slice(-500);
    pointsRef.current = next;
    setPoints(next);
    meX.set(accepted.x);
    meY.set(accepted.y);
  }, [meX, meY]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (stage !== "playing" || reached) return;
    const pos = rel(event);
    if (!pos) return;
    if (Math.hypot(pos.x - START.x, pos.y - START.y) > 9) return;
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // synthetic or already-released pointers — drawing still works without capture
    }
    drawingRef.current = true;
    pointsRef.current = [START];
    setPoints([START]);
    meX.set(START.x);
    meY.set(START.y);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drawingRef.current) return;
    const pos = rel(event);
    if (pos) extendPath(pos);
  };

  const endDrawing = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const last = pointsRef.current[pointsRef.current.length - 1];
    if (last && Math.hypot(last.x - GOAL.x, last.y - GOAL.y) < 8) {
      setStage("won");
      const glide = prefersReducedMotion ? 0.01 : 0.6;
      animate(meX, GOAL.x, { duration: glide, ease: "easeInOut" });
      animate(meY, GOAL.y, { duration: glide, ease: "easeInOut" });
      window.clearTimeout(reachedTimer.current);
      reachedTimer.current = window.setTimeout(() => setReached(true), prefersReducedMotion ? 30 : 680);
    }
  };

  const resetGame = () => {
    window.clearTimeout(reachedTimer.current);
    pointsRef.current = [];
    setPoints([]);
    setReached(false);
    setStage("playing");
    meX.set(START.x);
    meY.set(START.y);
  };

  const pathString = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-28" aria-labelledby="labyrinth-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 82% 10%, rgba(246,216,219,0.6), transparent 26rem), radial-gradient(circle at 12% 88%, rgba(201,164,83,0.13), transparent 26rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/20" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-9 top-40 opacity-70 sm:opacity-100">
          <FloralBloom size={100} petalColor="#d97691" innerColor="#f8dce2" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={6} rotate={-10} />
        </div>
        <div className="absolute -right-9 bottom-24 hidden opacity-80 sm:block">
          <FloralBloom size={88} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={5} rotate={22} />
        </div>
        <StrawberryMark className="absolute left-[10%] bottom-[14%] hidden h-8 w-8 -rotate-12 opacity-75 sm:block" />
        <StrawberryMark className="absolute right-[8%] top-[16%] h-7 w-7 rotate-12 opacity-70" />
      </div>

      <Container size="sm" className="relative z-10">
        <motion.p
          className="text-center font-romantic text-[clamp(1.6rem,5vw,2.6rem)] leading-snug text-soft-brown"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.0, ease: softEase }}
        >
          And after everything we&apos;ve been through…
        </motion.p>
        <motion.p
          className="mt-3 flex items-center justify-center gap-2 text-center font-romantic text-[clamp(1.6rem,5vw,2.6rem)] leading-snug text-strawberry-red"
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 1.0, delay: prefersReducedMotion ? 0 : 1.7, ease: softEase }}
        >
          There&apos;s one more journey I&apos;d like you to take.
          <Heart className="h-6 w-6 shrink-0 fill-current" aria-hidden="true" />
        </motion.p>

        <AnimatePresence mode="wait" initial={false}>
          {stage === "intro" ? (
            <motion.div
              key="intro"
              className="relative mx-auto mt-12 w-full max-w-xl sm:mt-16"
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.4 }}
              exit={{ opacity: 0, scale: 0.94, y: -18, filter: "blur(6px)", transition: { duration: prefersReducedMotion ? 0.01 : 0.55, ease: softEase } }}
              transition={{ duration: 0.9, delay: prefersReducedMotion ? 0 : 3.1, ease: softEase }}
            >
              <div className="relative rounded-[2rem] border border-blush-pink/60 bg-gradient-to-b from-[#fffdf9] to-[#fdf1ee] px-6 py-10 text-center shadow-card sm:px-10 sm:py-12">
                <p className="section-kicker">One last chapter</p>
                <h2 id="labyrinth-title" className="mt-5 font-display text-[clamp(1.7rem,6vw,2.9rem)] uppercase leading-tight tracking-[0.14em] text-foreground">
                  Take Me to Your Heart
                </h2>
                <p className="mt-1 font-script text-[clamp(2.4rem,9vw,4rem)] leading-none text-strawberry-red">Labyrinth</p>

                <div className="mx-auto mt-6 flex max-w-xs items-center gap-3 text-gold-foreground">
                  <span className="h-px flex-1 bg-gold/60" />
                  <Sparkles className="h-4 w-4 text-gold" aria-hidden="true" />
                  <span className="h-px flex-1 bg-gold/60" />
                </div>

                <p className="mt-5 text-sm text-muted sm:text-base">
                  Can you guide me to your heart?
                </p>
                <p className="mx-auto mt-3 max-w-sm text-xs leading-5 text-muted/85">
                  Draw the way through the glowing labyrinth — and I will follow every line you draw, straight to you.
                </p>

                <motion.div
                  className="mt-8"
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.035, y: -2 }}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18 }}
                >
                  <Button
                    onClick={() => setStage("playing")}
                    icon={<Heart className="h-4 w-4 fill-current" aria-hidden="true" />}
                    className="min-w-64 px-6 py-4 text-base shadow-[0_16px_34px_-14px_rgba(189,70,88,0.55)]"
                  >
                    Click Here to Play the Lovable Game
                  </Button>
                </motion.div>
                <p className="mt-4 inline-flex items-center gap-1.5 text-[0.7rem] text-muted/80">
                  <StrawberryMark className="h-4 w-4" />
                  Made with love, for you
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              className="mx-auto mt-10 w-full max-w-[30rem] sm:mt-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, ease: softEase }}
            >
              <div className="mb-4 text-center">
                <p className="text-sm font-semibold text-soft-brown">
                  {reached ? "You guided me to your heart. ❤️" : "Draw a path from me to my heart."}
                </p>
                <p className="mt-1 text-xs text-muted">
                  {reached
                    ? "Every path I take leads straight to you."
                    : "Press near “Me”, draw through the glow, and stop at “My Heart”. Walls gently hold your line."}
                </p>
              </div>

              <div
                ref={mazeRef}
                className="relative mx-auto aspect-square w-full select-none touch-none rounded-[2rem] border border-blush-pink/60 bg-gradient-to-b from-[#fff8f5] to-[#fdeef0] shadow-card"
                style={{ cursor: reached ? "default" : "crosshair" }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={endDrawing}
                onPointerCancel={endDrawing}
                role="img"
                aria-label={`Labyrinth game. ${reached ? "He reached her heart." : "Draw with a finger or mouse from Me at the top left to My Heart in the center."}`}
              >
                <motion.div
                  className="absolute inset-[1.5%]"
                  initial={prefersReducedMotion ? false : { clipPath: `circle(5% at ${START.x}% ${START.y}%)` }}
                  animate={{ clipPath: `circle(140% at ${START.x}% ${START.y}%)` }}
                  transition={{ duration: prefersReducedMotion ? 0.01 : 1.4, delay: prefersReducedMotion ? 0 : 0.25, ease: softEase }}
                >
                  <img
                    src="/images/game/labyrinth.png"
                    alt=""
                    className="h-full w-full object-contain"
                    style={{ filter: "drop-shadow(0 0 14px rgba(222,145,161,0.45))" }}
                    draggable={false}
                  />
                </motion.div>

                <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  {points.length > 1 && (
                    <>
                      <polyline
                        points={pathString}
                        fill="none"
                        stroke="#f3b7c3"
                        strokeWidth={2.6}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.55}
                      />
                      <polyline
                        points={pathString}
                        fill="none"
                        stroke="#c2495f"
                        strokeWidth={1.1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={0.9}
                      />
                    </>
                  )}
                </svg>

                <AnimatePresence>
                  {!reached && (
                    <motion.div
                      key="her-marker"
                      className="absolute"
                      style={{ left: `${GOAL.x}%`, top: `${GOAL.y}%` }}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: prefersReducedMotion ? 0 : 1.5, ease: softEase }}
                    >
                      <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <motion.span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{ width: "5.2rem", height: "5.2rem", background: "radial-gradient(circle, rgba(246,181,196,0.75), transparent 70%)" }}
                          animate={prefersReducedMotion ? undefined : { scale: [1, 1.25, 1], opacity: [0.55, 0.9, 0.55] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span className="heart-mask absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2" style={{ background: "linear-gradient(160deg, #f6bcc9, #e58ea2)" }} aria-hidden="true" />
                        <img
                          src="/images/game/her.png"
                          alt="Her portrait"
                          className="relative h-14 w-14 rounded-full border-[3px] border-warm-white object-cover object-top shadow-card"
                          style={{ objectPosition: "50% 12%" }}
                          draggable={false}
                        />
                        <motion.span
                          className="absolute -right-2 -top-2 text-strawberry-red"
                          animate={prefersReducedMotion ? undefined : { y: [-1, -4, -1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                          aria-hidden="true"
                        >
                          <Heart className="h-3.5 w-3.5 fill-current" />
                        </motion.span>
                        <p className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap text-[0.68rem] font-bold text-strawberry-red">
                          My Heart ❤️
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {!reached && (
                    <motion.div
                      key="me-marker"
                      className="absolute z-10"
                      style={{ left: meLeft, top: meTop }}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.4 }}
                      transition={{ duration: prefersReducedMotion ? 0.01 : 0.6, delay: prefersReducedMotion ? 0 : 1.25, ease: softEase }}
                    >
                      <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <img
                          src="/images/game/me.png"
                          alt="His portrait"
                          className="h-12 w-12 rounded-full border-[3px] border-warm-white object-cover object-top shadow-card"
                          style={{ objectPosition: "50% 10%" }}
                          draggable={false}
                        />
                        <p className="absolute left-1/2 top-full mt-1 whitespace-nowrap text-[0.68rem] font-bold text-soft-brown">
                          Me ❤️
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {reached && (
                    <motion.div
                      key="together"
                      className="absolute z-20"
                      style={{ left: `${GOAL.x}%`, top: `${GOAL.y}%` }}
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 16 }}
                    >
                      <div className="relative -translate-x-1/2 -translate-y-1/2">
                        <motion.span
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                          style={{ width: "7rem", height: "7rem", background: "radial-gradient(circle, rgba(246,181,196,0.85), transparent 72%)" }}
                          animate={prefersReducedMotion ? undefined : { scale: [1, 1.18, 1], opacity: [0.7, 1, 0.7] }}
                          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <img
                          src="/images/game/together.png"
                          alt="The two of us, together at last"
                          className="relative h-20 w-20 rounded-full border-[3px] border-warm-white object-cover object-top shadow-card"
                          style={{ objectPosition: "50% 14%" }}
                          draggable={false}
                        />
                        <HeartBurst show />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-6 flex items-center justify-center gap-3">
                <Button onClick={resetGame} variant="secondary" icon={<RotateCcw className="h-4 w-4" aria-hidden="true" />} className="px-5 py-2.5 text-sm">
                  {reached ? "Play again" : "Draw again"}
                </Button>
              </div>
              <p className="sr-only" aria-live="polite">
                {reached ? "He followed your path and reached your heart." : ""}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}
