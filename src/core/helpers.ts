/**
 * 把 Date 物件格式化成  "Fri, 26 Dec 2025 13:32:38 GMT"
 * - 僅使用 Intl.DateTimeFormat（不依賴外部套件）
 * - 允許自行指定時區（預設 GMT）
 *
 * @param date      要格式化的日期（已是 UTC 時間點）
 * @param timeZone  IANA 時區名稱，預設 "GMT"
 * @returns         固定格式的字串
 */
export function formatGMT(date: Date, timeZone: string = "GMT"): string {
  // 1️⃣ 建立 formatter（只負責把各部件拆開，不負責拼字）
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",   // Fri
    day: "2-digit",     // 26
    month: "short",     // Dec
    year: "numeric",    // 2025
    hour: "2-digit",    // 13
    minute: "2-digit", // 32
    second: "2-digit", // 38
    hour12: false,      // 24 小時制
    timeZone,           // 例如 GMT / Asia/Taipei …
    timeZoneName: "short", // 產生 GMT、CET、EST …，GMT 為我們需要的字樣
  });

  // 2️⃣ 用 formatToParts 把每個欄位分別抓出來
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};

  // 只保留非 literal（文字片段），把值存入 map
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }

  // 3️⃣ 按欲輸出的樣式自行拼接
  //    例：weekday, day month year hour:minute:second timezoneName
  return `${map.weekday}, ${map.day} ${map.month} ${map.year} ${map.hour}:${map.minute}:${map.second} ${map.timeZoneName}`;
}