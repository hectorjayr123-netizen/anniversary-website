// One-off asset prep for the labyrinth game.
// 1) Remove the baked-in checkerboard from the maze JPEG -> transparent PNG
// 2) Gridify the maze walls (pink neon = wall), verify start->center solvability via BFS
// 3) Punch open any blocking ring (erases to transparent so it reads as an open gate)
// 4) Emit the final wall grid as an embeddable string for the React component
import sharp from "sharp";

const SRC = "C:/Users/Bartido Fam/Downloads/image.png_2K_20260921075155.jpeg";
const OUT_PNG = "public/images/game/labyrinth.png";
const N = 64; // grid resolution (N x N over the full square image)

const isChecker = (data, i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  if (a === 0) return true;
  const spread = Math.max(r, g, b) - Math.min(r, g, b);
  const v = (r + g + b) / 3;
  const pinkness = r - (g + b) / 2;
  // neutral grays (checkerboard) of any brightness + dark tinted smoke — the neon tubes stay
  return spread <= 14 || (v < 150 && pinkness < 60);
};
const isWall = (data, i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
  if (a < 40) return false; // transparent = open corridor
  return r > 120 && r - (g + b) / 2 > 22; // pink / neon / rose tones
};

(async () => {
  // --- pass 1: de-checkerboard ---
  const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, C = info.channels;
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
  for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);
  const mask = new Uint8Array(W * H);
  const flood = () => {
    while (stack.length) {
      const y = stack.pop(), x = stack.pop();
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const p = y * W + x;
      if (mask[p] || !isChecker(data, p * C)) continue;
      mask[p] = 1;
      data[p * C + 3] = 0;
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
  };
  flood();
  // interior checker components >= 400px (like the finale treatment)
  const comp = new Int32Array(W * H).fill(-1);
  const sizes = [];
  let compId = 0;
  for (let p = 0; p < W * H; p++) {
    if (mask[p] || comp[p] !== -1 || !isChecker(data, p * C)) continue;
    let size = 0;
    stack.push(p % W, Math.floor(p / W));
    comp[p] = compId;
    while (stack.length) {
      const y = stack.pop(), x = stack.pop();
      size++;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const np = ny * W + nx;
        if (comp[np] !== -1 || !isChecker(data, np * C)) continue;
        comp[np] = compId;
        stack.push(nx, ny);
      }
    }
    sizes[compId] = size;
    compId++;
  }
  for (let p = 0; p < W * H; p++) {
    if (!mask[p] && comp[p] !== -1 && sizes[comp[p]] >= 400) { mask[p] = 1; data[p * C + 3] = 0; }
  }
  console.log("checkerboard removed");

  const savePng = async (buffer) => {
    const trimmed = await sharp(buffer, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
    await sharp(trimmed).png({ compressionLevel: 9 }).toFile(OUT_PNG + ".tmp.png");
  };

  // --- grid helpers over the current alpha data ---
  const buildGrid = () => {
    const grid = new Uint8Array(N * N); // 1 = wall
    const S = W / N;
    for (let cy = 0; cy < N; cy++) {
      for (let cx = 0; cx < N; cx++) {
        let hits = 0, total = 0;
        for (const [ox, oy] of [[0, 0], [-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]]) {
          const px = Math.min(W - 1, Math.max(0, Math.round((cx + 0.5 + ox) * S)));
          const py = Math.min(H - 1, Math.max(0, Math.round((cy + 0.5 + oy) * S)));
          total++;
          if (isWall(data, (py * W + px) * C)) hits++;
        }
        grid[cy * N + cx] = hits >= 2 ? 1 : 0;
      }
    }
    return grid;
  };

  const bfs = (grid, start, goalTest) => {
    const prev = new Int32Array(N * N).fill(-1);
    const seen = new Uint8Array(N * N);
    const q = [start];
    seen[start] = 1;
    let found = -1;
    while (q.length) {
      const p = q.shift();
      if (goalTest(p)) { found = p; break; }
      const x = p % N, y = Math.floor(p / N);
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
        const np = ny * N + nx;
        if (seen[np] || grid[np]) continue;
        seen[np] = 1; prev[np] = p; q.push(np);
      }
    }
    if (found === -1) return null;
    const path = [];
    for (let p = found; p !== -1; p = prev[p]) path.push(p);
    return path.reverse();
  };

  let grid = buildGrid();
  // playable disc: everything outside the outer ring radius is off-limits
  let discR = 0;
  for (let cy = 0; cy < N; cy++) for (let cx = 0; cx < N; cx++) {
    if (grid[cy * N + cx]) {
      const d = Math.hypot(cx + 0.5 - N / 2, cy + 0.5 - N / 2);
      if (d > discR) discR = d;
    }
  }
  console.log("disc radius (cells):", discR.toFixed(1));
  for (let p = 0; p < N * N; p++) {
    const x = p % N, y = Math.floor(p / N);
    if (Math.hypot(x + 0.5 - N / 2, y + 0.5 - N / 2) > discR + 1) grid[p] = 1;
  }

  const centerFree = (p) => Math.hypot((p % N) + 0.5 - N / 2, (Math.floor(p / N) + 0.5) - N / 2) <= 3;
  const entryCells = [];
  for (let x = 0; x < N; x++) for (let y = 0; y < 6; y++) if (!grid[y * N + x]) entryCells.push(y * N + x);

  let solution = null;
  for (const e of entryCells) {
    const s = bfs(grid, e, centerFree);
    if (s && (!solution || s.length > solution.length)) solution = s;
  }
  console.log("initial solvable:", Boolean(solution), solution ? "path len " + solution.length : "");

  // --- punch blocking rings until solvable ---
  let punches = 0;
  while (!solution && punches < 4) {
    // closest reachable cell to center
    let best = -1, bestD = 1e9;
    const seen = new Uint8Array(N * N);
    for (const e of entryCells) {
      const q = [e]; seen[e] = 1;
      while (q.length) {
        const p = q.shift();
        const d = Math.hypot((p % N) + 0.5 - N / 2, (Math.floor(p / N) + 0.5) - N / 2);
        if (d < bestD) { bestD = d; best = p; }
        const x = p % N, y = Math.floor(p / N);
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= N || ny >= N) continue;
          const np = ny * N + nx;
          if (!seen[np] && !grid[np]) { seen[np] = 1; q.push(np); }
        }
      }
    }
    const bx = best % N, by = Math.floor(best / N);
    const tx = N / 2, ty = N / 2;
    const steps = 40;
    for (let s = 0; s <= steps; s++) {
      const cx = (bx + 0.5) + ((tx) - (bx + 0.5)) * (s / steps);
      const cy = (by + 0.5) + ((ty) - (by + 0.5)) * (s / steps);
      const px = Math.round(cx * (W / N)), py = Math.round(cy * (H / N));
      for (let dy = -26; dy <= 26; dy++) for (let dx = -26; dx <= 26; dx++) {
        if (dx * dx + dy * dy > 26 * 26) continue;
        const X = px + dx, Y = py + dy;
        if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
        data[(Y * W + X) * C + 3] = 0;
      }
    }
    punches++;
    console.log(`punched ${punches} from cell (${bx},${by}) dist ${bestD.toFixed(1)}`);
    grid = buildGrid();
    for (let p = 0; p < N * N; p++) {
      const x = p % N, y = Math.floor(p / N);
      if (Math.hypot(x + 0.5 - N / 2, y + 0.5 - N / 2) > discR + 1) grid[p] = 1;
    }
    for (const e of entryCells) {
      const s = bfs(grid, e, centerFree);
      if (s && (!solution || s.length > solution.length)) solution = s;
    }
    console.log("solvable now:", Boolean(solution));
  }

  await savePng(data);
  const fs = await import("node:fs");
  fs.renameSync(OUT_PNG + ".tmp.png", OUT_PNG);
  const finalMeta = await sharp(OUT_PNG).metadata();
  console.log("saved", OUT_PNG, finalMeta.width + "x" + finalMeta.height);

  // --- emit grid for the component ---
  let gridStr = "";
  for (let cy = 0; cy < N; cy++) for (let cx = 0; cx < N; cx++) gridStr += grid[cy * N + cx] ? "1" : "0";
  // entry = walkable top cell closest to the solution start
  let entry = entryCells[0];
  if (solution) entry = solution[0];
  console.log("ENTRY_CELL", entry, "= (", entry % N, ",", Math.floor(entry / N), ")");
  console.log("SOLUTION_LEN", solution ? solution.length : 0);
  fs.writeFileSync("scripts/labyrinth-grid.txt", gridStr);
  console.log("grid chars:", gridStr.length, "walls:", (gridStr.match(/1/g) || []).length);
})();
