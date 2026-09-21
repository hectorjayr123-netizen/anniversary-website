import { MEMORY_PHOTOS } from "@constants/memories";
import { Container } from "@ui";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, GripHorizontal, Sparkles } from "lucide-react";
import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from "react";

const STACK_OFFSETS = [-2, -1, 0, 1, 2] as const;
const SWIPE_THRESHOLD = 72;
const RESTING_TILT = { x: 0, y: 0, lightX: 50, lightY: 22 };

interface TiltState {
  x: number;
  y: number;
  lightX: number;
  lightY: number;
}

function getPhotoIndex(index: number) {
  return (index + MEMORY_PHOTOS.length) % MEMORY_PHOTOS.length;
}

function formatMemoryNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function MemoryGallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [tilt, setTilt] = useState<TiltState>(RESTING_TILT);
  const dragStart = useRef<{ x: number; pointerId: number } | null>(null);
  const activePhoto = MEMORY_PHOTOS[activeIndex];

  const resetInteraction = () => {
    dragStart.current = null;
    setDragX(0);
    setIsDragging(false);
    setTilt(RESTING_TILT);
  };

  const moveMemory = (direction: 1 | -1) => {
    setActiveIndex((current) => getPhotoIndex(current + direction));
    setDragX(0);
    setTilt(RESTING_TILT);
  };

  const updateTilt = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const positionX = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    const positionY = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));

    setTilt({
      x: (0.5 - positionY) * 7,
      y: (positionX - 0.5) * 9,
      lightX: positionX * 100,
      lightY: positionY * 100,
    });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    dragStart.current = { x: event.clientX, pointerId: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    updateTilt(event);

    if (dragStart.current) {
      setDragX(event.clientX - dragStart.current.x);
    }
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = dragStart.current;
    if (!start) return;

    const distance = event.clientX - start.x;
    if (distance <= -SWIPE_THRESHOLD) moveMemory(1);
    if (distance >= SWIPE_THRESHOLD) moveMemory(-1);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetInteraction();
  };

  const handlePointerCancel = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetInteraction();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveMemory(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveMemory(1);
    }
  };

  const getCardTransform = (offset: number) => {
    if (offset === 0) {
      return `translate3d(${dragX}px, 0, 72px) rotateX(${tilt.x}deg) rotateY(${tilt.y + dragX / 22}deg) rotateZ(${dragX / 44}deg)`;
    }

    const distance = Math.abs(offset);
    return `translate3d(${offset * 32}%, ${distance * 18}px, -${distance * 68}px) rotateY(${-offset * 16}deg) rotateZ(${offset * 2.25}deg) scale(${1 - distance * 0.07})`;
  };

  return (
    <section className="relative isolate overflow-hidden bg-warm-white py-20 sm:py-28" aria-labelledby="memory-gallery-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 12% 18%, rgba(246,216,219,0.68), transparent 28rem), radial-gradient(circle at 88% 75%, rgba(201,164,83,0.16), transparent 28rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/20" aria-hidden="true" />

      <Container size="md" className="relative z-10">
        <motion.header
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <p className="section-kicker">A few keepsakes</p>
          <h2 id="memory-gallery-title" className="mt-4">Our memories</h2>
          <p className="mt-4 text-sm text-muted sm:text-base">Drag a photograph, swipe, or use the arrows to move between memories.</p>
        </motion.header>

        <motion.div
          className="mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="relative mx-auto w-full max-w-2xl cursor-grab select-none outline-none active:cursor-grabbing"
            style={{ height: "min(31rem, 124vw)", perspective: "1600px", touchAction: "pan-y" }}
            role="group"
            aria-roledescription="carousel"
            aria-label={`${activePhoto.caption} is selected. Drag or use the arrow keys to change memory.`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onPointerLeave={() => {
              if (!dragStart.current) setTilt(RESTING_TILT);
            }}
          >
            {STACK_OFFSETS.map((offset) => {
              const photoIndex = getPhotoIndex(activeIndex + offset);
              const photo = MEMORY_PHOTOS[photoIndex];
              const isActive = offset === 0;
              const distance = Math.abs(offset);

              return (
                <article
                  key={`${photo.id}-${offset}`}
                  className="absolute inset-x-0 top-0 bottom-10"
                  style={{
                    zIndex: 10 - distance,
                    opacity: isActive ? 1 : distance === 1 ? 0.72 : 0.42,
                    transform: getCardTransform(offset),
                    transformStyle: "preserve-3d",
                    transition: isDragging && isActive ? "none" : "transform 620ms cubic-bezier(0.22, 1, 0.36, 1), opacity 360ms ease",
                    willChange: isActive ? "transform" : "auto",
                  }}
                  aria-hidden={!isActive}
                >
                  <div
                    className="absolute inset-x-3 bottom-0 h-4 rounded-b-[1.4rem] bg-soft-brown/45"
                    style={{ transform: "translateZ(-10px) translateY(8px)", boxShadow: "0 22px 36px rgba(68,55,47,0.2)" }}
                  />
                  <div
                    className="absolute inset-0 rounded-[1.55rem] border border-soft-brown/20"
                    style={{ transform: "translateZ(-4px)", background: "linear-gradient(145deg, #f7e2dd, #d9afaf)" }}
                  />
                  <figure
                    className="relative flex h-full flex-col rounded-[1.55rem] border border-warm-white/90 bg-warm-white p-3 sm:p-4"
                    style={{ transform: "translateZ(12px)", boxShadow: "0 18px 32px rgba(68,55,47,0.18)" }}
                  >
                    <div
                      className="relative min-h-0 flex-1 overflow-hidden rounded-[1.05rem] bg-soft-brown/10"
                      style={{ transform: "translateZ(12px)", boxShadow: "inset 0 0 0 1px rgba(255,253,249,0.5)" }}
                    >
                      <img
                        className="h-full w-full object-contain"
                        src={`/images/3d/${photo.filename}`}
                        alt={isActive ? photo.caption : ""}
                        loading={isActive ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                      />
                      <div
                        className="pointer-events-none absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at ${tilt.lightX}% ${tilt.lightY}%, rgba(255,255,255,0.38), transparent 42%), repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, rgba(68,55,47,0.035) 1px 2px)`,
                          mixBlendMode: "soft-light",
                        }}
                        aria-hidden="true"
                      />
                    </div>
                    <figcaption
                      className="flex items-center justify-between gap-3 px-1 pt-3 text-sm font-semibold text-soft-brown sm:pt-4"
                      style={{ transform: "translateZ(16px)" }}
                    >
                      <span>{photo.caption}</span>
                      {isActive && (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
                          <GripHorizontal className="h-4 w-4" aria-hidden="true" />
                          Drag
                        </span>
                      )}
                    </figcaption>
                  </figure>
                </article>
              );
            })}
          </div>

          <div className="mx-auto mt-2 flex max-w-sm items-center justify-center gap-4 sm:mt-4">
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-rose-pink/30 bg-warm-white text-strawberry-red shadow-card transition-transform hover:-translate-y-0.5"
              onClick={() => moveMemory(-1)}
              aria-label="Show previous memory"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="min-w-36 text-center">
              <p className="text-sm font-semibold text-soft-brown">{activePhoto.caption}</p>
              <p className="mt-0.5 text-xs text-muted">{formatMemoryNumber(activeIndex)} / {formatMemoryNumber(MEMORY_PHOTOS.length - 1)}</p>
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full border border-rose-pink/30 bg-warm-white text-strawberry-red shadow-card transition-transform hover:-translate-y-0.5"
              onClick={() => moveMemory(1)}
              aria-label="Show next memory"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav className="mt-7 flex flex-wrap justify-center gap-2" aria-label="Choose a memory">
            {MEMORY_PHOTOS.map((photo, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={photo.id}
                  type="button"
                    className={`min-h-11 min-w-11 rounded-full border px-3 py-2 text-xs font-bold tracking-[0.12em] transition-colors ${
                    isActive
                      ? "border-strawberry-red bg-strawberry-red text-warm-white"
                      : "border-rose-pink/25 bg-warm-white/75 text-soft-brown hover:border-rose-pink"
                  }`}
                  onClick={() => {
                    setActiveIndex(index);
                    setDragX(0);
                    setTilt(RESTING_TILT);
                  }}
                  aria-label={`Show ${photo.caption}`}
                  aria-current={isActive ? "true" : undefined}
                >
                  {formatMemoryNumber(index)}
                </button>
              );
            })}
          </nav>

          <p className="sr-only" aria-live="polite">{activePhoto.caption} selected.</p>
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-muted" aria-hidden="true">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            Move the photo with your cursor or finger.
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
