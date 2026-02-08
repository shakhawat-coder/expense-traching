import { prisma } from "../../lib/prisma";

interface AddExpense {
  amount: number;
  description?: string;
  date?: Date;
  userId: string;
  categoryId: string;
}

const addExpense = async (expense: AddExpense) => {
  const addNew = await prisma.expense.create({
    data: {
      amount: expense.amount,
      description: expense.description ?? null,
      date: expense.date ? new Date(expense.date) : new Date(),
      userId: expense.userId,
      categoryId: expense.categoryId,
    },
  });
  return addNew;
};

const getExpense = async (userId: string, filter?: { month?: string | number, year?: string | number }) => {
  const where: any = { userId };

  if (filter?.month && filter?.year) {
    const month = Number(filter.month);
    const year = Number(filter.year);

    if (!isNaN(month) && !isNaN(year)) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      where.date = {
        gte: startDate,
        lte: endDate
      };
    }
  }

  const expenses = await prisma.expense.findMany({
    where,
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc'
    }
  });
  return expenses;
};
const updateExpense = async (id: string, expenseData: Partial<AddExpense>) => {
  const updatedExpense = await prisma.expense.update({
    where: { id },
    data: expenseData,
  });
  return updatedExpense;
};
const deleteExpense = async (id: string) => {
  const deletedExpense = await prisma.expense.delete({
    where: { id },
  });
  return deletedExpense;
};

export const expenseService = {
  addExpense,
  getExpense,
  updateExpense,
  deleteExpense,
};
