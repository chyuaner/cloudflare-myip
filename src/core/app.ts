import { Hono } from "hono";
import { type Variables, type Bindings } from "./types.js";
import DataUtils from "./data.js";
const DEFAULT_TZ = 'Asia/Taipei';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", (c) => {
  // const geo = c.var.geo;
  // return c.json(geo);

  const dataUtils = new DataUtils(c);
  const data = dataUtils.getData();
  return c.json(data);
});

// app.all("/ip", (c) => {
//   return c.text(c.var.geo.ip)
// });

app.all(
  '/:field{(ip|hostname|colo|country|city|continent|latitude|longitude|asn|asOrganization|isEUCountry|postalCode|metroCode|region|regionCode|timezone)}',
  (c) => {

    // 取得路徑參數 `field`
    const field = c.req.param('field');

    // 使用 [] 中括號語法，把參數當作 key 去取 `c.var.geo` 的值
    // 注意：`c.var.geo` 在 TypeScript 中的型別預設是 `any`，若想要更嚴格可自行宣告介面
    const data = new DataUtils(c).getData();
    const value = (data as Record<string, unknown>)[field];

    // 若沒有對應的值（常見於 Cloudflare Workers 的 `cf` 內可能缺少某欄位），回 404
    if (value === undefined) {
      return c.text('null');
    }

    // 直接回傳文字（如果想回 JSON，可改成 `c.json({ field, value })`）
    return c.text(String(value));
});

app.on('ALL', ["/now", '/now/local'], (c) => {
  const dataUtils = new DataUtils(c);
  dataUtils.setDefaultTz(DEFAULT_TZ);
  const now = dataUtils.getNow();
  return c.text(now);
});

app.on('ALL', ["/utc", '/now/utc'], (c) => {
  const now = new DataUtils(c).getUtc();
  return c.text(now);
});

export default app;
