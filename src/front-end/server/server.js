const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3000;
const HOST = "localhost";
const STATIC_HOME = process.env.STATIC_HOME

console.log('Static home address for express server:', STATIC_HOME)

const backendProxy = createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: {'^/backend' : ''}
});

app.use('/backend', backendProxy);

app.use(express.static(STATIC_HOME))

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});