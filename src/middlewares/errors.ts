import { HttpException } from "../exceptions/root";
import { Request, Response, NextFunction } from "express";

export const errorMiddleware = (error: HttpException, req: Request, res: Response, next: NextFunction) => {
    res.status(error.statusCode || 500).json({
        message: error.message || 'Something went wrong',
        errorCode: error.errorCode || null,
        errorStatus: error.statusCode,
        errors: error.errors || null,
    });
};