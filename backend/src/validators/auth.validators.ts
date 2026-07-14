import { body } from "express-validator";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

export const signupValidators = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .custom((value) => EMAIL_REGEX.test(String(value).toLowerCase()))
    .withMessage("Enter a valid email address"),
  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .custom((value) => PHONE_REGEX.test(String(value).replace(/\D/g, "").slice(-10)))
    .withMessage("Enter a valid 10-digit mobile number"),
];

export const verifyOtpValidators = [
  ...signupValidators,
  body("emailOtp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Email OTP must be 6 digits"),
  body("mobileOtp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("Mobile OTP must be 6 digits"),
];

export const createPasswordValidators = [
  ...signupValidators,
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required"),
];

export const loginValidators = [
  body("identifier").trim().notEmpty().withMessage("Email or mobile is required"),
  body("password").notEmpty().withMessage("Password is required"),
];
