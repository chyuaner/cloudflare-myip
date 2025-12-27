import { Hono } from "hono";
import app from "./core/app.js";
import { type Variables, type Bindings, type GeoData } from "./core/types.js";

const worker = new Hono<{ Bindings: Bindings; Variables: Variables }>();

worker.use("*", async (c, next) => {
  const cf = c.req.raw.cf;
  const url = new URL(c.req.url); // Use helper to get hostname easily if needed, though c.req.header('host') also works

  const geo: GeoData = {
    ip: (cf?.ip as string) || c.req.header("CF-Connecting-IP") || c.req.header("x-real-ip") || "",
    hostname: url.hostname,
    
    // CF 資訊
    colo: cf?.colo as string,
    country: cf?.country as string, 
    city: cf?.city as string,
    continent: cf?.continent as string,
    longitude: cf?.longitude as string,
    latitude: cf?.latitude as string,
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

worker.route("/", app);

export default worker;
