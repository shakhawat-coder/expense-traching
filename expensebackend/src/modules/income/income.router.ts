import express, { Router } from "express";
import { incomeController } from "./income.controller";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", auth, incomeController.addIncome);
router.get("/", auth, incomeController.getIncomeByUser);
router.get("/user/:userId", auth, incomeController.getIncome);
router.put("/:id", auth, incomeController.updateIncome);
router.delete("/:id", auth, incomeController.deleteIncome);

export const incomeRouter = router;

