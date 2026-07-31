import express from "express";
import dotenv from "dotenv";

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

app.use("/users", userRouter);
app.use("/categories", categoryRouter);
app.use("/wallets", walletRouter);
app.use("/expenses", expenseRouter);
app.use("/incomes", incomeRouter);
app.use("/dashboard", dashboardRouter);
app.use("/analytics", analyticsRouter);
app.use("/budgets", budgetRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
