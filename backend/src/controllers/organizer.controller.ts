import { Request, Response } from "express";
import { organizerService } from "../services/organizer.service";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../middleware/errorHandler";

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = await organizerService.getProfile(req.user!.id);
  return sendSuccess(res, data, "Organizer profile");
});

export const createProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = await organizerService.createOrUpdateProfile(req.user!.id, req.body);
  return sendSuccess(res, data, "Organizer profile saved", 201);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const data = await organizerService.updateProfile(req.user!.id, req.body);
  return sendSuccess(res, data, "Organizer profile updated");
});
