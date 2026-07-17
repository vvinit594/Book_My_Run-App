import { Router } from "express";
import { body } from "express-validator";
import * as userController from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/errorHandler";

const router = Router();

router.use(authenticate);

const otpValidator = body("otp")
  .trim()
  .isLength({ min: 6, max: 6 })
  .withMessage("OTP must be 6 digits");

router.post("/email/request-update", userController.requestEmailUpdate);
router.post(
  "/email/verify-current",
  [otpValidator],
  validateRequest,
  userController.verifyCurrentEmail
);
router.post(
  "/email/send-new-otp",
  [body("newEmail").trim().isEmail().withMessage("Enter a valid email")],
  validateRequest,
  userController.sendNewEmailOtp
);
router.post(
  "/email/verify-new",
  [
    body("newEmail").trim().isEmail().withMessage("Enter a valid email"),
    otpValidator,
  ],
  validateRequest,
  userController.verifyNewEmail
);

router.post("/phone/request-update", userController.requestPhoneUpdate);
router.post(
  "/phone/verify-current",
  [otpValidator],
  validateRequest,
  userController.verifyCurrentPhone
);
router.post(
  "/phone/send-new-otp",
  [body("newPhone").trim().notEmpty().withMessage("Phone is required")],
  validateRequest,
  userController.sendNewPhoneOtp
);
router.post(
  "/phone/verify-new",
  [
    body("newPhone").trim().notEmpty().withMessage("Phone is required"),
    otpValidator,
  ],
  validateRequest,
  userController.verifyNewPhone
);

export default router;
