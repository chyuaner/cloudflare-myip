import { handle } from 'hono/vercel';
import { Hono } from "hono";
import app from "./app";
import { type Variables, type Bindings, type GeoData } from "./types";

const vercelApp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

vercelApp.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Vercel Headers for GeoIP
  // https://vercel.com/docs/edge-network/headers#x-vercel-ip-country
  const geo: GeoData = {
    ip: c.req.header("x-forwarded-for") || "", // Vercel sets this
    hostname: url.hostname,
    
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

export const GET = handle(vercelApp);
export const POST = handle(vercelApp);
// Add other methods if needed, or fallback to default export style for older Vercel Functions
export default handle(vercelApp);
