import { Request, Response, NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";

const adminMiddleWare = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorizedException("Unathorized!", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleWare;
