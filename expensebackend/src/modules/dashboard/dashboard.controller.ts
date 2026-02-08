import { Request, Response } from "express";
import { apiError, apiResponse } from "../../utils/apiresponse";
import { dashboardService } from "./dashboard.service";

const getSummary = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return apiError(res, 401, "Unauthorized");
        }

        const summary = await dashboardService.getUserDashboardSummary(userId);
        return apiResponse(res, 200, "Dashboard summary fetched successfully", summary);
    } catch (error: any) {
        return apiError(res, 500, error.message || "Internal Server Error");
    }
};

const getAdminSummary = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || user.role !== "ADMIN") {
            return apiError(res, 403, "Access denied");
        }

        const summary = await dashboardService.getAdminDashboardSummary();
        return apiResponse(res, 200, "Admin dashboard summary fetched successfully", summary);
    } catch (error: any) {
        return apiError(res, 500, error.message || "Internal Server Error");
    }
};

const getCategoryWiseExpense = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const { month, year } = req.query;

        if (!userId) {
            return apiError(res, 401, "Unauthorized");
        }

        const data = await dashboardService.getCategoryWiseExpense(userId, {
            month: month as string,
            year: year as string,
        });

        return apiResponse(res, 200, "Category wise expense fetched successfully", data);
    } catch (error: any) {
        return apiError(res, 500, error.message || "Internal server error");
    }
};

export const dashboardController = {
    getSummary,
    getAdminSummary,
    getCategoryWiseExpense,
};
