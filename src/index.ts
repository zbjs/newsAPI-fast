const app = require("./app");
const dotenv = require("dotenv");
// require("./config/db");
const router = require("./routes");

dotenv.config();



app.use("/api", router)

// error handling middleware

// 404 not found middleware
app.use((_req, res, _next) => {
  return res.status(404).json({
    success: false,
    message: "Not found",
  });
});

// server error middleware
app.use((err, _req, res, _next) => {
  return res.status(500).json({
    success: false,
    message: err.message,
  });
});

// bad request middleware
app.use((err, _req, res, _next) => {
  return res.status(400).json({
    success: false,
    message: err.message,
  });
});