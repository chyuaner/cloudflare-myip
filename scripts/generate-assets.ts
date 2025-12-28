import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'src/core/assets.gen.ts');

/**
 * 資產設定：
 * - key: 產出物件中的鍵名
 * - path: 原始路徑 (相對於 ROOT)
 * - generateIco: 是否要額外產生 .ico 版本 (僅限 PNG)
 */
const ASSET_CONFIG = [
  { key: 'favicon', path: 'src/core/favicon.png', generateIco: true },
  // 可以在這裡輕鬆增加更多圖片
  // { key: 'logo', path: 'src/core/logo.png' },
  // { key: 'bg_map', path: 'src/core/map.jpg' },
];

/**
 * 極輕量 PNG 轉 ICO (手動包裝 Header)
 */
function pngToIcoBuffer(pngBuffer: Buffer): Buffer {
  const header = Buffer.from([0, 0, 1, 0, 1, 0]);
  const entry = Buffer.alloc(16);
  entry[0] = 0; // Width (0 means 256)
  entry[1] = 0; // Height
  entry[2] = 0; // Color palette
  entry[3] = 0; // Reserved
  entry.writeUInt16LE(1, 4); // Color planes
  entry.writeUInt16LE(32, 6); // Bits per pixel
  entry.writeUInt32LE(pngBuffer.length, 8); // Image size
  entry.writeUInt32LE(22, 12); // Offset
  return Buffer.concat([header, entry, pngBuffer]);
}

function run() {
  const results: Record<string, string> = {};

  for (const asset of ASSET_CONFIG) {
    const fullPath = path.join(ROOT, asset.path);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Warning: Source file not found: ${fullPath}`);
      continue;
    }

    const buffer = fs.readFileSync(fullPath);
    const base64 = buffer.toString('base64');
    
    // 取得附檔名
    const ext = path.extname(asset.path).slice(1).toLowerCase();
    results[`${asset.key}_${ext}`] = base64;

    if (asset.generateIco && ext === 'png') {
      const icoBuffer = pngToIcoBuffer(buffer);
      results[`${asset.key}_ico`] = icoBuffer.toString('base64');
    }
  }

  const content = `/** 
 * 此檔案為自動產生，請勿手動修改。
 * 執行 npm run build:assets 更新。
 */
export const ASSETS = {
${Object.entries(results).map(([key, val]) => `  ${key}: "${val}",`).join('\n')}
  updated_at: "${new Date().toISOString()}"
} as const;
`;

  fs.writeFileSync(OUTPUT_FILE, content);
  console.log(`✅ Assets generated to ${OUTPUT_FILE}`);
}

run();
