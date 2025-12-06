import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
import config from "./config/config.js";

const app = express();

// CORS: allow dev & prod client origins
const allowedOrigins = [
  config.clientOrigin,
  "http://localhost:5173",
  "http://localhost:5174",
];

console.log("Allowed Origins:", allowedOrigins);

app.use(express.json());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman, curl, etc.

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);



app.get("/", (req, res) => {
  res.json({ status: "ok", env: config.env });
});

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);

connectDB()
  .then(() => {
    app.listen(config.port, () => {
      console.log(
        `🚀 Server running on port ${config.port} in ${config.env} mode`
      );
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
