const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// CRC32 table for PNG chunk checksums
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);

  return Buffer.concat([len, typeAndData, crc]);
}

function generatePng(width, height, isScreenshot = false) {
  const rawData = [];
  const center = Math.min(width, height) / 2;
  const radius = center * 0.44;

  for (let y = 0; y < height; y++) {
    rawData.push(0); // Filter byte

    for (let x = 0; x < width; x++) {
      if (isScreenshot) {
        // App header bar
        if (y < 60) {
          rawData.push(5, 150, 105, 255); // Emerald navbar
        } else if (y >= 60 && y < 200) {
          rawData.push(241, 245, 249, 255); // Slate hero
        } else {
          rawData.push(255, 255, 255, 255); // White body
        }
      } else {
        const dx = x - width / 2;
        const dy = y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const cornerRadius = center * 0.45;
        const qx = Math.max(0, Math.abs(dx) - (center - cornerRadius));
        const qy = Math.max(0, Math.abs(dy) - (center - cornerRadius));
        const isInside = Math.sqrt(qx * qx + qy * qy) <= cornerRadius;

        if (isInside) {
          const inGOuter = dist <= radius * 0.65 && dist >= radius * 0.35;
          const inRightGap = dx > 0 && dy > -radius * 0.15 && dy < radius * 0.15;
          const inGBar = dx >= -radius * 0.05 && dx <= radius * 0.35 && dy >= -radius * 0.1 && dy <= radius * 0.1;

          if ((inGOuter && !inRightGap) || inGBar) {
            rawData.push(255, 255, 255, 255); // White "G"
          } else {
            rawData.push(5, 150, 105, 255); // Emerald bg
          }
        } else {
          rawData.push(0, 0, 0, 0); // Transparent
        }
      }
    }
  }

  const uncompressed = Buffer.from(rawData);
  const compressed = zlib.deflateSync(uncompressed);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8);
  ihdrData.writeUInt8(6, 9);
  ihdrData.writeUInt8(0, 10);
  ihdrData.writeUInt8(0, 11);
  ihdrData.writeUInt8(0, 12);

  const ihdrChunk = createChunk('IHDR', ihdrData);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const publicDir = path.join(__dirname, '..', 'public');

// Generate PWA Icons
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-192x192.png'), generatePng(192, 192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generatePng(512, 512));
fs.writeFileSync(path.join(publicDir, 'icon-512x512.png'), generatePng(512, 512));

// Generate PWA Screenshots (Desktop & Mobile)
fs.writeFileSync(path.join(publicDir, 'screenshot-desktop.png'), generatePng(1280, 720, true));
fs.writeFileSync(path.join(publicDir, 'screenshot-mobile.png'), generatePng(720, 1280, true));

console.log('✅ Generated 192x192 & 512x512 PNG Icons and Desktop/Mobile Screenshots in public/');
