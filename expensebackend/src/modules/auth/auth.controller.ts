import { Request, Response } from "express";
import { authService } from "./auth.service";
import { apiError, apiResponse } from "../../utils/apiresponse";
import { prisma } from "../../lib/prisma";


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
    if (error.message === "Account suspended") {
      return apiError(res, 403, "Account suspended!Contact with admin");
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

const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return apiError(res, 401, "Not authorized");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user) {
      return apiError(res, 404, "User not found");
    }

    return apiResponse(res, 200, "User profile fetched successfully", user);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};

const signOut = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    return apiResponse(res, 200, "User signed out successfully");
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};

export const authController = {
  signUpUser,
  signIn,
  verifyEmail,
  getMe,
  signOut,
};
