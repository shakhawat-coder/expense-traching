import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiresponse";

import { prisma } from "../lib/prisma";

interface DecodedToken {
    id: string;
    role: "USER" | "ADMIN";
    email: string;
    isSuspended?: boolean;
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
        let token = req.cookies.token;

        // Also check for Authorization header
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return apiError(res, 401, "No token provided, authorization denied");
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "fallback_secret_key_change_in_production"
        ) as DecodedToken;

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, role: true, email: true, isSuspended: true }
        });

        if (!user) {
            return apiError(res, 401, "User not found");
        }

        if (user.isSuspended) {
            return apiError(res, 403, "Account suspended");
        }

        req.user = user as DecodedToken;
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
