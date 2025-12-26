import { Hono } from "hono";
import app from "./core.js";
import { type Variables, type Bindings, type GeoData } from "./types.js";

const vercelApp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vercelApp.use("*", async (c, next) => {
  // Vercel Headers for GeoIP
  // https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
  const geo: GeoData = {
    ip: c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "", 
    hostname: c.req.header("host") || "",
    
    country: c.req.header("x-vercel-ip-country"),
    regionCode: c.req.header("x-vercel-ip-country-region"),
    city: c.req.header("x-vercel-ip-city"),
    latitude: c.req.header("x-vercel-ip-latitude"),
    longitude: c.req.header("x-vercel-ip-longitude"),
    timezone: c.req.header("x-vercel-ip-timezone"),
    continent: c.req.header("x-vercel-ip-continent") // Not always available, check docs
  };

  c.set("geo", geo);
  await next();
});

vercelApp.route("/", app);

export default vercelApp;
