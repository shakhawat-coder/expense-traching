import express from "express";
import { dashboardController } from "./dashboard.controller";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

router.get("/summary", auth, dashboardController.getSummary);

export const dashboardRouter = router;
