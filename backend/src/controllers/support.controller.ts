import { Request, Response } from "express";
import { supportService } from "../services/support.service";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../middleware/errorHandler";
import { param } from "../utils/params";

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const data = await supportService.createTicket(req.user!.id, req.body);
  return sendSuccess(res, data, "Support ticket created", 201);
});

export const listTickets = asyncHandler(async (req: Request, res: Response) => {
  const data = await supportService.listTickets(req.user!.id);
  return sendSuccess(res, data, "Support tickets");
});

export const getTicket = asyncHandler(async (req: Request, res: Response) => {
  const data = await supportService.getTicket(req.user!.id, param(req, "id"));
  return sendSuccess(res, data, "Support ticket details");
});

export const uploadAttachments = asyncHandler(
  async (req: Request, res: Response) => {
    const files = (req.files as Express.Multer.File[] | undefined) || [];
    const mapped = files.map((file) => ({
      fileName: file.originalname,
      fileUrl: `/uploads/tickets/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    }));

    const data = await supportService.addAttachments(
      req.user!.id,
      param(req, "id"),
      mapped
    );
    return sendSuccess(res, data, "Attachments uploaded");
  }
);
