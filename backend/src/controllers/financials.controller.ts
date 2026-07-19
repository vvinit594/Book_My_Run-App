import { Request, Response } from "express";
import { financialsService } from "../services/financials.service";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../middleware/errorHandler";
import { param } from "../utils/params";

export const listBankAccounts = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await financialsService.listBankAccounts(req.user!.id);
    return sendSuccess(res, data, "Bank accounts");
  }
);

export const addBankAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await financialsService.addBankAccount(req.user!.id, req.body);
    return sendSuccess(res, data, "Bank account added", 201);
  }
);

export const updateBankAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await financialsService.updateBankAccount(
      req.user!.id,
      param(req, "id"),
      req.body
    );
    return sendSuccess(res, data, "Bank account updated");
  }
);

export const deleteBankAccount = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await financialsService.deleteBankAccount(
      req.user!.id,
      param(req, "id")
    );
    return sendSuccess(res, data, "Bank account deleted");
  }
);

export const setDefaultBank = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await financialsService.setDefaultBank(
      req.user!.id,
      param(req, "id")
    );
    return sendSuccess(res, data, "Default bank account updated");
  }
);

export const linkEvent = asyncHandler(async (req: Request, res: Response) => {
  const data = await financialsService.linkEvent(
    req.user!.id,
    param(req, "id"),
    req.body
  );
  return sendSuccess(res, data, "Event linked to bank account");
});

export const unlinkEvent = asyncHandler(async (req: Request, res: Response) => {
  const data = await financialsService.unlinkEvent(
    req.user!.id,
    param(req, "id"),
    param(req, "linkId")
  );
  return sendSuccess(res, data, "Event unlinked from bank account");
});
