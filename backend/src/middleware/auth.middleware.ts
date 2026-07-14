import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthUserContext {
  id: string;
  role: UserRole;
  email: string;
  phone: string;
  name: string | null;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserContext;
    }
  }
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const token = header.slice("Bearer ".length).trim();
    if (!token) {
      throw new AppError("Authentication required", 401, "UNAUTHORIZED");
    }

    const payload = verifyAccessToken(token);
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError("User not found", 401, "UNAUTHORIZED");
    }

    req.user = {
      id: user.id,
      role: user.role,
      email: user.email,
      phone: user.phone,
      name: user.name,
    };
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401, "UNAUTHORIZED"));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError("Insufficient permissions", 403, "FORBIDDEN"));
      return;
    }
    next();
  };
}
