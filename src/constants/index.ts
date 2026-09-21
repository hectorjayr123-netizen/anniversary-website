export const ANNIVERSARY_DATA = {
  partnerName: "Marilou Blen Canlom",
  occasion: "2nd Anniversary",
  date: "September 28, 2026",
  yearsTogether: 2,
};

export const SECTIONS = [
  "opening",
  "hero",
  "memories-3d",
  "camera-gallery",
  "music",
  "love-letter",
  "timeline",
  "finale",
] as const;

export type SectionId = typeof SECTIONS[number];

export const COLORS = {
  warmWhite: "#fefefe",
  cream: "#fdf8f3",
  creamLight: "#fefaf6",
  creamDark: "#f5ebe0",
  blushPink: "#f4c6c6",
  blushPinkLight: "#f8dada",
  blushPinkDark: "#e8b4b4",
  rosePink: "#e8a8b8",
  rosePinkLight: "#f0c0cb",
  rosePinkDark: "#d490a0",
  strawberryRed: "#c73e4d",
  strawberryRedLight: "#d65a67",
  strawberryRedDark: "#a8323f",
  softBrown: "#c4a994",
  softBrownLight: "#d4bcae",
  softBrownDark: "#b09580",
  gold: "#d4af37",
  goldLight: "#e8c85a",
  goldDark: "#b8962e",
  textPrimary: "#4a4038",
  textSecondary: "#7a6d63",
  textMuted: "#a89d93",
  borderSoft: "#e8dccf",
  borderMedium: "#d4c4b0",
  shadowSoft: "rgba(196, 169, 148, 0.15)",
  shadowMedium: "rgba(196, 169, 148, 0.25)",
  overlay: "rgba(255, 250, 245, 0.9)",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const Z_INDICES = {
  base: 0,
  content: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
  cursor: 60,
} as const;