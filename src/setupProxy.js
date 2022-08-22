const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(createProxyMiddleware('/api',{
        target: 'http://121.41.16.215:8081',
        changeOrigin: true,
        pathRewrite: {'^/api':'/api'}
    }),)
}