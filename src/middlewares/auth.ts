import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // giải mã token từ header
    const token = req.headers.authorization

    if (!token) {
        next(new UnauthorizedException('No token provided', ErrorCode.UNAUTHORIZED));
    }

    try {
        const payload = jwt.verify(token, JWT_SECRET) as any
        console.log("payload", payload);
        const user = await prismaClient.user.findFirst({where: {id: payload?.userId}})
        if (!user) {
            next(new UnauthorizedException('User not found', ErrorCode.UNAUTHORIZED));
            return;
        }
        console.log("user", user);
        req.user = user;
        next();
    } catch (error) {
        next(new UnauthorizedException('Invalid token', ErrorCode.UNAUTHORIZED));
    }

}

