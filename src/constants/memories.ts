export interface MemoryPhoto {
  id: string;
  filename: string;
  caption: string;
  alt: string;
  position?: { x: number; y: number; z: number };
  rotation?: { x: number; y: number; z: number };
}

export const MEMORY_PHOTOS: MemoryPhoto[] = [
  {
    id: "memory-01",
    filename: "memory-01.jpg",
    caption: "Memory 01",
    alt: "Memory 01",
  },
  {
    id: "memory-02",
    filename: "memory-02.jpg",
    caption: "Memory 02",
    alt: "Memory 02",
  },
  {
    id: "memory-03",
    filename: "memory-03.jpg",
    caption: "Memory 03",
    alt: "Memory 03",
  },
  {
    id: "memory-04",
    filename: "memory-04.jpg",
    caption: "Memory 04",
    alt: "Memory 04",
  },
  {
    id: "memory-05",
    filename: "memory-05.jpg",
    caption: "Memory 05",
    alt: "Memory 05",
  },
  {
    id: "memory-06",
    filename: "memory-06.jpg",
    caption: "Memory 06",
    alt: "Memory 06",
  },
  {
    id: "memory-07",
    filename: "memory-07.jpg",
    caption: "Memory 07",
    alt: "Memory 07",
  },
  {
    id: "memory-08",
    filename: "memory-08.jpg",
    caption: "Memory 08",
    alt: "Memory 08",
  },
  {
    id: "memory-09",
    filename: "memory-09.jpg",
    caption: "Memory 09",
    alt: "Memory 09",
  },
  {
    id: "memory-10",
    filename: "memory-10.jpg",
    caption: "Memory 10",
    alt: "Memory 10",
  },
  {
    id: "memory-11",
    filename: "memory-11.jpg",
    caption: "Memory 11",
    alt: "Memory 11",
  },
  {
    id: "memory-12",
    filename: "memory-12.jpg",
    caption: "Memory 12",
    alt: "Memory 12",
  },
  {
    id: "memory-13",
    filename: "memory-13.jpg",
    caption: "Memory 13",
    alt: "Memory 13",
  },
];

export interface CameraPhoto {
  id: string;
  filename: string;
  caption: string;
  alt: string;
  timestamp: string;
  cameraModel?: string;
}

export const CAMERA_PHOTOS: CameraPhoto[] = [
  {
    id: "camera-01",
    filename: "camera-01.jpg",
    caption: "Captured Moment",
    alt: "Digital camera photo 1",
    timestamp: "2024.03.15 14:22",
    cameraModel: "DSC",
  },
  {
    id: "camera-02",
    filename: "camera-02.jpg",
    caption: "Golden Hour",
    alt: "Digital camera photo 2",
    timestamp: "2024.06.22 18:45",
    cameraModel: "DSC",
  },
  {
    id: "camera-03",
    filename: "camera-03.jpg",
    caption: "Candid Smile",
    alt: "Digital camera photo 3",
    timestamp: "2024.09.10 11:03",
    cameraModel: "DSC",
  },
  {
    id: "camera-04",
    filename: "camera-04.jpg",
    caption: "Evening Walk",
    alt: "Digital camera photo 4",
    timestamp: "2024.12.01 19:17",
    cameraModel: "DSC",
  },
];
