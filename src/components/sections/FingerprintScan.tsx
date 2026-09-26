import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Fingerprint, Check, Loader2, Heart, Sparkles } from "lucide-react";
import { cn } from "@utils/cn";

const CERTIFICATE_IMAGE = "/images/marriage-certificate.png";

export function FingerprintScan() {
  const [stage, setStage] = useState<"idle" | "scanning" | "success" | "certificate">("idle");
  const [progress, setProgress] = useState(0);
  const holdTimer = useRef<number | null>(null);
  const progressTimer = useRef<number | null>(null);
  const [holdTime, setHoldTime] = useState(0);

  const startScan = () => {
    if (stage !== "idle") return;
    setStage("scanning");
    setProgress(0);
    setHoldTime(0);

    holdTimer.current = window.setTimeout(() => {
      setStage("success");
      setTimeout(() => {
        setStage("certificate");
      }, 600);
    }, 2000);

    progressTimer.current = window.setInterval(() => {
      setHoldTime((prev) => prev + 50);
      setProgress((prev) => Math.min(prev + 2.5, 100));
    }, 50);
  };

  const cancelScan = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    if (progressTimer.current) window.clearInterval(progressTimer.current);
    setStage("idle");
    setProgress(0);
    setHoldTime(0);
  };

  const resetFlow = () => {
    cancelScan();
    setStage("idle");
  };

  useEffect(() => {
    return () => {
      if (holdTimer.current) window.clearTimeout(holdTimer.current);
      if (progressTimer.current) window.clearInterval(progressTimer.current);
    };
  }, []);

  return (
    <section className="relative py-20 sm:py-28" aria-labelledby="fingerprint-title">
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(246,216,219,0.3), transparent 70%)" }}
      />

      <div className="relative max-w-2xl mx-auto px-4">
        {stage === "idle" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blush-pink/20 mb-6"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Fingerprint className="w-10 h-10 text-rose-pink" aria-hidden="true" />
            </motion.div>

            <h2 id="fingerprint-title" className="font-script text-3xl sm:text-4xl text-rose-pink mb-3">
              Place your finger
            </h2>
            <p className="text-muted text-base sm:text-lg max-w-md mx-auto">
              Press and hold the button below to scan your fingerprint
            </p>

            <motion.button
              onMouseDown={startScan}
              onTouchStart={startScan}
              onMouseUp={cancelScan}
              onMouseLeave={cancelScan}
              onTouchEnd={cancelScan}
              onTouchCancel={cancelScan}
              className="mt-10 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-pink to-strawberry-red text-warm-white font-semibold text-lg shadow-[0_10px_30px_-10px_rgba(189,70,88,0.5)] transition-all"
              whileTap={{ scale: 0.96 }}
              style={{ minWidth: "280px" }}
            >
              <Fingerprint className="w-6 h-6" aria-hidden="true" />
              <span>Scan Fingerprint</span>
            </motion.button>

            <p className="mt-6 text-sm text-muted/70">
              Hold for 2 seconds to verify
            </p>
          </motion.div>
        )}

        {stage === "scanning" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f6d8db"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#bd4658"
                  strokeWidth="8"
                  strokeDasharray={283}
                  strokeDashoffset={283 * (1 - progress / 100)}
                  strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 8px rgba(189,70,88,0.6))" }}
                  animate={{ strokeDashoffset: 283 * (1 - progress / 100) }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </svg>

              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
              >
                <Fingerprint className="w-20 h-20 text-rose-pink/60" aria-hidden="true" />
              </motion.div>
            </div>

            <h3 className="font-script text-2xl sm:text-3xl text-rose-pink mb-2">
              Scanning...
            </h3>
            <motion.div
              className="w-48 h-2 mx-auto rounded-full bg-blush-pink/30 overflow-hidden"
              style={{ boxShadow: "inset 0 1px 4px rgba(0,0,0,0.1)" }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-rose-pink to-strawberry-red rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </motion.div>
            <p className="mt-3 text-sm text-muted font-mono tabular-nums">
              {Math.floor(progress)}% complete
            </p>
            <p className="mt-4 text-xs text-muted/70">
              Keep holding...
            </p>
          </motion.div>
        )}

        {stage === "success" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 15 }}
          >
            <motion.div
              className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6"
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 15 }}
            >
              <Check className="w-12 h-12 text-green-600" aria-hidden="true" />
            </motion.div>

            <h3 className="font-script text-2xl sm:text-3xl text-green-600 mb-2">
              Verified!
            </h3>
            <p className="text-muted">
              Welcome, Marilou
            </p>
          </motion.div>
        )}

        {stage === "certificate" && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-amber-100/30 rounded-2xl blur-xl" />
              <div className="relative rounded-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden border border-gold/40">
                <img
                  src={CERTIFICATE_IMAGE}
                  alt="Marriage Certificate"
                  className="w-full max-w-md mx-auto block"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextElementSibling?.classList.remove("hidden");
                  }}
                />
                <div className="hidden relative min-h-[400px] max-w-md mx-auto flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 p-8">
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-gold mx-auto mb-4" aria-hidden="true" />
                    <p className="font-script text-3xl text-amber-700 mb-2">Marriage Certificate</p>
                    <p className="text-amber-600">Marilou & Bartido</p>
                    <p className="text-sm text-amber-500 mt-2">September 28, 2024</p>
                    <p className="text-xs text-amber-400 mt-4">Forever united in love</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <motion.button
                onClick={resetFlow}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-warm-white border border-blush-pink/40 text-soft-brown font-semibold shadow-soft hover:bg-blush-pink/30 transition-all"
                whileTap={{ scale: 0.96 }}
              >
                <Sparkles className="w-5 h-5 text-rose-pink" aria-hidden="true" />
                <span>Scan Again</span>
              </motion.button>

              <p className="text-sm text-muted/70 text-center sm:text-left">
                Your secret memory unlocked
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  );
}