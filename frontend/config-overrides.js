const BundleTracker = require("webpack-bundle-tracker");

module.exports = {
  webpack: (config, env) => {
    config.optimization.splitChunks.name = "vendors";

    if (env === "development") {
      const port = process.env.PORT ? process.env.PORT : 3000;
      config.output.publicPath = `http://localhost:${port}/`;

      config.plugins.push(
        new BundleTracker({
          path: __dirname,
          filename: "webpack-stats.dev.json",
        })
      );

      if (typeof config.entry === "string") {
        // since react-scripts 4, entry is no more an array by default
        config.entry = [config.entry];
      }
      config.entry = config.entry.filter(
        (x) => !x.includes("webpackHotDevClient")
      );
      config.entry.push(
        require.resolve("webpack-dev-server/client") +
          `?http://localhost:${port}`
      );
      config.entry.push(require.resolve("webpack/hot/dev-server"));
    } else if (env === "production") {
      config.output.publicPath = "/static/connect_access_bundles/";

      config.plugins.push(
        new BundleTracker({
          path: __dirname,
          filename: "webpack-stats.prod.json",
        })
      );
    }
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      config.headers = { "Access-Control-Allow-Origin": "*" };
      return config;
    };
  },
};
