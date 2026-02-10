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

const getAdminDashboardSummary = async () => {
    const now = new Date();
    // Start of today (00:00:00)
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [totalUsers, totalIncomeCount, totalExpenseCount, todaysIncomeCount, todaysExpenseCount, todaysJoinUser] = await Promise.all([
        prisma.user.count({
            where: {
                role: "USER"
            }
        }),
        prisma.income.count(),
        prisma.expense.count(),
        prisma.income.count({
            where: {
                date: {
                    gte: startOfToday
                }
            }
        }),
        prisma.expense.count({
            where: {
                date: {
                    gte: startOfToday
                }
            }
        }),
        prisma.user.count({
            where: {
                createdAt: {
                    gte: startOfToday
                }
            }
        })
    ]);

    return {
        totalUsers,
        totalTransactions: totalIncomeCount + totalExpenseCount,
        todaysTransactions: todaysIncomeCount + todaysExpenseCount,
        todaysJoinUser
    };
};

const getCategoryWiseExpense = async (userId: string, filter?: { month?: string | number, year?: string | number }) => {
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (filter?.month && filter?.year) {
        const month = Number(filter.month);
        const year = Number(filter.year);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const expenses = await prisma.expense.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lte: endDate
            }
        },
        include: {
            category: true
        }
    });

    const categoryMap = new Map<string, number>();

    expenses.forEach(expense => {
        const categoryName = expense.category?.name || "Uncategorized";
        const currentAmount = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, currentAmount + Number(expense.amount));
    });

    // Color palette for charts - distinct colors for categories
    const colors = [
        "#63f5ffff", // Red/Pink
        "#36A2EB", // Blue
        "#FFCE56", // Yellow
        "#4BC0C0", // Teal
        "#FF9F40", // Orange
        "#8AC926", // Green
        "#1982C4", // Dark Blue
        "#6A4C93", // Deep Purple
        "#00BBF9", // Sky Blue
        "#00F5D4", // Turquoise
        "#FEE440", // Bright Yellow
        "#F3722C", // Burnt Orange
    ];

    const result = Array.from(categoryMap.entries()).map(([category, amount], index) => ({
        category,
        amount,
        fill: colors[index % colors.length]
    }));

    return result;
};

const getAdminTransactionsTrend = async (filter?: { month?: string | number, year?: string | number }) => {
    const now = new Date();
    let startDate: Date, endDate: Date;

    if (filter?.month && filter?.year) {
        const month = Number(filter.month);
        const year = Number(filter.year);
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59, 999);
    } else {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    const [incomes, expenses] = await Promise.all([
        prisma.income.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { date: true }
        }),
        prisma.expense.findMany({
            where: {
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: { date: true }
        })
    ]);

    const dateMap = new Map<string, number>();

    // Initialize all days of the month with 0
    const daysInMonth = endDate.getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        dateMap.set(dateStr, 0);
    }

    incomes.forEach(inc => {
        const dateStr = inc.date.toISOString().split('T')[0]!;
        if (dateMap.has(dateStr)) {
            dateMap.set(dateStr, dateMap.get(dateStr)! + 1);
        }
    });

    expenses.forEach(exp => {
        const dateStr = exp.date.toISOString().split('T')[0]!;
        if (dateMap.has(dateStr)) {
            dateMap.set(dateStr, dateMap.get(dateStr)! + 1);
        }
    });

    const result = Array.from(dateMap.entries()).map(([date, count]) => ({
        date,
        transactions: count
    }));

    return result;
};

export const dashboardService = {
    getUserDashboardSummary,
    getAdminDashboardSummary,
    getCategoryWiseExpense,
    getAdminTransactionsTrend,
};
