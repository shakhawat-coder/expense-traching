import { Request, Response } from "express";
import { apiError, apiResponse } from "../../utils/apiresponse";
import { expenseService } from "./expense.service";

const addExpense = async (req: Request, res: Response) => {
  try {
    const { amount, description, date, userId, categoryId } = req.body;

    if (!amount || !userId || !categoryId) {
      return apiError(res, 400, "Amount, userId, and categoryId are required");
    }
    const addNew = await expenseService.addExpense({
      amount,
      description,
      date,
      userId,
      categoryId,
    });
    return apiResponse(res, 201, "Expense added successfully", addNew);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};
const getExpense = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return apiError(res, 400, "User ID is required");
    }
    const expenses = await expenseService.getExpense(userId as string);
    return apiResponse(res, 200, "Expenses fetched successfully", expenses);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};
const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, date, userId, categoryId } = req.body;
    if (!id) {
      return apiError(res, 400, "Expense ID is required");
    }
    const updatedExpense = await expenseService.updateExpense(id as string, {
      amount,
      description,
      date,
      userId,
      categoryId,
    });
    return apiResponse(
      res,
      200,
      "Expense updated successfully",
      updatedExpense,
    );
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};
const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "Expense ID is required");
    }
    const deletedExpense = await expenseService.deleteExpense(id as string);
    return apiResponse(
      res,
      200,
      "Expense deleted successfully",
      deletedExpense,
    );
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};

export const expenseController = {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
};
