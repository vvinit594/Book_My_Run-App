import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { userContactService } from "../services/userContact.service";
import { sendSuccess } from "../utils/response";

export const requestEmailUpdate = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.requestEmailUpdate(req.user!.id);
  return sendSuccess(res, data, "OTP sent to your current email");
});

export const verifyCurrentEmail = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.verifyCurrentEmail(
    req.user!.id,
    String(req.body.otp ?? "")
  );
  return sendSuccess(res, data, "Current email verified");
});

export const sendNewEmailOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.sendNewEmailOtp(
    req.user!.id,
    String(req.body.newEmail ?? "")
  );
  return sendSuccess(res, data, "OTP sent to new email");
});

export const verifyNewEmail = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.verifyNewEmail(
    req.user!.id,
    String(req.body.newEmail ?? ""),
    String(req.body.otp ?? "")
  );
  return sendSuccess(res, data, "Email updated successfully");
});

export const requestPhoneUpdate = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.requestPhoneUpdate(req.user!.id);
  return sendSuccess(res, data, "OTP sent to your current phone");
});

export const verifyCurrentPhone = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.verifyCurrentPhone(
    req.user!.id,
    String(req.body.otp ?? "")
  );
  return sendSuccess(res, data, "Current phone verified");
});

export const sendNewPhoneOtp = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.sendNewPhoneOtp(
    req.user!.id,
    String(req.body.newPhone ?? "")
  );
  return sendSuccess(res, data, "OTP sent to new phone");
});

export const verifyNewPhone = asyncHandler(async (req: Request, res: Response) => {
  const data = await userContactService.verifyNewPhone(
    req.user!.id,
    String(req.body.newPhone ?? ""),
    String(req.body.otp ?? "")
  );
  return sendSuccess(res, data, "Phone updated successfully");
});
