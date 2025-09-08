import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./exceptions/root";
import { InternalException } from "./exceptions/internal";
import { ZodError } from "zod";
import { BadRequestException } from "./exceptions/bad_requests";

export const errorHandler = (method: Function) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await method(req, res, next)
        } catch(error: any) {
            let exception: HttpException;
            if( error instanceof HttpException) {
                exception = error;
            } else {
                
                if( error instanceof ZodError) {
                    exception = new BadRequestException('Unprocessable entity.', ErrorCode.UNPROCESSABLE_ENTITY, error)
                } else {
                    console.log(error)
                    exception = new InternalException('Internal Server Error', ErrorCode.INTERNAL_SERVER_ERROR, 500, error);
                }
            }
            next(exception)
        }

    }
}