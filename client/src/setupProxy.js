const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {

  // Use the following api route for member services
  app.use(
    ["/api/tm", "/api/tl", "/api/mgr"],
    createProxyMiddleware({
      target: "http://localhost:3001",
    })
  );

};
