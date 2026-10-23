import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import express, { json } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import authRoutes from "./routes/auth.routes.js";
import proposalRoutes from "./routes/proposal.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import packagesRoutes from "./routes/packages.routes.js";
import templatesRouter from "./routes/templates.routes.js";
import documentRoutes from "./routes/document.routes.js";
import shareRoutes from "./routes/share.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import notificationsRoutes from "./routes/notifications.routes.js";
import { runMigrations } from "./db/migrate.js";

const app = express();

// CORS — allow your Vercel frontend, env variables, and local dev
const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  process.env.CORS_ORIGIN,
]
  .filter(Boolean)
  .map((url) => url.replace(/\/$/, ""));

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://proposal-pro-gamma.vercel.app",
  ...envOrigins,
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);

    const cleanOrigin = origin.replace(/\/$/, "");
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    console.warn("CORS blocked for origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));



app.use(json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API running" });
});

app.get("/api/migrate", async (req, res) => {
  try {
    await runMigrations();
    res.json({ success: true, message: "Migrations executed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/templates", templatesRouter);
app.use("/api/documents", documentRoutes);
app.use("/api", shareRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/notifications", notificationsRoutes);

const PORT = process.env.PORT || 5000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at /api-docs`);
});
