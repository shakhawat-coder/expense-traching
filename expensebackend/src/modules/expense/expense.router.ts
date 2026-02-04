import express, { Router } from "express";
import { expenseController } from "./expense.controller";

const router = express.Router();

router.post("/", expenseController.addExpense);
router.get("/:userId", expenseController.getExpense);
router.put("/:id", expenseController.updateExpense);
router.delete("/:id", expenseController.deleteExpense);

export const expenseRouter = router;
