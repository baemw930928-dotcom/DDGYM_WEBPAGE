// Build helper: generate WebP for trainer photos and a 1200x630 OG image.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const imgDir = path.join(root, 'img');

(async () => {
  // Trainer photos -> WebP (keep JPG as fallback)
  const trainers = fs.readdirSync(imgDir).filter(f => /^trainer-.*\.jpg$/.test(f));
  for (const f of trainers) {
    const src = path.join(imgDir, f);
    const out = path.join(imgDir, f.replace(/\.jpg$/, '.webp'));
    await sharp(src).webp({ quality: 78 }).toFile(out);
    const kb = (fs.statSync(out).size / 1024).toFixed(0);
    console.log('webp', path.basename(out), kb + 'KB');
  }

  // OG image: 2048x2048 -> 1200x630 (centered crop)
  const ogSrc = path.join(root, 'og-image.jpg');
  if (fs.existsSync(ogSrc)) {
    const buf = fs.readFileSync(ogSrc);
    await sharp(buf)
      .resize(1200, 630, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(ogSrc);
    const kb = (fs.statSync(ogSrc).size / 1024).toFixed(0);
    console.log('og-image.jpg 1200x630', kb + 'KB');
  }
})();
