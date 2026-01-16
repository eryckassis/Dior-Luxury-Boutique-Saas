import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { config } from "./config/env.js";
import { generalLimiter } from "./middlewares/rateLimiter.middleware.js";
import { ErrorMiddleware } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

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
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeader: ["Content-Type", "Authorization"],
    maxAge: 86400,
  })
);
// Helmet: Protege contra vulnerabilidades conhecidas
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

// Rate limiting geral
app.use(generalLimiter);

// ============================================================================
// MIDDLEWARES DE PARSING
// ============================================================================

// Parse JSON bodies
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================================================
// LOGGING
// ============================================================================

// Morgan: HTTP request logger (apenas em desenvolvimento)
if (config.nodeEnv === "development") {
  app.use(morgan("dev"));
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Dior API está rodando! 🚀",
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
  });
});

// ============================================================================
// ROTAS DA API
// ============================================================================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ============================================================================
// TRATAMENTO DE ERROS
// ============================================================================

// Rota não encontrada (404)
app.use(ErrorMiddleware.handleNotFound);

// Handler global de erros (deve ser o último middleware)
app.use(ErrorMiddleware.handleError);

// ============================================================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================================================

const PORT = config.port;

app.listen(PORT, () => {
  console.log("\n🚀 ================================");
  console.log(`✅ Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log("🔐 Rotas de Auth: /api/auth");
  console.log("================================\n");
});

// Tratamento de erros não capturados
process.on("unhandledRejection", (err) => {
  console.error("❌ UNHANDLED REJECTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("❌ UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err);
  process.exit(1);
});

export default app;
