import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/errorHandler";
import {
  createPasswordValidators,
  loginValidators,
  signupValidators,
  verifyOtpValidators,
} from "../validators/auth.validators";

const router = Router();

router.post("/signup", signupValidators, validateRequest, authController.signup);
router.post(
  "/verify-otp",
  verifyOtpValidators,
  validateRequest,
  authController.verifyOtp
);
router.post(
  "/create-password",
  createPasswordValidators,
  validateRequest,
  authController.createPassword
);
router.post("/login", loginValidators, validateRequest, authController.login);
router.post("/logout", authenticate, authController.logout);
router.get("/me", authenticate, authController.me);

export default router;
