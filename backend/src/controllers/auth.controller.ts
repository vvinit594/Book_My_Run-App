import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../middleware/errorHandler";

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.signup({
    email: req.body.email,
    phone: req.body.mobile,
  });
  return sendSuccess(res, data, "OTP sent successfully", 201);
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.verifyOtp({
    email: req.body.email,
    phone: req.body.mobile,
    emailOtp: req.body.emailOtp,
    mobileOtp: req.body.mobileOtp,
  });
  return sendSuccess(res, data, "OTP verified successfully");
});

export const createPassword = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.createPassword({
    email: req.body.email,
    phone: req.body.mobile,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });
  return sendSuccess(res, data, "Account created successfully", 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.login({
    identifier: req.body.identifier,
    password: req.body.password,
  });
  return sendSuccess(res, data, "Login successful");
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  const data = await authService.logout();
  return sendSuccess(res, data, "Logged out successfully");
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const data = await authService.me(req.user!.id);
  return sendSuccess(res, data, "Current user");
});
