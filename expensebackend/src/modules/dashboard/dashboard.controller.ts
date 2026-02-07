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

export const dashboardController = {
    getSummary,
};
