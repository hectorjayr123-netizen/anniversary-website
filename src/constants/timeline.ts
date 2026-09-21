// ============================================================
// OUR JOURNEY — chapter-by-chapter relationship story.
// Edit the chapters here. Each supports an optional photo:
// drop it in public/images/journey/ with the matching name.
// ============================================================

export interface JourneyChapter {
  id: string;
  chapter: string;
  title: string;
  story: string;
  image?: string;
  decor: "rose" | "blossom" | "heart" | "strawberry" | "anniversary";
}

export const JOURNEY_CHAPTERS: JourneyChapter[] = [
  {
    id: "first-meeting",
    chapter: "01",
    title: "First Meeting",
    story:
      "I remember our first meet got postponed many times, haha. But the first time I saw you, I couldn't stop thinking about how blessed I am to have the most gorgeous girlfriend.",
    image: "/images/journey/first-meeting.jpg",
    decor: "rose",
  },
  {
    id: "first-date",
    chapter: "02",
    title: "First Date",
    story:
      "Our first official date was you and I roaming around the \u2018Pasilong\u2019 at Naga. It was a simple date, but unforgettable.",
    image: "/images/journey/first-date.jpg",
    decor: "blossom",
  },
  {
    id: "official-beginning",
    chapter: "03",
    title: "Official Beginning",
    story:
      "Our beginning was laughable because it only took a month for me to ask you to be my girl, and now you're already my very own wife.",
    image: "/images/journey/official-beginning.jpg",
    decor: "heart",
  },
  {
    id: "special-trip",
    chapter: "04",
    title: "Special Trip",
    story:
      "Our special trip was when we went to the beach together. That moment was the first vacation trip we had, and it was very unforgettable.",
    image: "/images/journey/special-trip.jpg",
    decor: "strawberry",
  },
  {
    id: "second-anniversary",
    chapter: "05",
    title: "Our Second Anniversary",
    story:
      "Our Second Anniversary will be special. Even though we're in separate places, our love and souls will still be connected to each other.",
    image: "/images/journey/second-anniversary.jpg",
    decor: "anniversary",
  },
];

export interface TimelineConfig {
  title: string;
  subtitle: string;
}

export const TIMELINE_CONFIG: TimelineConfig = {
  title: "Our Journey",
  subtitle: "Two years of memories, laughter, and love",
};
