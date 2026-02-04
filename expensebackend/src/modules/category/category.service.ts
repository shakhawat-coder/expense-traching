import { CategoryType } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

interface Category {
  name: string;
  type: CategoryType;
}

const createCategory = async (data: Category) => {
  try {
    const category = await prisma.category.create({
      data,
    });
    return category;
  } catch (error: any) {
    throw new Error("Category already exists or Type is invalid");
  }
};
const getAllCategories = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};
const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });
  return category;
};
const updateCategory = async (id: string, categoryData: Partial<Category>) => {
  const updatedCategory = await prisma.category.update({
    where: { id },
    data: categoryData,
  });
  return updatedCategory;
};
const deleteCategory = async (id: string) => {
  const deletedCategory = await prisma.category.delete({
    where: { id },
  });
  return deletedCategory;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
