import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    res.status(error.statusCode || 500).json({
        message: error.message || "Internal server error."
    });
};