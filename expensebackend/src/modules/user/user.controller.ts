import { Request, Response } from "express";
import { apiError, apiResponse } from "../../utils/apiresponse";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return apiError(res, 400, "All fields are required");
    }
    const user = await userService.createUser({ name, email, password, role });

    return apiResponse(res, 201, "User created successfully", user);
  } catch (error: any) {
    if (error.message === "User already created") {
      return apiError(res, 409, "User already created");
    }
    return apiError(res, 500, error.message || "Internal server error");
  }
};
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    if (users.length === 0) {
      return apiError(res, 404, "No users found");
    }
    return apiResponse(res, 200, "Users fetched successfully", users);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "User ID is required");
    }
    const user = await userService.getUserById(id as string);
    if (!user) {
      return apiError(res, 404, "User not found");
    }
    return apiResponse(res, 200, "User fetched successfully", user);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};
const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;
    if (!id) {
      return apiError(res, 400, "User ID is required");
    }
    const user = await userService.updateUser(id as string, {
      name,
      email,
      password,
      role,
    });
    return apiResponse(res, 200, "User updated successfully", user);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};
const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "User ID is required");
    }
    const user = await userService.deleteUser(id as string);
    return apiResponse(res, 200, "User deleted successfully", user);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal server error");
  }
};

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
