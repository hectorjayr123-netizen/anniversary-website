import { Button, Card, Container, Section } from "@ui";
import { useReducedMotion } from "@hooks/useReducedMotion";
import { motion } from "framer-motion";
import { Flower2, Heart, Sparkles } from "lucide-react";

const palette = [
  { name: "Warm white", swatch: "bg-warm-white text-ink border border-border" },
  { name: "Cream", swatch: "bg-cream text-ink border border-border" },
  { name: "Blush pink", swatch: "bg-blush-pink text-ink" },
  { name: "Rose pink", swatch: "bg-rose-pink text-warm-white" },
  { name: "Strawberry red", swatch: "bg-strawberry-red text-warm-white" },
  { name: "Soft brown", swatch: "bg-soft-brown text-warm-white" },
  { name: "Subtle gold", swatch: "bg-gold text-ink" },
];

const foundations = [
  { icon: Heart, title: "Shared UI", copy: "Reusable container, section, card, and button primitives." },
  { icon: Flower2, title: "Mobile first", copy: "Fluid type, responsive spacing, and clipped horizontal overflow." },
  { icon: Sparkles, title: "Motion ready", copy: "Framer Motion and reduced-motion support are ready for future phases." },
];

export function TestPage() {
  const prefersReducedMotion = useReducedMotion();
  const reveal = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <main>
      <Section fullHeight padding="spacious" className="overflow-hidden">
        <Container size="lg">
          <motion.div {...reveal} className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Phase 1 · Visual system</p>
            <h1 className="mt-5">A romantic foundation, ready for the story.</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted sm:text-lg">
              The anniversary experience has not been built yet. This page establishes the shared palette,
              typography, spacing, and component language it will use.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {foundations.map(({ icon: Icon, title, copy }, index) => (
              <motion.div
                key={title}
                {...(prefersReducedMotion
                  ? {}
                  : {
                      initial: { opacity: 0, y: 14 },
                      animate: { opacity: 1, y: 0 },
                      transition: { delay: 0.15 + index * 0.08, duration: 0.4 },
                    })}
              >
                <Card hoverable className="h-full">
                  <Icon className="h-5 w-5 text-strawberry-red" aria-hidden="true" />
                  <h2 className="mt-5 text-2xl">{title}</h2>
                  <p className="mt-3 text-sm text-muted">{copy}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container size="xl">
          <div className="max-w-2xl">
            <p className="section-kicker">Palette</p>
            <h2 className="mt-4">Soft colour, clear hierarchy.</h2>
            <p className="mt-4 text-muted">
              Warm neutrals carry the page; strawberry and gold are reserved for gentle emphasis.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {palette.map(({ name, swatch }) => (
              <div key={name} className={`min-h-32 rounded-card p-4 ${swatch}`}>
                <div className="flex h-full items-end">
                  <span className="text-sm font-semibold">{name}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="blush">
        <Container size="lg">
          <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <Card padding="lg">
              <p className="section-kicker">Typography</p>
              <h2 className="mt-4">Elegant titles. Easy reading.</h2>
              <p className="mt-5 max-w-xl text-muted">
                Display type gives each future section a soft editorial feel, while DM Sans keeps longer words
                comfortable on every screen size.
              </p>
              <p className="mt-7 font-script text-5xl text-rose-pink">With love, always.</p>
            </Card>

            <Card variant="glass" padding="lg" className="flex flex-col justify-between">
              <div>
                <p className="section-kicker">Controls</p>
                <h2 className="mt-4 text-3xl">Reusable, not repeated.</h2>
                <p className="mt-3 text-sm text-muted">Visual specimens only; no anniversary interaction is active.</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button icon={<Heart className="h-4 w-4" aria-hidden="true" />}>Primary</Button>
                <Button variant="secondary" icon={<Flower2 className="h-4 w-4" aria-hidden="true" />}>
                  Secondary
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </main>
  );
}
