export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  filename: string;
  file: string;
  duration?: number;
  artwork?: string;
}

// Audio files are provided by the user and live in public/music/.
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: "born-for-you",
    title: "Born For You",
    artist: "David Pomeranz",
    filename: "born-for-you.mp3",
    file: "/music/born-for-you.mp3",
    artwork: "/images/music/born-for-you.jpg",
  },
  {
    id: "photograph",
    title: "Photograph",
    artist: "Ed Sheeran",
    filename: "photograph.mp3",
    file: "/music/photograph.mp3",
    artwork: "/images/music/photograph.jpg",
  },
  {
    id: "love-will-keep-us-alive",
    title: "Love Will Keep Us Alive",
    artist: "Eagles",
    filename: "love-will-keep-us-alive.mp3",
    file: "/music/love-will-keep-us-alive.mp3",
    artwork: "/images/music/love-will-keep-us-alive.jpg",
  },
  {
    id: "18",
    title: "18",
    artist: "One Direction",
    filename: "18.mp3",
    file: "/music/18.mp3",
    artwork: "/images/music/18.jpg",
  },
  {
    id: "simpleng-tulad-mo",
    title: "Simpleng Tulad Mo",
    artist: "Daniel Padilla",
    filename: "simpleng-tulad-mo.mp3",
    file: "/music/simpleng-tulad-mo.mp3",
    artwork: "/images/music/simpleng-tulad-mo.jpg",
  },
];