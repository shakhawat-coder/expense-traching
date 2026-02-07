import { Router } from "express";
import { categoryController } from "./category.controller";
import auth, { authorize } from "../../middleware/auth.middleware";

const router = Router();

router.post("/", auth, authorize("ADMIN"), categoryController.createCategory);
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);
router.put("/:id", auth, authorize("ADMIN"), categoryController.updateCategory);
router.delete("/:id", auth, authorize("ADMIN"), categoryController.deleteCategory);




export const categoryRouter = router;
