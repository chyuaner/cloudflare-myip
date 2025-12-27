export interface GeoData {
  ip: string;
  hostname?: string;

  // CF 資訊 / GeoIP 資訊
  colo?: string;
  country?: string;
  city?: string;
  continent?: string;
  longitude?: string;
  latitude?: string;
  asn?: number;
  asOrganization?: string;
  isEUCountry?: boolean;
  postalCode?: string;
  metroCode?: string;
  region?: string;
  regionCode?: string;
  timezone?: string;
}

export type Variables = {
  geo: GeoData;
};

export type Bindings = CloudflareBindings;
