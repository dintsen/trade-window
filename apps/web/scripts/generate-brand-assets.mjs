import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, '../public');
const outDir = publicDir;

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Read official logo
const logoContent = fs.readFileSync(path.join(publicDir, 'logo-trade.svg'), 'utf8');

// Extract paths
const allPathsMatch = logoContent.match(/<path[^>]+>/g) || [];
const greenPaths = allPathsMatch.filter(p => p.includes('#10B981'));

// Generate Favicon SVG (Symbol with background, or just symbol on transparent)
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="112" fill="#050807" />
  <g transform="translate(146, 126) scale(1.1)">
    <g transform="translate(-40, -10)">
      ${greenPaths.join('\n      ')}
    </g>
  </g>
</svg>`;

// 4. Generate OG Image SVG (uses full logo)
const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#050807" />
  <defs>
    <radialGradient id="glow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#050807" stop-opacity="0" />
    </radialGradient>
    <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" stroke-opacity="0.03" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#glow)" />
  <rect width="1200" height="630" fill="url(#grid)" />
  
  <g transform="translate(150, 180) scale(0.75)">
    ${allPathsMatch.join('\n    ')}
  </g>
  
  <text x="600" y="460" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="600" fill="#10B981" text-anchor="middle" letter-spacing="-0.5">OTC Trade Room for AtomOne &amp; Gno.land</text>
  <text x="600" y="530" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="22" font-weight="400" fill="#a3a3a3" text-anchor="middle" letter-spacing="0">Public OTC board · Structured deal intents · Gno commitment layer</text>
  <text x="600" y="590" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="#ffffff" opacity="0.4" text-anchor="middle" letter-spacing="1">tradewindow.xyz</text>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(outDir, 'favicon-v4.svg'), faviconSvg);
fs.writeFileSync(path.join(outDir, 'og-image-v4.svg'), ogImageSvg);

// 5. Generate PNGs using Sharp
async function generateImages() {
  const faviconBuffer = Buffer.from(faviconSvg);
  const ogBuffer = Buffer.from(ogImageSvg);

  // Favicon sizes (v4)
  await sharp(faviconBuffer).resize(192, 192).png().toFile(path.join(outDir, 'icon-192-v4.png'));
  console.log('Generated icon-192-v4.png');
  
  await sharp(faviconBuffer).resize(512, 512).png().toFile(path.join(outDir, 'icon-512-v4.png'));
  console.log('Generated icon-512-v4.png');
  
  await sharp(faviconBuffer).resize(180, 180).png().toFile(path.join(outDir, 'apple-touch-icon-v4.png'));
  console.log('Generated apple-touch-icon-v4.png');
  
  await sharp(faviconBuffer).resize(32, 32).png().toFile(path.join(outDir, 'favicon-v4.ico'));
  console.log('Generated favicon-v4.ico');

  // OG Image (v4)
  await sharp(ogBuffer).resize(1200, 630).png().toFile(path.join(outDir, 'og-image-v4.png'));
  console.log('Generated og-image-v4.png');
}

generateImages().catch(err => {
  console.error('Error generating images:', err);
  process.exit(1);
});
