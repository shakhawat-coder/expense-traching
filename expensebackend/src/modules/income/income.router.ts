import express, { Router } from "express";
import { incomeController } from "./income.controller";

const router = express.Router();

router.post("/", incomeController.addIncome);
router.get("/:userId", incomeController.getIncome);
router.put("/:id", incomeController.updateIncome);
router.delete("/:id", incomeController.deleteIncome);

export const incomeRouter = router;
