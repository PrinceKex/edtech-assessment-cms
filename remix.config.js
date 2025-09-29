/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  appDirectory: "app",
  ignoredRouteFiles: ["**/.*"],
  watchPaths: ["./public"],
  // Using default server configuration
  // server: "./app/entry.server.tsx",
  // serverBuildPath: "build/index.js",
  publicPath: "/build/",
  serverModuleFormat: "cjs",
  tailwind: true,
  postcss: true
};
