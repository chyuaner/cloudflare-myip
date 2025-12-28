import fs from 'node:fs';
import path from 'node:path';
import { Reader } from 'mmdb-lib'; // User needs to install this: npm install mmdb-lib
import { GeoData } from './types.js';

let dbReader: Reader<any> | null = null;
const DB_PATH = path.resolve(process.cwd(), 'GeoLite2-City.mmdb'); // Default path

export function initGeoIP(dbPath: string = DB_PATH) {
  if (!fs.existsSync(dbPath)) {
    console.warn(`[GeoIP] Database not found at ${dbPath}. GeoIP lookup will be disabled.`);
    return;
  }
  try {
    const buffer = fs.readFileSync(dbPath);
    dbReader = new Reader(buffer);
    console.log(`[GeoIP] Database loaded from ${dbPath}`);
  } catch (error) {
    console.error('[GeoIP] Failed to load database:', error);
  }
}

export function lookupIp(ip: string): Partial<GeoData> {
  if (!dbReader || !ip) return {};

  try {
    const result = dbReader.get(ip) as any;
    if (!result) return {};

    // Map MMDB result to our GeoData structure
    // Note: The mapping depends on the specific MMDB format (e.g., MaxMind)
    return {
      country: result.country?.iso_code,
      city: result.city?.names?.en,
      continent: result.continent?.code,
      longitude: result.location?.longitude?.toString(),
      latitude: result.location?.latitude?.toString(),
      postalCode: result.postal?.code,
      timezone: result.location?.time_zone,
      isEUCountry: result.country?.is_in_european_union,
      // Map other fields as needed
    };
  } catch (err) {
    console.error(`[GeoIP] Lookup error for ${ip}:`, err);
    return {};
  }
}
