const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = 3000;
const HOST = "localhost";

const backendProxy = createProxyMiddleware({
    target: "http://localhost:8000",
    changeOrigin: true,
    pathRewrite: {'^/backend' : ''}
});

app.use('/backend', backendProxy);

app.use(express.static('/home/tina/Documents/projects/mongodb-browser/src/front-end/build/'))

app.listen(PORT, HOST, () => {
    console.log(`Starting Proxy at ${HOST}:${PORT}`);
});