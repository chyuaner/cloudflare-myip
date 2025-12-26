import { serve } from "@hono/node-server";
import app from "./app";
import { type GeoData } from "./types";
import { initGeoIP, lookupIp } from "./services/node-geoip";

// Initialize GeoIP database on startup
initGeoIP();

// Node.js Adapter: Add Node-specific middleware
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Get IP from headers (behind proxy case) or socket
  const forwarded = c.req.header("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const geoIpData = lookupIp(ip);

  const geo: GeoData = {
    ip,
    hostname: url.hostname,
    ...geoIpData
  };

  c.set("geo", geo);
  await next();
});

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});

export default app;
