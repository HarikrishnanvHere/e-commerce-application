import express, { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRETKEY } from "../secret";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { NotFoundException } from "../exceptions/not-found";

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  SignUpSchema.parse(req.body);
  const { name, email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email: email } });

  if (user) {
    new BadRequestException("User Already Exists!", ErrorCode.USER_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });
  res.status(200).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email: email } });

  if (!user) {
    throw new NotFoundException("User Not Found!", ErrorCode.USER_NOT_FOUND);
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw new BadRequestException("Incorrect Password!", ErrorCode.INCORRECT_PASSWORD);
  }

  const token = await jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRETKEY
  );
  res.status(200).json({ user, token });
};

export const me = async (req: Request, res: Response) => {
  res.status(200).json(req.user);
};
