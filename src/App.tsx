import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { MUSIC_TRACKS } from "@constants/music";
import { AuthGate } from "@sections/AuthGate";
import { FingerprintScan } from "@sections/FingerprintScan";
import { FinaleSection } from "@sections/FinaleSection";
import { LabyrinthSection } from "@sections/LabyrinthSection";
import { LoveLetterSection } from "@sections/LoveLetterSection";
import { MemoryGallery } from "@sections/MemoryGallery";
import { MusicSection } from "@sections/MusicSection";
import { OpeningExperience } from "@sections/OpeningExperience";
import { OpeningReveal } from "@sections/OpeningReveal";
import { TimelineSection } from "@sections/TimelineSection";

type AppStage = "auth" | "opening" | "reveal";

function App() {
  const [stage, setStage] = useState<AppStage>("auth");
  // audio created at "Open My Gift" click time (inside the user gesture) so the
  // gift music can start immediately; the player section adopts this element.
  const gameAudio = useRef<HTMLAudioElement | null>(null);

  const handleAuthSuccess = () => {
    setStage("opening");
  };

  const handleOpenComplete = () => {
    if (!gameAudio.current) {
      const audio = new Audio(MUSIC_TRACKS[0].file);
      audio.preload = "auto";
      audio.volume = 0.8;
      audio.play().catch(() => {
        // autoplay refused — the player stays paused until she presses play
      });
      gameAudio.current = audio;
      (window as unknown as { __annivAudio?: HTMLAudioElement }).__annivAudio = audio;
    }
    setStage("reveal");
  };

  const replay = () => {
    setStage("auth");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {stage === "auth" ? (
        <AuthGate key="auth" onSuccess={handleAuthSuccess} />
      ) : stage === "opening" ? (
        <OpeningExperience key="opening" onComplete={handleOpenComplete} />
      ) : (
        <motion.main
          key="reveal"
          initial={{ opacity: 0, scale: 1.045, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.02, filter: "blur(10px)" }}
          transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <OpeningReveal />
          <MemoryGallery />
          <MusicSection externalAudio={gameAudio} />
          <LoveLetterSection />
          <TimelineSection />
          <LabyrinthSection />
          <FingerprintScan />
          <FinaleSection onReplay={replay} />
        </motion.main>
      )}
    </AnimatePresence>
  );
}

export default App;
