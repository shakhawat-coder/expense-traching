import express from "express";
import { dashboardController } from "./dashboard.controller";
import auth, { authorize } from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/summary", auth, authorize("USER"), dashboardController.getSummary);
router.get("/admin-summary", auth, authorize("ADMIN"), dashboardController.getAdminSummary);
router.get("/category-expense", auth, authorize("USER"), dashboardController.getCategoryWiseExpense);

export const dashboardRouter = router;
