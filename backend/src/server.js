import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Não permitido pelo CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
    exposedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
    maxAge: 86400,
  }),
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  }),
);

app.use(generalLimiter);

app.use(cookieParser());

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dior API está rodando! ",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use(ErrorMiddleware.handleNotFound);
app.use(ErrorMiddleware.handleError);

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta https://localhost:${PORT}`);
  console.log(`Ambiente: ${config.nodeEnv}`);
  console.log(`Cookies httpOnly: ATIVOS`);
});

export default app;
