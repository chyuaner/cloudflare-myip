import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import subsetFont from 'subset-font';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const OUTPUT_FILE = path.join(ROOT, 'src/core/assets.gen.ts');

/**
 * 自動從原始碼中提取所有出現過的字元，用於字體子集化
 */
function collectTextFromFiles(): string {
  const sourceFiles = [
    path.join(ROOT, 'src/core/html.tsx'),
    path.join(ROOT, 'src/core/baseHtml.tsx'),
    path.join(ROOT, 'src/core/app.ts'),
  ];
  
  // 基礎字集：英數字、常用符號
  let allText = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ';
  
  for (const file of sourceFiles) {
    if (fs.existsSync(file)) {
      allText += fs.readFileSync(file, 'utf-8');
    }
  }
  
  // 移除重複字元並過濾掉控制字元與程式碼保留字（非必要，但能精簡字串）
  return Array.from(new Set(allText.split(''))).join('');
}

/**
 * 資產設定：
 * - key: 產出物件中的鍵名
 * - path: 原始路徑 (相對於 ROOT)
 * - generateIco: 是否要額外產生 .ico 版本 (僅限 PNG)
 * - subset: 是否要進行子集化與 woff2 壓縮 (僅限字體)
 */
const ASSET_CONFIG = [
  { key: 'favicon', path: 'src/core/favicon.png', generateIco: true },
  { key: 'font', path: 'src/core/font.ttf', subset: true },
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

async function run() {
  const results: Record<string, string> = {};
  const subsetText = collectTextFromFiles();
  
  console.log(`🔍 Scanning source files... Found ${subsetText.length} unique characters.`);

  for (const asset of ASSET_CONFIG) {
    const fullPath = path.join(ROOT, asset.path);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`⚠️ Warning: Source file not found: ${fullPath}`);
      continue;
    }

    let buffer = fs.readFileSync(fullPath);
    const ext = path.extname(asset.path).slice(1).toLowerCase();

    if (asset.subset && (ext === 'ttf' || ext === 'otf' || ext === 'woff')) {
      console.log(`🔡 Subsetting font: ${asset.path}...`);
      try {
        buffer = Buffer.from(await subsetFont(buffer, subsetText, { targetFormat: 'woff2' }));
        results[`${asset.key}_woff2`] = buffer.toString('base64');
      } catch (err) {
        console.error(`❌ Failed to subset font ${asset.path}:`, err);
        // Fallback to original
        results[`${asset.key}_${ext}`] = buffer.toString('base64');
      }
    } else {
      results[`${asset.key}_${ext}`] = buffer.toString('base64');
    }

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
} as const;
`;

  // 檢查內容是否一致，避免觸發 Wrangler Watch 造成無限對圈
  if (fs.existsSync(OUTPUT_FILE)) {
    const existingContent = fs.readFileSync(OUTPUT_FILE, 'utf-8');
    if (existingContent === content) {
      console.log(`✅ Assets are already up to date. (Skipped writing)`);
      return;
    }
  }

  fs.writeFileSync(OUTPUT_FILE, content);
  console.log(`✅ Assets generated to ${OUTPUT_FILE}`);
}

run().catch(console.error);
