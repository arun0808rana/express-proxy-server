const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 5000; // You can change the port

// Allow CORS from any origin
app.use(cors());

// Proxy route
app.use('/api', createProxyMiddleware({
  target: 'https://partnersv1.pinbot.ai', // 🔁 Target server (the actual API)
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api from the URL path when forwarding
  },
}));

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});