import express from "express";
import dotenv from "dotenv";
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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
