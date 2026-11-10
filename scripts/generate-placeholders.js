/**
 * Script: generate-placeholders.js
 * Membuat file audio placeholder (minimal valid MP3) untuk semua hewan.
 * Jalankan: node scripts/generate-placeholders.js
 */

const fs = require('fs');
const path = require('path');

// Minimal valid MP3 header (silent, ~100ms) - 24 bytes
// ID3v2 header + minimal MPEG frame
const SILENT_MP3 = Buffer.from([
  // ID3v2 header
  0x49, 0x44, 0x33, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  // MPEG1 Layer3 silence frame header (128kbps, 44100Hz, stereo)
  0xFF, 0xFB, 0x90, 0x00,
  // Padding
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
]);

const BASE = path.join(__dirname, '..');

const animalIds = [
  'lion', 'elephant', 'tiger', 'giraffe', 'crocodile', 'horse', 'cow', 'rabbit',
  'fish', 'dolphin', 'whale', 'octopus', 'crab', 'shark',
  'eagle', 'parrot', 'butterfly', 'bee', 'owl', 'flamingo',
];

const paths = [
  ...animalIds.map((id) => `assets/audio/sounds/${id}.mp3`),
  ...animalIds.map((id) => `assets/audio/narration/id/${id}.mp3`),
  ...animalIds.map((id) => `assets/audio/narration/en/${id}.mp3`),
  'assets/audio/music/bg_music.mp3',
  'assets/audio/sfx/correct.mp3',
  'assets/audio/sfx/wrong.mp3',
  'assets/audio/sfx/star.mp3',
  'assets/audio/sfx/celebrate.mp3',
];

let created = 0;
let skipped = 0;

for (const p of paths) {
  const fullPath = path.join(BASE, p);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, SILENT_MP3);
    console.log(`✅ Created: ${p}`);
    created++;
  } else {
    skipped++;
  }
}

console.log(`\n📦 Done! Created: ${created}, Skipped (already exists): ${skipped}`);
