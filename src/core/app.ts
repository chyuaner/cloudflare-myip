import { Hono, Context, Env } from "hono";
import { type Variables, type Bindings } from "./types.js";
import DataUtils from "./data.js";
import { IndexPage, CommonPage, IpPage } from "./html.js";
import { ASSETS } from "./assets.gen.js";

const DEFAULT_TZ = 'Asia/Taipei';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Helper to serve base64 assets
const serveBase64 = (base64: string, contentType: string) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return {
    body: bytes.buffer,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=604800, immutable",
    },
  };
};

app.get("/favicon.png", (c) => {
  const asset = serveBase64(ASSETS.favicon_png, "image/png");
  return c.body(asset.body, 200, asset.headers);
});

app.get("/favicon.ico", (c) => {
  const asset = serveBase64(ASSETS.favicon_ico, "image/x-icon");
  return c.body(asset.body, 200, asset.headers);
});

app.get("/font.woff2", (c) => {
  const asset = serveBase64(ASSETS.font_woff2, "font/woff2");
  return c.body(asset.body, 200, asset.headers);
});

app.all("/", (c) => {
  // const geo = c.var.geo;
  // return c.json(geo);

  const dataUtils = new DataUtils(c);
  dataUtils.setDefaultTz(DEFAULT_TZ);
  const data = dataUtils.getData();

  // 檢查 Accept header 是否包含 text/html
  const acceptHeader = c.req.header("Accept") || "";
  if (acceptHeader.includes("text/html")) {

    const title = '你的IP是: ' + data.ip;

    const html = IndexPage({ title, data });
    return c.html(html?.toString() || "");
  }

  return c.json(data);
});

app.get('/background', async (c) => {
  const isDark = c.req.query('dark') === 'true';

  const dataUtils = new DataUtils(c);
  const longitude = c.req.query('longitude') ?? dataUtils.getHostData().longitude;
  const latitude = c.req.query('latitude') ?? dataUtils.getHostData().latitude;

  if (!latitude || !longitude) {
    return c.text('Missing coordinates', 500);
  }

  // 使用 Yandex Static Maps
  const zoom = 9;
  const width = 600;
  const height = 450;
  const url = `https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${longitude},${latitude}&z=${zoom}&l=map&size=${width},${height}`;

  const response = await fetch(url, {
    cf: {
      cacheTtl: 86400,
      cacheEverything: true
    }
  });

  if (!response.ok) {
    return c.text('Fetch map failed', 500);
  }

  const arrayBuffer = await response.arrayBuffer();

  if (isDark) {
    // 後端處理：將圖片封裝進帶有 SVG Filter 的容器中，達成「預先反轉」
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);

    const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <filter id="invert">
      <!-- 1. 色彩反轉 -->
      <feComponentTransfer>
        <feFuncR type="table" tableValues="1 0"/>
        <feFuncG type="table" tableValues="1 0"/>
        <feFuncB type="table" tableValues="1 0"/>
      </feComponentTransfer>
      <!-- 2. 色相旋轉補正 -->
      <feColorMatrix type="hueRotate" values="180"/>
      <!-- 3. 降低飽和度，讓地圖看起來更 Premium (不那麼刺眼) -->
      <feColorMatrix type="saturate" values="0.4"/>
      <!-- 4. 調整最後的亮點與對比 -->
      <feComponentTransfer>
        <!-- R, G 通道壓更低 (0.35)，讓陸地/海洋變深 -->
        <feFuncR type="linear" slope="0.35" intercept="-0.05"/>
        <feFuncG type="linear" slope="0.35" intercept="-0.05"/>
        <!-- B 通道稍微保留高一點點 (0.45)，讓深處帶點藍色感 -->
        <feFuncB type="linear" slope="0.45" intercept="-0.03"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <image xlink:href="data:image/png;base64,${base64}" width="100%" height="100%" filter="url(#invert)"/>
</svg>`.trim();

    return c.body(svg, 200, {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=604800, immutable",
    });
  }

  return c.body(arrayBuffer, 200, {
    "Content-Type": "image/png",
    "Cache-Control": "public, max-age=604800, immutable",
  });
})

app.all("/ip", (c) => {
  // return c.text(c.var.geo.ip)

  const dataUtils = new DataUtils(c);
  const data = dataUtils.getHostData();

  // 檢查 Accept header 是否包含 text/html
  const acceptHeader = c.req.header("Accept") || "";
  if (acceptHeader.includes("text/html")) {

    const title = '你的IP是: ' + data.ip;

    const html = IpPage({ title, data });
    return c.html(html?.toString() || "");
  }

  return c.text(data.ip);
});

function commonResponse<T extends Env = {}>(c: Context<T>, output: any, field?: string, title?: string) {
  let outputText = output;

  // 若沒有對應的值（常見於 Cloudflare Workers 的 `cf` 內可能缺少某欄位），回 404
  if (output === undefined) {
    outputText = 'null';
  }

  // 檢查 Accept header 是否包含 text/html
  const acceptHeader = c.req.header("Accept") || "";
  if (acceptHeader.includes("text/html")) {
    const isSimple = typeof outputText !== 'object' || outputText === null;
    const titleText = field
      ? (isSimple ? `${field}: ${outputText}` : field)
      : (isSimple ? String(outputText) : undefined);
    const h2 = field;

    const hostData = new DataUtils(c).getHostData();

    const html = CommonPage({
      data: outputText,
      h2,
      baseData: {
        longitude: hostData.longitude,
        latitude: hostData.latitude,
      },
      ...(titleText ? { title: titleText } : {})
    });
    return c.html(html?.toString() || "");
  }

  // 若 outputText 為 object (且非 null) 或是 array，使用 JSON 回傳
  if (
    (typeof outputText === "object" && outputText !== null) ||
    Array.isArray(outputText)
  ) {
    return c.json(outputText);
  }

  // 其他情況（字串、數字、null、undefined）回傳純文字
  return c.text(String(outputText));
}

app.all(
  '/:field{(hostname|colo|country|city|continent|latitude|longitude|asn|asOrganization|isEUCountry|postalCode|metroCode|region|regionCode|timezone)}',
  (c) => {

    // 取得路徑參數 `field`
    const field = c.req.param('field');

    // 使用 [] 中括號語法，把參數當作 key 去取 `c.var.geo` 的值
    // 注意：`c.var.geo` 在 TypeScript 中的型別預設是 `any`，若想要更嚴格可自行宣告介面
    const data = new DataUtils(c).getData();
    const value = (data as Record<string, unknown>)[field];
    return commonResponse(c, value, field);
});

app.on('ALL', ["/now", '/now/local'], (c) => {
  const dataUtils = new DataUtils(c);
  dataUtils.setDefaultTz(DEFAULT_TZ);
  const now = dataUtils.getNow();
  return commonResponse(c, now);
});
app.on('ALL', ["/now/", '/now/local/'], (c) => {
  const dataUtils = new DataUtils(c);
  dataUtils.setDefaultTz(DEFAULT_TZ);
  const nowArray = dataUtils.getNowArray();
  return commonResponse(c, nowArray);
});

app.on('ALL', ["/utc", '/now/utc'], (c) => {
  const now = new DataUtils(c).getUtc();
  return commonResponse(c, now);
});
app.on('ALL', ["/utc/", '/now/utc/'], (c) => {
  const dataUtils = new DataUtils(c);
  dataUtils.setTz('UTC');
  const nowArray = dataUtils.getNowArray();
  return commonResponse(c, nowArray);
});

export default app;
