import { Hono } from "hono";
import { type Variables, type Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.get("/", (c) => {
  const geo = c.var.geo;
  return c.json(geo);
});

// Original route for backward compatibility if needed, or just proof of life
app.get("/message", (c) => {
  return c.text("Hello Hono!");
});

export default app;
