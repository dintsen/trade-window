import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outDir = path.join(__dirname, '../public');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Generate Logo Mark SVG (Symbol only)
const symbolOnlySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <g transform="translate(256, 256)">
    <polygon points="0,-160 138.5,-80 138.5,80 0,160 -138.5,80 -138.5,-80" fill="none" stroke="#00D084" stroke-width="48" stroke-linejoin="round" />
    <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#00D084" stroke-width="40" rx="16" transform="rotate(45)" />
  </g>
</svg>`;

// 2. Generate Favicon SVG (Symbol with background)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#050807" />
  <g transform="translate(256, 256)">
    <polygon points="0,-160 138.5,-80 138.5,80 0,160 -138.5,80 -138.5,-80" fill="none" stroke="#00D084" stroke-width="48" stroke-linejoin="round" />
    <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#00D084" stroke-width="40" rx="16" transform="rotate(45)" />
  </g>
</svg>`;

// 3. Generate Logo SVG (Symbol + Text)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 300" width="1000" height="300">
  <g transform="translate(150, 150) scale(0.6)">
    <polygon points="0,-160 138.5,-80 138.5,80 0,160 -138.5,80 -138.5,-80" fill="none" stroke="#00D084" stroke-width="48" stroke-linejoin="round" />
    <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#00D084" stroke-width="40" rx="16" transform="rotate(45)" />
  </g>
  <text x="320" y="180" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="84" font-weight="bold" fill="#ffffff" letter-spacing="-2">Trade Window</text>
</svg>`;

// 4. Generate OG Image SVG
const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050807" />
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#00D084" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#050807" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  <g transform="translate(600, 200) scale(0.6)">
    <polygon points="0,-160 138.5,-80 138.5,80 0,160 -138.5,80 -138.5,-80" fill="none" stroke="#00D084" stroke-width="48" stroke-linejoin="round" />
    <rect x="-60" y="-60" width="120" height="120" fill="none" stroke="#00D084" stroke-width="40" rx="16" transform="rotate(45)" />
  </g>
  <text x="600" y="390" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff" text-anchor="middle" letter-spacing="-2">Trade Window</text>
  <text x="600" y="460" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#00D084" text-anchor="middle" letter-spacing="-0.5">OTC Trade Room for AtomOne &amp; Gno.land</text>
  <text x="600" y="530" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="400" fill="#a3a3a3" text-anchor="middle" letter-spacing="0">Public OTC board · Structured deal intents · Gno commitment layer</text>
  <text x="600" y="590" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="1">tradewindow.xyz</text>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(outDir, 'logo-mark.svg'), symbolOnlySvg);
fs.writeFileSync(path.join(outDir, 'logo.svg'), logoSvg);
fs.writeFileSync(path.join(outDir, 'favicon-v3.svg'), faviconSvg);
fs.writeFileSync(path.join(outDir, 'og-image-v3.svg'), ogImageSvg);
fs.writeFileSync(path.join(outDir, 'favicon.svg'), faviconSvg); // Keep legacy
fs.writeFileSync(path.join(outDir, 'og-image.svg'), ogImageSvg); // Keep legacy

// 5. Generate PNGs using Sharp
async function generateImages() {
  const faviconBuffer = Buffer.from(faviconSvg);
  const symbolBuffer = Buffer.from(symbolOnlySvg);
  const ogBuffer = Buffer.from(ogImageSvg);

  // Logo Mark
  await sharp(symbolBuffer).resize(512, 512).png().toFile(path.join(outDir, 'logo-mark.png'));
  console.log('Generated logo-mark.png');

  // Favicon sizes (v3)
  await sharp(faviconBuffer).resize(192, 192).png().toFile(path.join(outDir, 'icon-192-v3.png'));
  console.log('Generated icon-192-v3.png');
  
  await sharp(faviconBuffer).resize(512, 512).png().toFile(path.join(outDir, 'icon-512-v3.png'));
  console.log('Generated icon-512-v3.png');
  
  await sharp(faviconBuffer).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon-v3.png'));
  console.log('Generated apple-touch-icon-v3.png');
  
  await sharp(faviconBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon-v3.ico'));
  console.log('Generated favicon-v3.ico');

  // Legacy sizes (just to be safe)
  await sharp(faviconBuffer).resize(192, 192).png().toFile(path.join(outDir, 'icon-192.png'));
  await sharp(faviconBuffer).resize(512, 512).png().toFile(path.join(outDir, 'icon-512.png'));
  await sharp(faviconBuffer).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon.png'));
  await sharp(faviconBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon.ico'));

  // OG Image (v3)
  await sharp(ogBuffer).resize(1200, 630).png().toFile(path.join(outDir, 'og-image-v3.png'));
  console.log('Generated og-image-v3.png');

  // Legacy OG Image
  await sharp(ogBuffer).resize(1200, 630).png().toFile(path.join(outDir, 'og-image.png'));
}

generateImages().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
