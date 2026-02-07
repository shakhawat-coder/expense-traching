import { prisma } from "../../lib/prisma";

const getUserDashboardSummary = async (userId: string) => {
    const [incomes, expenses] = await Promise.all([
        prisma.income.findMany({ where: { userId } }),
        prisma.expense.findMany({ where: { userId } }),
    ]);

    const totalIncome = incomes.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    const totalSavings = totalIncome - totalExpenses;

    // This month's expenses
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthExpenses = expenses
        .filter(e => new Date(e.date) >= startOfMonth)
        .reduce((sum, item) => sum + Number(item.amount), 0);

    return {
        totalIncome,
        totalExpenses,
        totalSavings,
        thisMonthExpenses,
    };
};

export const dashboardService = {
    getUserDashboardSummary,
};
