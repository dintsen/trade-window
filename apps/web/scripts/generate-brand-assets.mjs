import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');

const faviconSvg = path.join(publicDir, 'favicon.svg');
const ogSvg = path.join(publicDir, 'og-image.svg');

async function generate() {
  console.log('Generating assets in:', publicDir);

  try {
    // 1. icon-512.png
    console.log('Generating icon-512.png...');
    await sharp(faviconSvg)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'icon-512.png'));

    // 2. icon-192.png
    console.log('Generating icon-192.png...');
    await sharp(faviconSvg)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'icon-192.png'));

    // 3. apple-touch-icon.png
    console.log('Generating apple-touch-icon.png...');
    await sharp(faviconSvg)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // 4. favicon.ico
    console.log('Generating favicon.ico...');
    const icoBuffer = await sharp(faviconSvg)
      .resize(32, 32)
      .png()
      .toBuffer();
    fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);

    // 5. og-image.png
    console.log('Generating og-image.png...');
    await sharp(ogSvg)
      .resize(1200, 630)
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));

    console.log('All brand assets generated successfully!');
  } catch (error) {
    console.error('Error generating assets:', error);
    process.exit(1);
  }
}

generate();
