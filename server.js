import express from "express";
import path from "path";
import exphbs from "express-handlebars";
import webRoutes from "./route/webRoutes.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
const app = express(); // ✅ luôn đứng đầu
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== "production";

// fix __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ HANDLEBARS (DUY NHẤT 1 CONFIG)
const hbs = exphbs.create({
  defaultLayout: false,
  helpers: {
    json: (context) => JSON.stringify(context)
  }
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "View"));

// ✅ LIVE RELOAD
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

// static
app.use(express.static(path.join(__dirname)));
//api


app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const apiKey = (
      process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY || ""
    ).trim();

    if (!apiKey) {
      return res.status(500).json({
        error: {
          message:
            "Missing server API key. Set OPENROUTER_API_KEY (or OPENAI_API_KEY) in environment variables.",
        },
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(req.body)
      }
    );
   
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);

  } catch (error) {
    console.error("❌ Server AI error:", error);
    res.status(500).json({
      error: {
        message: "Server error"
      }
    });
  }
});

// routes
app.use("/", webRoutes);

// server
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on("error", (error) => {
  if (error && error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use.`);
    process.exit(1);
  }
  throw error;
});