import fs from "fs";
import path from "path";
import crypto from "crypto";

// JPEG dimension parser from binary buffer
function getJpegDimensions(buffer: Buffer): { width: number; height: number } | null {
  let offset = 2; // skip SOI marker 0xFFD8
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xFF) break;
    const marker = buffer[offset + 1];
    // SOF0 (0xC0) or SOF2 (0xC2)
    if (marker === 0xC0 || marker === 0xC2) {
      const height = buffer.readUInt16BE(offset + 5);
      const width = buffer.readUInt16BE(offset + 7);
      return { width, height };
    }
    // Skip marker segment
    const segmentLength = buffer.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  return null;
}

interface ImageItem {
  filename: string;
  size: number;
  hash: string;
  width: number;
  height: number;
  aspectRatio: string;
  orientation: "landscape" | "portrait" | "square";
}

const dir = path.join(process.cwd(), "public", "images", "lastseason");
const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".png"));

const items: ImageItem[] = [];
const hashMap = new Map<string, string[]>();

for (const file of files) {
  const filePath = path.join(dir, file);
  const buf = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256").update(buf).digest("hex");
  const dims = getJpegDimensions(buf) || { width: 0, height: 0 };
  const orientation = dims.width > dims.height ? "landscape" : dims.width < dims.height ? "portrait" : "square";
  const ratio = dims.height > 0 ? (dims.width / dims.height).toFixed(2) : "unknown";

  items.push({
    filename: file,
    size: buf.length,
    hash,
    width: dims.width,
    height: dims.height,
    aspectRatio: ratio,
    orientation,
  });

  const list = hashMap.get(hash) || [];
  list.push(file);
  hashMap.set(hash, list);
}

console.log(`TOTAL FILES: ${items.length}`);
console.log(`UNIQUE IMAGES BY SHA256: ${hashMap.size}`);

// Duplicates
const duplicates: { original: string; duplicate: string; hash: string }[] = [];
for (const [hash, fileList] of hashMap.entries()) {
  if (fileList.length > 1) {
    // Pick the one without " (1)" as primary
    fileList.sort((a, b) => a.length - b.length);
    const original = fileList[0];
    for (let i = 1; i < fileList.length; i++) {
      duplicates.push({ original, duplicate: fileList[i], hash });
    }
  }
}

console.log("\n--- DUPLICATES FOUND ---");
console.log(JSON.stringify(duplicates, null, 2));

console.log("\n--- UNIQUE IMAGES INVENTORY ---");
const uniqueItems = items.filter(it => !duplicates.some(d => d.duplicate === it.filename));
console.log(JSON.stringify(uniqueItems, null, 2));
