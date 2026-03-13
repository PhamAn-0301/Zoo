const express = require("express");
const path = require("path");
const webRoutes = require("./route/webRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  const livereload = require("livereload");
  const connectLivereload = require("connect-livereload");
  const liveReloadServer = livereload.createServer({
    exts: ["html", "css", "js", "json", "hbs"],
  });

  [
    path.join(__dirname, "View"),
    path.join(__dirname, "assets"),
    path.join(__dirname, "assets1"),
    path.join(__dirname, "main.js"),
    path.join(__dirname, "style.css"),
  ].forEach((watchTarget) => {
    liveReloadServer.watch(watchTarget);
  });

  app.use(connectLivereload());
}

app.use(express.static(path.join(__dirname)));
app.use("/", webRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the existing process or use another PORT.`,
    );
    process.exit(1);
  }

  throw error;
});
