import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middleware/auth.middleware";

const router = Router();
router.post("/signup", authController.signUpUser);
router.post("/signin", authController.signIn);
// sign out
router.post("/signout", authController.signOut);
router.get("/me", auth, authController.getMe);
router.post("/verify-email", authController.verifyEmail);
router.post("/change-password", auth, authController.changePassword);

export const authRouter = router;
