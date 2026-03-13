const express = require("express");
const path = require("path");

const router = express.Router();

const pages = {
  "/": "index.html",
  "/ticket": "ticket.html",
  "/shopping": "shopping.html",
  "/user": "user.html",
  "/map-game": "map-game.html",
  "/game": "game.html",
  "/cart": "cart.html",
  "/scanner": "scanner.html",
};

Object.entries(pages).forEach(([routePath, fileName]) => {
  router.get(routePath, (req, res) => {
    res.sendFile(path.join(__dirname, "..", "View", fileName));
  });
});

const legacyRedirects = {
  "/index.html": "/",
  "/ticket.html": "/ticket",
  "/shopping.html": "/shopping",
  "/user.html": "/user",
  "/map-game.html": "/map-game",
  "/game.html": "/game",
  "/cart.html": "/cart",
  "/scanner.html": "/scanner",
  "/View/index.html": "/",
  "/View/ticket.html": "/ticket",
  "/View/shopping.html": "/shopping",
  "/View/user.html": "/user",
  "/View/map-game.html": "/map-game",
  "/View/game.html": "/game",
  "/View/cart.html": "/cart",
  "/View/scanner.html": "/scanner",
};

Object.entries(legacyRedirects).forEach(([fromPath, toPath]) => {
  router.get(fromPath, (req, res) => {
    res.redirect(301, toPath);
  });
});

module.exports = router;
