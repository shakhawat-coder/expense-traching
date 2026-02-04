import express, { Express, Request, Response } from "express";
import cors from "cors";
import categoryRouter from "./modules/category/category.router";
import { userRouter } from "./modules/user/user.router";
import { incomeRouter } from "./modules/income/income.router";
import { expenseRouter } from "./modules/expense/expense.router";

const app: Express = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Expense Tracking API is running");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Category routes
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expenses", expenseRouter);

export default app;
