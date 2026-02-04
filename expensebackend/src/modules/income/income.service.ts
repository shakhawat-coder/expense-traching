import { prisma } from "../../lib/prisma";

interface AddIncome {
  amount: number;
  description?: string;
  date?: Date;
  userId: string;
  categoryId: string;
}

const addIncome = async (income: AddIncome) => {
  const addNew = await prisma.income.create({
    data: {
      amount: income.amount,
      description: income.description ?? null,
      date: income.date ? new Date(income.date) : new Date(),
      userId: income.userId,
      categoryId: income.categoryId,
    },
  });
  return addNew;
};

const getIncome = async (userId: string) => {
  const incomes = await prisma.income.findMany({
    where: { userId },
  });
  return incomes;
};
const updateIncome = async (id: string, incomeData: Partial<AddIncome>) => {
  const updatedIncome = await prisma.income.update({
    where: { id },
    data: incomeData,
  });
  return updatedIncome;
};
const deleteIncome = async (id: string) => {
  const deletedIncome = await prisma.income.delete({
    where: { id },
  });
  return deletedIncome;
};

export const incomeService = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};
