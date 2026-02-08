import { Request, Response } from "express";
import { apiError, apiResponse } from "../../utils/apiresponse";
import { incomeService } from "./income.service";

const addIncome = async (req: Request, res: Response) => {
  try {
    const { amount, description, date, categoryId } = req.body;
    const userId = req.user?.id;

    if (!amount || !userId || !categoryId) {
      return apiError(res, 400, "Amount and categoryId are required");
    }
    const addNew = await incomeService.addIncome({
      amount,
      description,
      date,
      userId,
      categoryId,
    });
    return apiResponse(res, 201, "Income added successfully", addNew);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};

const getIncomeByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return apiError(res, 401, "Unauthorized");
    }
    const { month, year } = req.query;
    const income = await incomeService.getIncome(userId, { month: month as string, year: year as string });
    return apiResponse(res, 200, "Income fetched successfully", income);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};

const getIncome = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return apiError(res, 400, "User ID is required");
    }
    const income = await incomeService.getIncome(userId as string);
    return apiResponse(res, 200, "Income fetched successfully", income);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};

const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { amount, description, date, userId, categoryId } = req.body;
    if (!id) {
      return apiError(res, 400, "Income ID is required");
    }
    const updatedIncome = await incomeService.updateIncome(id as string, {
      amount,
      description,
      date,
      userId,
      categoryId,
    });
    return apiResponse(res, 200, "Income updated successfully", updatedIncome);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};
const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "Income ID is required");
    }
    const deletedIncome = await incomeService.deleteIncome(id as string);
    return apiResponse(res, 200, "Income deleted successfully", deletedIncome);
  } catch (error: any) {
    return apiError(res, 500, error.message || "Internal Server Error");
  }
};

export const incomeController = {
  addIncome,
  getIncomeByUser,
  getIncome,
  updateIncome,
  deleteIncome,
};
