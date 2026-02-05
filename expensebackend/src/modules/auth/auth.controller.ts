import { Request, Response } from "express";
import { authService } from "./auth.service";
import { apiError, apiResponse } from "../../utils/apiresponse";

const signUpUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return apiError(res, 400, "All fields are required");
    }
    const newUser = await authService.signUpUser({ name, email, password });

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
    const user = await authService.signInUser(email, password);

    return apiResponse(res, 200, "User signed in successfully", user);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};

export const authController = {
  signUpUser,
  signIn,
};
