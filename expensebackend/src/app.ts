import express, { Express, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/user/user.router";
import { incomeRouter } from "./modules/income/income.router";
import { expenseRouter } from "./modules/expense/expense.router";
import { categoryRouter } from "./modules/category/category.router";
import { authRouter } from "./modules/auth/auth.router";
import { dashboardRouter } from "./modules/dashboard/dashboard.router";

const app: Express = express();

// CORS configuration to support credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // Allow cookies to be sent
  })
);

app.use(express.json());
app.use(cookieParser()); // Parse cookies from requests

app.get("/", (req: Request, res: Response) => {
  res.send("Expense Tracking API is running");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Category routes
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/income", incomeRouter);
app.use("/api/expenses", expenseRouter);

export default app;
