const path = require("path");
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const analyzeRoute = require("./routes/analyze");

const app = express();

// 1. Security headers
app.use(helmet());

// 2. Only accept small JSON bodies (a password never needs more than 1 KB)
app.use(express.json({ limit: "1kb" }));

// 3. Rate limit: max 60 requests per minute per IP
app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Please slow down." },
  })
);

// 4. Routes
app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/analyze", analyzeRoute);

// 5. Serve the frontend (client folder)
app.use(express.static(path.join(__dirname, "..", "..", "client")));

// 6. Error handler: generic message only, never echo the request body
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ error: "Invalid request body" });
  }
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
