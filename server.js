import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import webRoutes from "./route/webRoutes.js";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// fix __dirname trong ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine("handlebars", engine({ defaultLayout: false }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "View"));

if (isDev) {
  const livereload = (await import("livereload")).default;
  const connectLivereload = (await import("connect-livereload")).default;

  const liveReloadServer = livereload.createServer({
    exts: ["html", "css", "js", "json", "hbs", "handlebars"],
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