import { Request, Response } from "express";

import { apiError, apiResponse } from "../../utils/apiresponse";
import { categoryService } from "./category.service";

const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, type } = req.body;
    if (!name || !type) {
      return apiError(res, 400, "Category name and type are required");
    }
    const newCategory = await categoryService.createCategory({ name, type });

    apiResponse(res, 201, "Category created successfully", newCategory);
  } catch (error: any) {
    return apiError(res, 500, error.message);
  }
};

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return apiResponse(res, 200, "Categories fetched successfully", categories);
  } catch (error: any) {
    return apiError(res, 500, error.message);
  }
};
const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "Category ID is required");
    }
    const category = await categoryService.getCategoryById(id as string);
    if (!category) {
      return apiError(res, 404, "Category not found");
    }
    return apiResponse(res, 200, "Category fetched successfully", category);
  } catch (error: any) {
    return apiError(res, 500, error.message);
  }
};
const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    if (!id) {
      return apiError(res, 400, "Category ID is required");
    }
    const updatedCategory = await categoryService.updateCategory(id as string, {
      name,
      type,
    });
    if (!updatedCategory) {
      return apiError(res, 404, "Category not found");
    }
    return apiResponse(
      res,
      200,
      "Category updated successfully",
      updatedCategory,
    );
  } catch (error: any) {
    return apiError(res, 500, error.message);
  }
};
const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return apiError(res, 400, "Category ID is required");
    }
    await categoryService.deleteCategory(id as string);
    return apiResponse(res, 200, "Category deleted successfully");
  } catch (error: any) {
    return apiError(res, 500, error.message);
  }
};

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
