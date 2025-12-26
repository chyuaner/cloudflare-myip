import { serve } from "@hono/node-server";
import { Hono } from "hono";
import app from "./app";
import { type Variables, type Bindings, type GeoData } from "./types";
import { initGeoIP, lookupIp } from "./services/node-geoip";

// Initialize GeoIP database on startup
initGeoIP();

const nodeApp = new Hono<{ Bindings: Bindings; Variables: Variables }>();

nodeApp.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  
  // Get IP from headers (behind proxy case) or socket
  // Note: getConnInfo helper from hono/adapter/node-server is better usage if available, 
  // currently simplified to headers or manual check.
  const forwarded = c.req.header("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"; // simplified fallback

  const geoIpData = lookupIp(ip);

  const geo: GeoData = {
    ip,
    hostname: url.hostname,
    ...geoIpData
  };

  c.set("geo", geo);
  await next();
});

nodeApp.route("/", app);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: nodeApp.fetch,
  port,
});

export default nodeApp;
