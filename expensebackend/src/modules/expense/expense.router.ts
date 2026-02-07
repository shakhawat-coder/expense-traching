import express, { Router } from "express";
import { expenseController } from "./expense.controller";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, expenseController.addExpense);
router.get("/", auth, expenseController.getExpenseByUser);
router.get("/user/:userId", auth, expenseController.getExpense);
router.put("/:id", auth, expenseController.updateExpense);
router.delete("/:id", auth, expenseController.deleteExpense);

export const expenseRouter = router;

