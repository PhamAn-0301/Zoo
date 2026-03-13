const express = require("express");
const path = require("path");
const webRoutes = require("./route/webRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use("/", webRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
