import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

import userRouter from "./routes/user_routes.js";
import categoryRouter from "./routes/category_routes.js";
import walletRouter from "./routes/wallet_routes.js";
import expenseRouter from "./routes/expense_routes.js";
import incomeRouter from "./routes/income_routes.js";
import dashboardRouter from "./routes/dashboard_routes.js";
import analyticsRouter from "./routes/analytics_routes.js";
import budgetRouter from "./routes/budget_routes.js";

import { errorHandler } from "./middlewares/error_middleware.js";
import { notFoundHandler } from "./middlewares/not_found_middleware.js";
import { generalLimiter } from "./middlewares/rate_limiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Adding helmet() is a single line that applies many security headers at once
app.use(helmet());


const corsOptions = {
  // Only allow requests from the origin defined in .env
  origin: process.env.ALLOWED_ORIGIN,

  // Allow these HTTP methods from the browser
  methods: ["GET", "POST", "PUT", "DELETE"],

  // Allow the browser to send cookies or authorization headers
  credentials: true,
};

app.use(cors(corsOptions));

app.use(generalLimiter);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the BudgetWise API!");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/wallets", walletRouter);
app.use("/api/v1/expenses", expenseRouter);
app.use("/api/v1/incomes", incomeRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/analytics", analyticsRouter);
app.use("/api/v1/budgets", budgetRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
