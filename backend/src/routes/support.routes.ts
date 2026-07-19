import { Router } from "express";
import * as supportController from "../controllers/support.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/errorHandler";
import { ticketUpload } from "../middleware/upload.middleware";
import {
  createTicketValidators,
  ticketIdValidators,
} from "../validators/support.validators";

const router = Router();

router.use(authenticate);

router.get("/", supportController.listTickets);
router.post(
  "/",
  createTicketValidators,
  validateRequest,
  supportController.createTicket
);
router.get(
  "/:id",
  ticketIdValidators,
  validateRequest,
  supportController.getTicket
);
router.post(
  "/:id/attachments",
  ticketIdValidators,
  validateRequest,
  ticketUpload.array("files", 5),
  supportController.uploadAttachments
);

export default router;
