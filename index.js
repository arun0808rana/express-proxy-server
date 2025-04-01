const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();
const cors = require("cors");
const jwtMiddleware = require("./auth");

const app = express();
const PORT = 5000; // You can change the port

// Replace with your actual secret key
const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.API_KEY;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET env missing");
}
if (!API_KEY) {
  throw new Error("API_KEY env missing");
}

// Allow CORS from any origin
app.use(cors());
app.use((req, res, next) => {
  if (req.path === "/health") return next();
  jwtMiddleware(req, res, next);
});

// Proxy route
app.use(
  "/proxy",
  createProxyMiddleware({
    target: "https://partnersv1.pinbot.ai", // 🔁 Target server (the actual API)
    changeOrigin: true,
    pathRewrite: {
      "^/proxy": "", // Remove /proxy from the URL path when forwarding
    },
    headers: {
      apikey: API_KEY,
    },
  })
);

app.get("/health", (req, res) => {
  res.send("Healthy");
});

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});
