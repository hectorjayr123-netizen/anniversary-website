// Aligns the game's wall grid with the hand-drawn guide path:
// 1) extracts blue guide pixels from the guide image -> grid cells
// 2) reports which guide cells the current grid treats as walls
// 3) force-opens those cells (only where the maze image isn't a real neon tube)
// 4) re-verifies start->center solvability and emits the updated grid
import sharp from "sharp";

const GUIDE = "C:/Users/Bartido Fam/Downloads/Labyrinth Guide Path.jpeg";
const LAB = "public/images/game/labyrinth.png";
const OUT = "scripts/labyrinth-grid.txt";
const N = 64;

(async () => {
  const guide = await sharp(GUIDE).resize(N * 8, N * 8, { fit: "fill" }).raw().toBuffer({ resolveWithObject: true });
  const lab = await sharp(LAB).raw().toBuffer({ resolveWithObject: true });

  // guide cells (blue marker: blue dominant over red)
  const guideCells = new Set();
  for (let y = 0; y < N * 8; y++) for (let x = 0; x < N * 8; x++) {
    const i = (y * N * 8 + x) * guide.info.channels;
    const r = guide.data[i], g = guide.data[i + 1], b = guide.data[i + 2];
    if (b > 120 && b - r > 50 && b - g > 30) guideCells.add(Math.floor(y / 8) * N + Math.floor(x / 8));
  }
  console.log("guide cells:", guideCells.size);

  const gridStr = (await import("node:fs")).readFileSync(OUT, "utf8").trim();
  const grid = [...gridStr].map(c => (c === "1" ? 1 : 0));

  // which guide cells are walls right now?
  const blocked = [];
  for (const p of guideCells) if (grid[p]) blocked.push(p);
  console.log("guide cells currently marked wall:", blocked.length);

  // safety: only open a blocked cell if the real maze image isn't a strong neon tube there
  const { data, info } = lab;
  const C = info.channels;
  const realTube = (cx, cy) => {
    let strong = 0, total = 0;
    for (const [ox, oy] of [[0, 0], [-0.28, -0.28], [0.28, -0.28], [-0.28, 0.28], [0.28, 0.28]]) {
      const px = Math.min(info.width - 1, Math.max(0, Math.round((cx + 0.5 + ox) * (info.width / N))));
      const py = Math.min(info.height - 1, Math.max(0, Math.round((cy + 0.5 + oy) * (info.height / N))));
      const i = (py * info.width + px) * C;
      const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
      total++;
      if (a > 120 && r > 150 && r - (g + b) / 2 > 45) strong++;
    }
    return strong >= 3;
  };
  let opened = 0, skippedTubes = 0;
  for (const p of blocked) {
    const cx = p % N, cy = Math.floor(p / N);
    if (realTube(cx, cy)) { skippedTubes++; continue; }
    grid[p] = 0;
    opened++;
  }
  console.log("opened:", opened, "skipped (real tubes):", skippedTubes);
  if (skippedTubes > 0) {
    console.log("tube cells:", blocked.filter(p => realTube(p % N, Math.floor(p / N))).map(p => `(${p % N},${Math.floor(p / N)})`).join(" "));
  }

  // verify solvability from entry to center
  const isW = (x, y) => x < 0 || y < 0 || x >= N || y >= N || grid[y * N + x] === 1;
  const start = { x: 25, y: 3 };
  const prev = new Map();
  const q = [start];
  const seen = new Set(["25,3"]);
  let goal = null;
  while (q.length && !goal) {
    const p = q.shift();
    if (Math.hypot(p.x + 0.5 - N / 2, p.y + 0.5 - N / 2) <= 3) { goal = p; break; }
    for (const [nx, ny] of [[p.x + 1, p.y], [p.x - 1, p.y], [p.x, p.y + 1], [p.x, p.y - 1]]) {
      if (isW(nx, ny)) continue;
      const k = `${nx},${ny}`;
      if (seen.has(k)) continue;
      seen.add(k); prev.set(k, p); q.push({ x: nx, y: ny });
    }
  }
  console.log("solvable after opening:", Boolean(goal));

  // does the guide path itself connect start to center now?
  let guideGoal = false;
  for (const p of guideCells) {
    if (Math.hypot((p % N) + 0.5 - N / 2, (Math.floor(p / N) + 0.5) - N / 2) <= 3) { guideGoal = true; break; }
  }
  console.log("guide reaches center region:", guideGoal);

  const out = grid.map(b => String(b)).join("");
  (await import("node:fs")).writeFileSync(OUT, out);
  console.log("grid updated ->", OUT);
})();
