// Extracts individual sticker PNGs from the provided design sheets.
// 1) Flower sticker set (lavender bg)  -> flower-1..9.png (9 stickers)
// 2) Flower/leaf pattern sheet (pink)  -> flower-10..12.png (largest full stickers)
// 3) Strawberry (white bg + shadow)    -> strawberry.png (edge flood-fill cutout)
import sharp from "sharp";

const OUT = "public/images/decor";

(async () => {
  const fs = await import("node:fs");
  fs.mkdirSync(OUT, { recursive: true });

  const components = ({ file, label, minArea, maxCount, pad = 3 }) =>
    (async () => {
      const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height, C = info.channels;
      // background = color near the corners
      const corners = [[2, 2], [W - 3, 2], [2, H - 3], [W - 3, H - 3]].map(([x, y]) => {
        const i = (y * W + x) * C;
        return [data[i], data[i + 1], data[i + 2]];
      });
      const isBg = (i) => {
        const r = data[i], g = data[i + 1], b = data[i + 2];
        return corners.some(([cr, cg, cb]) => Math.abs(r - cr) + Math.abs(g - cg) + Math.abs(b - cb) < 90);
      };
      const comp = new Int32Array(W * H).fill(-1);
      const boxes = [];
      let id = 0;
      for (let p = 0; p < W * H; p++) {
        if (comp[p] !== -1 || isBg(p * C)) continue;
        let size = 0;
        let minX = W, minY = H, maxX = 0, maxY = 0, touchesEdge = false;
        const stack = [p];
        comp[p] = id;
        while (stack.length) {
          const cur = stack.pop();
          const x = cur % W, y = Math.floor(cur / W);
          size++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          if (x === 0 || y === 0 || x === W - 1 || y === H - 1) touchesEdge = true;
          for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
            if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
            const np = ny * W + nx;
            if (comp[np] !== -1 || isBg(np * C)) continue;
            comp[np] = id;
            stack.push(np);
          }
        }
        boxes.push({ id, size, minX, minY, maxX, maxY, touchesEdge });
        id++;
      }
      const keep = boxes
        .filter(b => !b.touchesEdge && b.size >= minArea)
        .sort((a, b) => b.size - a.size)
        .slice(0, maxCount);
      console.log(`${label}: ${boxes.length} components, keeping ${keep.length}`);
      let index = 0;
      for (const b of keep) {
        index++;
        const cw = b.maxX - b.minX + 1 + pad * 2;
        const ch = b.maxY - b.minY + 1 + pad * 2;
        const out = Buffer.alloc(cw * ch * 4, 0);
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
          const sx = b.minX - pad + x, sy = b.minY - pad + y;
          if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
          const si = (sy * W + sx) * C;
          const di = (y * cw + x) * 4;
          if (comp[sy * W + sx] !== b.id) continue;
          out[di] = data[si]; out[di + 1] = data[si + 1]; out[di + 2] = data[si + 2]; out[di + 3] = 255;
        }
        const outPath = `${OUT}/${label}-${index}.png`;
        const trimmed = await sharp(out, { raw: { width: cw, height: ch, channels: 4 } }).png().toBuffer();
        await sharp(trimmed).trim({ threshold: 8 }).resize({ height: 380, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(outPath + ".tmp.png");
        fs.renameSync(outPath + ".tmp.png", outPath);
        const m = await sharp(outPath).metadata();
        console.log(`  ${outPath} ${m.width}x${m.height}`);
      }
    })();

  await components({
    file: "C:/Users/Bartido Fam/.zcode/cli/image-cache/sess_ada0c215-005d-4b7b-a94d-073f4155ac93/image-abc0189a500a5a4aa8d7e61dbd148552.png",
    label: "flower", minArea: 900, maxCount: 9,
  });
  await components({
    file: "C:/Users/Bartido Fam/.zcode/cli/image-cache/sess_ada0c215-005d-4b7b-a94d-073f4155ac93/image-9427d201dd71d7b3b302f57141e55fa3.png",
    label: "bloom", minArea: 2200, maxCount: 4,
  });

  // strawberry: white bg + soft shadow -> flood fill from edges
  {
    const file = "C:/Users/Bartido Fam/.zcode/cli/image-cache/sess_ada0c215-005d-4b7b-a94d-073f4155ac93/image-388cdd631af2d85d08eba8a320ab9997.png";
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, C = info.channels;
    const isBgLike = (i) => {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      const v = (r + g + b) / 3;
      return spread <= 20 && v >= 160; // white background + gray shadow
    };
    const stack = [];
    for (let x = 0; x < W; x++) stack.push(x, 0, x, H - 1);
    for (let y = 0; y < H; y++) stack.push(0, y, W - 1, y);
    while (stack.length) {
      const y = stack.pop(), x = stack.pop();
      if (x < 0 || y < 0 || x >= W || y >= H) continue;
      const p = y * W + x, i = p * C;
      if (data[i + 3] === 0 || !isBgLike(i)) continue;
      data[i + 3] = 0;
      stack.push(x + 1, y, x - 1, y, x, y + 1, x, y - 1);
    }
    const buf = await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
    const trimmed = await sharp(buf).trim({ threshold: 10 }).png().toBuffer();
    await sharp(trimmed).resize({ height: 420, withoutEnlargement: true }).png({ compressionLevel: 9 }).toFile(`${OUT}/strawberry.png.tmp.png`);
    fs.renameSync(`${OUT}/strawberry.png.tmp.png`, `${OUT}/strawberry.png`);
    const m = await sharp(`${OUT}/strawberry.png`).metadata();
    console.log(`strawberry.png ${m.width}x${m.height}`);
  }
})();
