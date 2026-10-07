import "dotenv/config";
import express, { json } from "express";
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

const app = express();

// CORS — allow your Vercel frontend and local dev
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://proposal-pro-gamma.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn("CORS blocked for origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options("*", cors(corsOptions));

app.use(json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API running" });
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
