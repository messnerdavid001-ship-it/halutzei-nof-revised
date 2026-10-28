// Builds responsive WebP + JPG variants of every photo in public/photos
// and writes src/generated/images.json (used by the <Pic> component).
// Runs automatically before `dev` and `build`. Add a photo = drop it in public/photos.
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'public/photos';
const OUT = path.join(SRC, 'opt');
const WIDTHS = [480, 800, 1280, 1920];
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync('src/generated', { recursive: true });

const manifest = {};
for (const file of fs.readdirSync(SRC)) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
  const name = path.basename(file, ext);
  const input = path.join(SRC, file);
  const meta = await sharp(input).metadata();
  const isLogo = name.startsWith('logo');
  const widths = WIDTHS.filter((w) => w < meta.width);
  widths.push(meta.width);
  const stat = fs.statSync(input).mtimeMs;
  for (const w of widths) {
    const base = path.join(OUT, `${name}-${w}`);
    const upToDate = (p) => fs.existsSync(p) && fs.statSync(p).mtimeMs >= stat;
    const img = () => sharp(input).resize({ width: w, withoutEnlargement: true });
    if (!upToDate(base + '.webp')) await img().webp({ quality: 78 }).toFile(base + '.webp');
    if (isLogo) {
      if (!upToDate(base + '.png')) await img().png({ compressionLevel: 9 }).toFile(base + '.png');
    } else if (!upToDate(base + '.jpg')) {
      await img().jpeg({ quality: 80, mozjpeg: true }).toFile(base + '.jpg');
    }
  }
  manifest[name] = { width: meta.width, height: meta.height, widths, fallback: isLogo ? 'png' : 'jpg' };
}
fs.writeFileSync('src/generated/images.json', JSON.stringify(manifest, null, 2));

// favicons from the logo (star + mountains, square crop)
const fav = async (size, out) =>
  sharp('public/photos/logo.png')
    .extract({ left: 20, top: 10, width: 790, height: 255 })
    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .png().toFile(out);
await fav(32, 'public/favicon-32.png');
await fav(180, 'public/apple-touch-icon.png');
console.log('images optimized:', Object.keys(manifest).join(', '));
