import { Router } from "express";
import { body } from "express-validator";
import * as validationController from "../controllers/validation.controller";
import { validateRequest } from "../middleware/errorHandler";

const router = Router();

router.post(
  "/gst",
  [
    body("gstNumber").trim().notEmpty().withMessage("GST Number is required"),
    body("panNumber").trim().notEmpty().withMessage("PAN Number is required"),
  ],
  validateRequest,
  validationController.validateGst
);

export default router;
