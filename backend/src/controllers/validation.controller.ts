import { Request, Response } from "express";
import { asyncHandler } from "../middleware/errorHandler";
import { validateGstAgainstPan } from "../utils/indiaIds";
import { sendSuccess } from "../utils/response";
import { AppError } from "../utils/AppError";

export const validateGst = asyncHandler(async (req: Request, res: Response) => {
  const gstNumber = String(req.body.gstNumber ?? "");
  const panNumber = String(req.body.panNumber ?? "");

  const result = validateGstAgainstPan(gstNumber, panNumber);
  if (!result.valid) {
    throw new AppError(
      result.message || "Invalid GST Number.",
      400,
      "GST_VALIDATION_FAILED",
      { valid: false }
    );
  }

  return sendSuccess(res, { valid: true }, "GST Number is valid");
});
