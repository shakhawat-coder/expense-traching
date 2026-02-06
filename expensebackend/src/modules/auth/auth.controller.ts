import { Request, Response } from "express";
import { authService } from "./auth.service";
import { apiError, apiResponse } from "../../utils/apiresponse";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return apiError(res, 400, "All fields are required");
    }
    const newUser = await authService.signUpUser({ name, email, password, role });

    return apiResponse(res, 201, "User created successfully", newUser);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};
const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return apiError(res, 400, "All fields are required");
    }
    const result = await authService.signInUser(email, password);

    res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return apiResponse(res, 200, "User signed in successfully", {
      user: result.user,
    });
  } catch (error: any) {
    if (error.message === "NOT_VERIFIED") {
      return apiResponse(res, 403, "Please verify your email", { needVerification: true });
    }
    return apiError(res, 500, error.message || "Internal server error");
  }
};

const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return apiError(res, 400, "Email and OTP are required");
    }
    const result = await authService.verifyOtp(email, otp);
    return apiResponse(res, 200, result.message);
  } catch (error: any) {
    return apiError(res, 400, error.message || "Invalid or expired OTP");
  }
};

export const authController = {
  signUpUser,
  signIn,
  verifyEmail,
};
