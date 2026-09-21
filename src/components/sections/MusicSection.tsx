import { MUSIC_TRACKS } from "@constants/music";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { Container, FloralBloom, StrawberryMark } from "@ui";
import { cn } from "@utils/cn";
import { AnimatePresence, motion } from "framer-motion";
import { Flower2, Heart, Music2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";

const softEase = [0.22, 1, 0.36, 1] as const;

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function MusicSection({ externalAudio }: { externalAudio?: RefObject<HTMLAudioElement | null> }) {
  const prefersReducedMotion = useReducedMotion();
  const [audioEl, setAudioEl] = useState<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [brokenTracks, setBrokenTracks] = useState<string[]>([]);
  const [artworkBroken, setArtworkBroken] = useState(false);

  const track = MUSIC_TRACKS[currentIndex];
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const pendingPlayRef = useRef(false);
  const appliedSrcRef = useRef<string | null>(null);
  const indexRef = useRef(0);
  const endedRef = useRef<() => void>(() => {});

  // adopt the gift-click audio element when provided, otherwise create our own
  useEffect(() => {
    const external = externalAudio?.current ?? null;
    const el = external ?? new Audio();
    const isExternal = Boolean(external);
    if (!el.preload) el.preload = "metadata";

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(el.currentTime);
    const onDur = () => setDuration(el.duration);
    const onEnded = () => endedRef.current();
    const onError = () => {
      const id = MUSIC_TRACKS[indexRef.current].id;
      setBrokenTracks((current) => (current.includes(id) ? current : [...current, id]));
    };
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDur);
    el.addEventListener("ended", onEnded);
    el.addEventListener("error", onError);

    if (isExternal) {
      // the gift click already loaded and started track 1 — don't restart it
      appliedSrcRef.current = MUSIC_TRACKS[0].file;
      setIsPlaying(!el.paused);
      setCurrentTime(el.currentTime);
      if (Number.isFinite(el.duration) && el.duration > 0) setDuration(el.duration);
    }
    setAudioEl(el);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDur);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("error", onError);
      if (!isExternal) {
        el.pause();
        el.src = "";
      }
    };
  }, [externalAudio]);

  useEffect(() => {
    if (audioEl) audioEl.volume = isMuted ? 0 : volume;
  }, [audioEl, volume, isMuted]);

  // apply the selected track's source, then start playback if it was requested
  useEffect(() => {
    const el = audioEl;
    if (!el) return;
    indexRef.current = currentIndex;
    const url = MUSIC_TRACKS[currentIndex].file;
    if (appliedSrcRef.current !== url) {
      appliedSrcRef.current = url;
      el.src = url;
      setCurrentTime(0);
      setDuration(0);
      setArtworkBroken(false);
      el.load();
    }
    if (pendingPlayRef.current) {
      pendingPlayRef.current = false;
      el.play().catch(() => setIsPlaying(false));
    }
  }, [audioEl, currentIndex]);

  const togglePlay = useCallback(() => {
    const audio = audioEl;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [audioEl]);

  const changeTrack = useCallback((nextIndex: number, autoplay: boolean) => {
    pendingPlayRef.current = autoplay;
    setCurrentIndex(((nextIndex % MUSIC_TRACKS.length) + MUSIC_TRACKS.length) % MUSIC_TRACKS.length);
    setCurrentTime(0);
    setDuration(0);
    setArtworkBroken(false);
    if (autoplay) setIsPlaying(true);
  }, []);

  const playNext = useCallback(() => changeTrack(currentIndex + 1, true), [changeTrack, currentIndex]);
  useEffect(() => {
    endedRef.current = playNext;
  }, [playNext]);

  const playPrevious = useCallback(() => {
    const audio = audioEl;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    changeTrack(currentIndex - 1, isPlaying);
  }, [audioEl, changeTrack, currentIndex, isPlaying]);

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioEl;
    if (!audio || duration <= 0) return;
    const time = (Number(event.target.value) / 1000) * duration;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const activeBroken = brokenTracks.includes(track.id);

  return (
    <section className="relative isolate overflow-hidden bg-cream py-20 sm:py-28" aria-labelledby="music-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 85% 12%, rgba(246,216,219,0.6), transparent 26rem), radial-gradient(circle at 10% 82%, rgba(201,164,83,0.14), transparent 26rem)" }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-rose-pink/20" aria-hidden="true" />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-8 top-16 opacity-70 sm:opacity-100">
          <FloralBloom size={96} petalColor="#e6a0ad" innerColor="#fff0f2" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={6} rotate={24} />
        </div>
        <div className="absolute -right-10 bottom-14 hidden opacity-70 sm:block">
          <FloralBloom size={112} petalColor="#de91a1" innerColor="#fbe7ea" isBloomed reducedMotion={prefersReducedMotion} settled petalCount={8} rotate={-12} />
        </div>
        <StrawberryMark className="absolute bottom-[18%] left-[8%] hidden h-8 w-8 -rotate-12 opacity-80 sm:block" />
        <StrawberryMark className="absolute right-[12%] top-[16%] h-7 w-7 rotate-12 opacity-70" />
      </div>

      <Container size="sm" className="relative z-10">
        <motion.header
          className="mx-auto max-w-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.65, ease: softEase }}
        >
          <p className="section-kicker">Our soundtrack</p>
          <h2 id="music-title" className="mt-4">The songs of us</h2>
          <p className="mt-4 text-sm text-muted sm:text-base">Three songs that sound like us. Press play whenever your heart wants to listen.</p>
        </motion.header>

        <motion.div
          className="relative mx-auto mt-10 w-full max-w-md sm:mt-14"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, delay: 0.08, ease: softEase }}
        >
          <motion.div
            className="absolute -inset-6 rounded-[2.5rem] blur-2xl"
            style={{ background: "radial-gradient(circle at 50% 32%, rgba(240,181,192,0.5), transparent 68%)" }}
            animate={{ opacity: isPlaying ? 0.9 : 0.35 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            aria-hidden="true"
          />

          <div className="relative rounded-[2rem] border border-blush-pink/60 bg-gradient-to-b from-[#fffdf9] to-[#fdf1ee] p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-soft-brown">
                <Flower2 className="h-3.5 w-3.5 text-rose-pink" aria-hidden="true" />
                Anniversary mixtape
              </span>
              <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted">
                {String(currentIndex + 1).padStart(2, "0")} / {String(MUSIC_TRACKS.length).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-6 flex items-center gap-5 sm:gap-6">
              <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
                <div
                  className="absolute inset-0 rounded-full border-4 border-warm-white shadow-[0_10px_26px_rgba(122,67,79,0.22)] animate-spin"
                  style={{
                    animationPlayState: isPlaying ? "running" : "paused",
                    background: "repeating-radial-gradient(circle at 50% 50%, #e9abb7 0 2px, #e29ca9 2px 5px)",
                  }}
                >
                  <div className="absolute inset-[18%] overflow-hidden rounded-full border border-warm-white/70 bg-blush-pink">
                    {!artworkBroken && track.artwork ? (
                      <img
                        src={track.artwork}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={() => setArtworkBroken(true)}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-blush-pink to-rose-pink/70">
                        <Heart className="h-7 w-7 fill-warm-white/85 text-warm-white/85" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <div className="absolute left-1/2 top-1/2 grid h-7 w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-warm-white bg-warm-white shadow-inner">
                    <StrawberryMark className="h-4 w-4" />
                  </div>
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={track.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.01 : 0.3, ease: softEase }}
                  >
                    <p className="line-clamp-2 font-display text-2xl leading-tight text-foreground sm:text-3xl">{track.title}</p>
                    <p className="mt-1 truncate text-sm font-semibold text-soft-brown">{track.artist}</p>
                  </motion.div>
                </AnimatePresence>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                  {isPlaying ? (
                    <span className="inline-flex items-end gap-[3px]" aria-hidden="true">
                      {[0.9, 0.6, 1.1].map((speed, index) => (
                        <motion.span
                          key={speed}
                          className="w-[3px] rounded-full bg-rose-pink"
                          animate={prefersReducedMotion ? undefined : { scaleY: [0.35, 1, 0.35] }}
                          transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", delay: index * 0.12 }}
                          style={{ height: "0.75rem", originY: 1 }}
                        />
                      ))}
                    </span>
                  ) : (
                    <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {isPlaying ? "Now playing" : "Ready when you are"}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <label className="sr-only" htmlFor="music-progress">
                Seek through {track.title}
              </label>
              <input
                id="music-progress"
                className="range-rose w-full"
                type="range"
                min={0}
                max={1000}
                value={duration > 0 ? Math.round((currentTime / duration) * 1000) : 0}
                onChange={seek}
                style={{ "--fill": `${progress}%` } as CSSProperties}
                disabled={duration <= 0}
              />
              <div className="mt-1.5 flex justify-between text-[0.7rem] font-semibold tabular-nums text-muted">
                <span>{formatTime(currentTime)}</span>
                <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={playPrevious}
                className="grid h-11 w-11 place-items-center rounded-full border border-rose-pink/30 bg-warm-white text-strawberry-red shadow-soft transition-transform hover:-translate-y-0.5"
                aria-label="Previous song"
              >
                <SkipBack className="h-4.5 w-4.5 fill-current" aria-hidden="true" />
              </button>
              <motion.button
                type="button"
                onClick={togglePlay}
                className="grid h-16 w-16 place-items-center rounded-full text-warm-white shadow-[0_14px_30px_-10px_rgba(189,70,88,0.55)]"
                style={{ background: "linear-gradient(135deg, #de7f92, #bd4658)" }}
                whileTap={{ scale: 0.94 }}
                aria-label={isPlaying ? `Pause ${track.title}` : `Play ${track.title}`}
              >
                {isPlaying ? <Pause className="h-6 w-6 fill-current" aria-hidden="true" /> : <Play className="ml-1 h-6 w-6 fill-current" aria-hidden="true" />}
              </motion.button>
              <button
                type="button"
                onClick={playNext}
                className="grid h-11 w-11 place-items-center rounded-full border border-rose-pink/30 bg-warm-white text-strawberry-red shadow-soft transition-transform hover:-translate-y-0.5"
                aria-label="Next song"
              >
                <SkipForward className="h-4.5 w-4.5 fill-current" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMuted((current) => !current)}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-soft-brown transition-colors hover:bg-blush-pink/40"
                aria-label={isMuted ? "Unmute music" : "Mute music"}
                aria-pressed={isMuted}
              >
                {isMuted ? <VolumeX className="h-4.5 w-4.5" aria-hidden="true" /> : <Volume2 className="h-4.5 w-4.5" aria-hidden="true" />}
              </button>
              <label className="sr-only" htmlFor="music-volume">
                Volume
              </label>
              <input
                id="music-volume"
                className="range-rose w-full"
                type="range"
                min={0}
                max={100}
                value={Math.round((isMuted ? 0 : volume) * 100)}
                onChange={(event) => {
                  setVolume(Number(event.target.value) / 100);
                  setIsMuted(false);
                }}
                style={{ "--fill": `${(isMuted ? 0 : volume) * 100}%` } as CSSProperties}
              />
            </div>

            {activeBroken && (
              <p className="mt-4 rounded-2xl border border-blush-pink/60 bg-warm-white/70 px-4 py-2.5 text-center text-xs text-muted">
                This song&apos;s audio file isn&apos;t added yet — drop <span className="font-semibold text-soft-brown">{track.filename}</span> into{" "}
                <span className="font-semibold text-soft-brown">public/music/</span>
              </p>
            )}

            <div className="mt-6 border-t border-blush-pink/50 pt-4">
              <p className="mb-2 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-soft-brown">Playlist</p>
              <ul className="divide-y divide-blush-pink/40">
                {MUSIC_TRACKS.map((item, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => (isActive ? togglePlay() : changeTrack(index, true))}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                          isActive ? "bg-blush-pink/35" : "hover:bg-blush-pink/20"
                        )}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <span
                          className={cn(
                            "grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold",
                            isActive ? "bg-strawberry-red text-warm-white" : "bg-warm-white text-soft-brown border border-blush-pink/70"
                          )}
                        >
                          {isActive && isPlaying && !prefersReducedMotion ? (
                            <span className="inline-flex items-end gap-[2px]" aria-hidden="true">
                              {[0.8, 1.05, 0.65].map((speed, barIndex) => (
                                <motion.span
                                  key={speed}
                                  className="w-[2.5px] rounded-full bg-warm-white"
                                  animate={{ scaleY: [0.35, 1, 0.35] }}
                                  transition={{ duration: speed, repeat: Infinity, ease: "easeInOut", delay: barIndex * 0.14 }}
                                  style={{ height: "0.7rem", originY: 1 }}
                                />
                              ))}
                            </span>
                          ) : (
                            String(index + 1).padStart(2, "0")
                          )}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-soft-brown">{item.title}</span>
                          <span className="block truncate text-xs text-muted">{item.artist}</span>
                        </span>
                        {brokenTracks.includes(item.id) && <Music2 className="h-3.5 w-3.5 shrink-0 text-muted/70" aria-label="Audio file not added yet" />}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted">Music plays as you keep scrolling through our story.</p>
      </Container>
    </section>
  );
}
