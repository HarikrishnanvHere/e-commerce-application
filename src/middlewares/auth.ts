import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRETKEY } from "../secret";
import { prismaClient } from "..";
import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  //1. extract the token from header
  const token = req.headers.authorization!;
  //2. If token is not present, throw unauthorized error
  if (!token) {
    next(new UnauthorizedException("Unathorized!", ErrorCode.UNAUTHORIZED));
  }
  try {
    //3. If token is present, verify it and extract the payload.
    const payload = jwt.verify(token, JWT_SECRETKEY) as any;
    //4. Get user form payload.
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizedException("Unathorized!", ErrorCode.UNAUTHORIZED));
    }
    //5.Attach user to the request object.
    req.user = user!;
//    console.log(req.user);
    next();
  } catch (err) {
    next(new UnauthorizedException("Unathorized!", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleWare;
