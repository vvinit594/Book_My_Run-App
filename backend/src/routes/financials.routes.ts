import { Router } from "express";
import * as financialsController from "../controllers/financials.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/errorHandler";
import {
  addBankAccountValidators,
  bankAccountIdValidators,
  linkEventValidators,
  unlinkEventValidators,
  updateBankAccountValidators,
} from "../validators/financials.validators";

const router = Router();

router.use(authenticate);

router.get("/bank-accounts", financialsController.listBankAccounts);
router.post(
  "/bank-accounts",
  addBankAccountValidators,
  validateRequest,
  financialsController.addBankAccount
);
router.put(
  "/bank-accounts/:id",
  updateBankAccountValidators,
  validateRequest,
  financialsController.updateBankAccount
);
router.delete(
  "/bank-accounts/:id",
  bankAccountIdValidators,
  validateRequest,
  financialsController.deleteBankAccount
);
router.post(
  "/bank-accounts/:id/default",
  bankAccountIdValidators,
  validateRequest,
  financialsController.setDefaultBank
);
router.post(
  "/bank-accounts/:id/link-event",
  linkEventValidators,
  validateRequest,
  financialsController.linkEvent
);
router.delete(
  "/bank-accounts/:id/link-event/:linkId",
  unlinkEventValidators,
  validateRequest,
  financialsController.unlinkEvent
);

export default router;
