import app from "./app";
import { type GeoData } from "./types";

// Cloudflare Workers Adapter: Add CF-specific middleware
app.use("*", async (c, next) => {
  const cf = c.req.raw.cf;
  const url = new URL(c.req.url);

  const geo: GeoData = {
    ip: c.req.header("CF-Connecting-IP") || c.req.header("x-real-ip") || "",
    hostname: url.hostname,
    
    // CF 資訊
    colo: cf?.colo as string,
    country: cf?.country as string, 
    city: cf?.city as string,
    continent: cf?.continent as string,
    latitude: cf?.latitude as string,
    longitude: cf?.longitude as string,
    asn: cf?.asn as number,
    asOrganization: cf?.asOrganization as string,
    isEUCountry: cf?.isEUCountry as boolean | undefined, 
    postalCode: cf?.postalCode as string,
    metroCode: cf?.metroCode as string,
    region: cf?.region as string,
    regionCode: cf?.regionCode as string,
    timezone: cf?.timezone as string,
  };

  c.set("geo", geo);
  await next();
});

export default app;
