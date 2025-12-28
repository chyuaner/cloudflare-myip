import { Context } from "hono";
import { GeoData } from "./types";

class DataUtils {
  private honoC: Context
  private defaultTz?: string;
  private tz?: string;
  private utcDateObj = new Date();

  constructor(c: Context) {
    this.honoC = c;
  }

  getData() {
    return {
      isIpv6: this.isIpv6(),
      ...this.getHostData(),
      now: {
        time: this.getTime(),
        date: this.getDate(),
        tz: this.getTz(),
        stz: this.getShortTz(),
        str: this.getNow(),
      },
      nowStr: this.getNow(),
      time: this.getTime(),
      date: this.getDate(),
      tz: this.getTz(),
      stz: this.getShortTz(),
      utc: {
        time: this.getUtcTime(),
        date: this.getUtcDate(),
        tz: 'UTC',
        stz: 'UTC',
        str: this.getUtc(),
      },
      utcStr: this.getUtc(),
      utcDate: this.getUtcDate(),
      utcTime: this.getUtcTime(),
    };
  }

  getHostData(): GeoData {
    return this.honoC.var.geo;
  }

  getIp(): string {
    return this.honoC.var.geo.ip;
  }

  isIpv6(): boolean | undefined {
    const thisIp = this.getIp();
    return isIpv6(thisIp);
  }

  private getUtcDateObj(): Date {
    return this.utcDateObj;
  }

  getUtc(): string {
    const now = this.getUtcDateObj().toUTCString();
    return now;
  }

  getUtcDate(): string {
    const now = formatDate((this.getUtcDateObj()), "GMT");
    return now;
  }
  getUtcTime(): string {
    const now = formatTime((this.getUtcDateObj()), "GMT");
    return now;
  }

  getTz(): string | null {
    return this.tz ?? this.honoC.var.geo.timezone ?? this.defaultTz ?? 'UTC';
  }

  setDefaultTz(s: string): string {
    this.defaultTz = s;
    return s;
  }

  setTz(s: string): string {
    this.tz = s;
    return s;
  }

  getNow(): string {
    const localTz = this.getTz();
    const utcNow = this.getUtcDateObj();

    // const fmt = new Intl.DateTimeFormat(undefined, {
    //   timeZone: localTz,
    //   dateStyle: "short",    // 與瀏覽器預設的日期格式相同
    //   timeStyle: "medium",   // 與瀏覽器預設的時間格式相同
    // });
    // const now = fmt.format(utcNow);

    const now = formatGMT(utcNow, localTz ?? "GMT");
    return now;
  }

  getNowArray(): object {
    return {
      time: this.getTime(),
      date: this.getDate(),
      tz: this.getTz(),
      stz: this.getShortTz(),
      str: this.getNow(),
    };
  }

  getDate(): string {
    const now = formatDate((this.getUtcDateObj()), this.getTz() ?? "GMT");
    return now;
  }
  getTime(): string {
    const now = formatTime((this.getUtcDateObj()), this.getTz() ?? "GMT");
    return now;
  }

  getShortTz(): string {
    const localTz = this.getTz() ?? 'GMT';
    const utcNow = this.getUtcDateObj();
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: localTz,           // 例如 GMT / Asia/Taipei …
      timeZoneName: "short", // 產生 GMT、CET、EST …，GMT 為我們需要的字樣
    });
    // 用 formatToParts 把每個欄位分別抓出來
    const parts = formatter.formatToParts(utcNow);
    const map: Record<string, string> = {};

    // 只保留非 literal（文字片段），把值存入 map
    for (const p of parts) {
      if (p.type !== "literal") map[p.type] = p.value;
    }
    return map.timeZoneName;
  }
}

function format(date: Date, timeZone: string = "GMT", options?: Intl.DateTimeFormatOptions): Record<string, string> {
  // 建立 formatter（只負責把各部件拆開，不負責拼字）
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
    ...options,
  });

  // 用 formatToParts 把每個欄位分別抓出來
  const parts = formatter.formatToParts(date);
  const map: Record<string, string> = {};

  // 只保留非 literal（文字片段），把值存入 map
  for (const p of parts) {
    if (p.type !== "literal") map[p.type] = p.value;
  }
  return map;
}

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
  const map = format(date, timeZone);

  // 按欲輸出的樣式自行拼接
  //    例：weekday, day month year hour:minute:second timezoneName
  return `${map.weekday}, ${map.day} ${map.month} ${map.year} ${map.hour}:${map.minute}:${map.second} ${map.timeZoneName}`;
}

export function formatDate(date: Date, timeZone: string = "GMT"): string {
  const map = format(date, timeZone, { month: "2-digit" });
  return `${map.year}/${map.month}/${map.day}`;
  // return `${map.year}/${map.month}/${map.day} ${map.weekday}`;
}

export function formatTime(date: Date, timeZone: string = "GMT"): string {
  const map = format(date, timeZone);
  return `${map.hour}:${map.minute}:${map.second}`;
}

export function isIpv6(thisIp: string): boolean | undefined {
  // IPv6 正則（支援縮寫與 IPv4 映射形式）
  const ipv6Pattern = /^(?:[A-F0-9]{1,4}:){7}[A-F0-9]{1,4}$|^(?:[A-F0-9]{1,4}:){1,7}:$|^(?:[A-F0-9]{1,4}:){1,6}:[A-F0-9]{1,4}$|^(?:[A-F0-9]{1,4}:){1,5}(?::[A-F0-9]{1,4}){1,2}$|^(?:[A-F0-9]{1,4}:){1,4}(?::[A-F0-9]{1,4}){1,3}$|^(?:[A-F0-9]{1,4}:){1,3}(?::[A-F0-9]{1,4}){1,4}$|^(?:[A-F0-9]{1,4}:){1,2}(?::[A-F0-9]{1,4}){1,5}$|^[A-F0-9]{1,4}:(?::[A-F0-9]{1,4}){1,6}$|^:(?::[A-F0-9]{1,4}){1,7}$|^fe80:(?::[A-F0-9]{0,4}){0,4}%[0-9a-zA-Z]{1,}$|^::(ffff(?::0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])\.){3}(25[0-5]|(2[0-4]|1{0,1}[0-9])?[0-9])$/i;

  // IPv4 正則
  const ipv4Pattern = /^(25[0-5]|2[0-4]\d|1?\d{1,2})(\.(25[0-5]|2[0-4]\d|1?\d{1,2})){3}$/;

  // 符合 IPv6 規則 → true
  if (ipv6Pattern.test(thisIp)) {
    return true;
  }
  // 符合 IPv4 規則 → false
  else if (ipv4Pattern.test(thisIp)) {
    return false;
  }
  else {
    return undefined;
  }
}

export default DataUtils;
