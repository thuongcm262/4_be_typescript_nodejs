import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad_requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntityException } from "../exceptions/validation";
import { SignupSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not_found";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    throw new NotFoundException('User not found', ErrorCode.USER_NOT_FOUND);
  }
  if (!compareSync(password, user.password)) {
    throw new BadRequestException('Incorrect password', ErrorCode.INCORRECT_PASSWORD);
  }
  const token = jwt.sign(
    {
      userId: user.id
    },
     JWT_SECRET
  );
  res.json({ user, token });
};

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
    SignupSchema.parse(req.body);
    const { email, password, name } = req.body;

  let user = await prismaClient.user.findUnique({
    where: {
      email: email,
    },
  });

  if (user) {
    next(new BadRequestException('User already exists', ErrorCode.USER_ALREADY_EXISTS));
  }
  user = await prismaClient.user.create({
    data: {
      email,
      password: hashSync(password, 10),
      name,
    },
  });
  res.json(user);
  } catch (error: any) {
    next(new UnprocessableEntityException('Unprocessable Entity', ErrorCode.UNPROCESSABLE_ENTITY, error?.issues) );
  }
};
  
export const me = async (req: Request, res:Response) => {
    res.json(req.user)
}