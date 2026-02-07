import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiresponse";

interface DecodedToken {
    id: string;
    role: "USER" | "ADMIN";
    email: string;
}

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: DecodedToken;
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return apiError(res, 401, "No token provided, authorization denied");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret_key_change_in_production"
        ) as DecodedToken;

        req.user = decoded;
        next();
    } catch (error) {
        return apiError(res, 401, "Token is not valid");
    }
};

export const authorize = (...roles: ("USER" | "ADMIN")[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            return apiError(res, 401, "Not authorized");
        }

        if (!roles.includes(req.user.role)) {
            return apiError(res, 403, "You do not have permission to perform this action");
        }
        next();
    };
};

export default auth;
