import { useState } from "react";
import { motion } from "framer-motion";
import { Button, Container } from "@ui";
import { Flower2, Heart, Lock, Unlock, Sparkles, Calendar } from "lucide-react";
import { cn } from "@utils/cn";

interface AuthGateProps {
  onSuccess: () => void;
}

const QUESTIONS = [
  {
    id: "anniversary",
    label: "Anniversary Date?",
    answer: "2024-09-28",
    type: "date" as const,
    icon: Calendar,
  },
  {
    id: "birthdate",
    label: "Your Birthdate?",
    answer: "2007-01-01",
    type: "date" as const,
    icon: Calendar,
  },
  {
    id: "fruit",
    label: "Favorite Fruit?",
    answer: "strawberry",
    type: "text" as const,
    icon: Sparkles,
  },
] as const;

function normalizeAnswer(input: string) {
  return input.trim().toLowerCase();
}

function formatDateForDisplay(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function AuthGate({ onSuccess }: AuthGateProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) setErrors((prev) => ({ ...prev, [id]: false }));
  };

  const validate = () => {
    const newErrors: Record<string, boolean> = {};
    let allCorrect = true;

    QUESTIONS.forEach((q) => {
      const userAnswer = normalizeAnswer(answers[q.id] || "");
      const correctAnswer = normalizeAnswer(q.answer);
      const isCorrect = userAnswer === correctAnswer;
      if (!isCorrect) {
        newErrors[q.id] = true;
        allCorrect = false;
      }
    });

    setErrors(newErrors);
    return allCorrect;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 800);
      }, 500);
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-cream p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-background)_0%,var(--color-cream)_100%)]" />

      <Container size="sm" className="relative z-10 w-full max-w-md">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blush-pink/20 mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          >
            <Lock className="w-8 h-8 text-rose-pink" aria-hidden="true" />
          </motion.div>

          <h1 id="auth-title" className="font-script text-3xl sm:text-4xl text-rose-pink mb-2">
            Private Memory
          </h1>
          <p className="text-muted text-sm sm:text-base">
            Answer three questions to unlock your gift
          </p>
        </motion.div>

        <motion.form
          className="mt-8 space-y-5"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          {QUESTIONS.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.25 + index * 0.1 }}
            >
              <label htmlFor={q.id} className="block text-left text-sm font-medium text-soft-brown mb-2 flex items-center gap-2">
                <q.icon className="w-4 h-4 text-rose-pink" aria-hidden="true" />
                {q.label}
              </label>
              {q.type === "date" ? (
                <input
                  id={q.id}
                  type="date"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-warm-white/80 text-foreground transition-all",
                    errors[q.id]
                      ? "border-rose-pink/60 focus:border-rose-pink focus:ring-rose-pink/20 bg-rose-pink/5"
                      : "border-blush-pink/40 focus:border-rose-pink focus:ring-rose-pink/20",
                    "focus:outline-none focus:ring-2"
                  )}
                  autoComplete="off"
                  disabled={isSubmitting || showSuccess}
                  aria-invalid={errors[q.id] ? "true" : "false"}
                  aria-describedby={errors[q.id] ? `${q.id}-error` : undefined}
                  max={new Date().toISOString().split("T")[0]}
                />
              ) : (
                <input
                  id={q.id}
                  type="text"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleChange(q.id, e.target.value)}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-warm-white/80 text-foreground transition-all",
                    errors[q.id]
                      ? "border-rose-pink/60 focus:border-rose-pink focus:ring-rose-pink/20 bg-rose-pink/5"
                      : "border-blush-pink/40 focus:border-rose-pink focus:ring-rose-pink/20",
                    "focus:outline-none focus:ring-2"
                  )}
                  autoComplete="off"
                  autoCapitalize="words"
                  disabled={isSubmitting || showSuccess}
                  aria-invalid={errors[q.id] ? "true" : "false"}
                  aria-describedby={errors[q.id] ? `${q.id}-error` : undefined}
                />
              )}
              {errors[q.id] && (
                <motion.p
                  id={`${q.id}-error`}
                  className="mt-1.5 text-sm text-rose-pink flex items-center gap-1"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
                  Incorrect answer, try again
                </motion.p>
              )}
            </motion.div>
          ))}

          <motion.button
            type="submit"
            disabled={isSubmitting || showSuccess}
            className={cn(
              "w-full py-3.5 px-6 rounded-xl font-semibold text-warm-white shadow-[0_10px_25px_-5px_rgba(189,70,88,0.5)] transition-all",
              "focus:outline-none focus:ring-2 focus:ring-rose-pink/40 focus:ring-offset-2 focus:ring-offset-cream",
              isSubmitting
                ? "opacity-70 cursor-wait"
                : "hover:-translate-y-0.5 hover:shadow-[0_15px_30px_-5px_rgba(189,70,88,0.6)]",
              showSuccess ? "bg-gold cursor-default" : "bg-gradient-to-r from-rose-pink to-strawberry-red"
            )}
            style={{ background: showSuccess ? "linear-gradient(135deg, #d4a843, #c99636)" : undefined }}
            whileTap={!isSubmitting && !showSuccess ? { scale: 0.98 } : undefined}
          >
            {isSubmitting && !showSuccess ? (
              <>
                <motion.span className="inline-flex items-center gap-2">
                  <motion.span
                    className="w-5 h-5 border-2 border-warm-white/30 border-t-warm-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Verifying...
                </motion.span>
              </>
            ) : showSuccess ? (
              <>
                <Unlock className="inline w-5 h-5 mr-2" aria-hidden="true" />
                Unlocked!
              </>
            ) : (
              <>
                <Lock className="inline w-5 h-5 mr-2" aria-hidden="true" />
                Unlock Memory
              </>
            )}
          </motion.button>
        </motion.form>

        <motion.p
          className="mt-6 text-xs text-muted/70 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Answers are case-insensitive. This memory is for Marilou only.
        </motion.p>
      </Container>
    </motion.div>
  );
}