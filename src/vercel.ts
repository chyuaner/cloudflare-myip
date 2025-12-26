import { handle } from 'hono/vercel';
import app from "./app";
import { type GeoData } from "./types";

// Vercel Adapter: Add Vercel-specific middleware
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Vercel Headers for GeoIP
  const geo: GeoData = {
    ip: c.req.header("x-forwarded-for") || "",
    hostname: url.hostname,
    
    country: c.req.header("x-vercel-ip-country"),
    regionCode: c.req.header("x-vercel-ip-country-region"),
    city: c.req.header("x-vercel-ip-city"),
    latitude: c.req.header("x-vercel-ip-latitude"),
    longitude: c.req.header("x-vercel-ip-longitude"),
    timezone: c.req.header("x-vercel-ip-timezone"),
    continent: c.req.header("x-vercel-ip-continent")
  };

  c.set("geo", geo);
  await next();
});

export const GET = handle(app);
export const POST = handle(app);
export default handle(app);
