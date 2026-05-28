/*import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());

app.use(json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "API running",
  });
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});*/

import "dotenv/config";
import express, { json } from "express";
import cors from "cors";
import swaggerUi from 'swagger-ui-express'; // ADD THIS
import swaggerSpec from './config/swagger.js'; // ADD THIS

import authRoutes from "./routes/auth.routes.js";
import proposalsRoutes from "./routes/proposals.routes.js";

const app = express();

app.use(cors());
app.use(json());

// ADD THIS: Swagger UI Route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api/health", (req, res) => {
  res.json({ message: "API running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/proposals", proposalsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});