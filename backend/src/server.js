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
const app = express();

app.use(cors());
app.use(json());

app.use(
"/api-docs",
swaggerUi.serve,
swaggerUi.setup(swaggerSpec)
);

app.get("/api/health", (req, res) => {
res.json({
success: true,
message: "API running",
});
});

app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/packages", packagesRoutes);
app.use("/api/templates", templatesRouter);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
console.log(
`Server running on port ${PORT}`
);

console.log(
`Swagger docs available at http://localhost:${PORT}/api-docs`
);
});
