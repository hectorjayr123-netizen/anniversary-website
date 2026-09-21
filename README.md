# Anniversary Website

## Phase 1: foundation

This phase contains only the visual system and a generic theme-preview page. No opening, hero, photo gallery, music player, letter, timeline, or finale is mounted yet.

### Stack

- React + Vite
- Tailwind CSS v4
- Framer Motion
- Three.js, React Three Fiber, and drei (installed for the later 3D phase)
- Lucide React

### Structure

```
src/
  components/
    ui/        Shared layout and control primitives
    sections/  Page sections; currently only TestPage
  hooks/       Shared behavior hooks
  utils/       Small utilities
  index.css    Palette, type, spacing, accessibility, and base styles
```

The supplied photos remain in `public/images/` but are deliberately not used in Phase 1.

### Run locally

```bash
npm install
npm run dev
```

Use the URL Vite prints in the terminal. For a production check, run `npm run build`.
