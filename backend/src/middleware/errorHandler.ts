import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError";
import { sendError } from "../utils/response";

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validateRequest(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(
      new AppError("Validation failed", 422, "VALIDATION_ERROR", errors.array())
    );
    return;
  }
  next();
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  if (err instanceof Error && err.message.startsWith("CORS blocked")) {
    return sendError(res, err.message, 403, "CORS_ERROR");
  }

  console.error(err);
  return sendError(res, "Internal server error", 500, "INTERNAL_ERROR");
}
