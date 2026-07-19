import { body, param } from "express-validator";

const IFSC = /^[A-Z]{4}0[A-Z0-9]{6}$/;

export const addBankAccountValidators = [
  body("accountHolderName").trim().notEmpty().withMessage("Account holder name is required"),
  body("accountNumber")
    .trim()
    .matches(/^\d{9,18}$/)
    .withMessage("Enter a valid account number"),
  body("ifscCode")
    .trim()
    .customSanitizer((v) => String(v || "").toUpperCase())
    .matches(IFSC)
    .withMessage("Enter a valid IFSC code"),
  body("bankName").trim().notEmpty().withMessage("Bank name is required"),
  body("branchName").optional({ nullable: true }).trim(),
  body("accountType")
    .optional()
    .isIn(["savings", "current"])
    .withMessage("Invalid account type"),
  body("isDefault").optional().isBoolean(),
];

export const updateBankAccountValidators = [
  param("id").isString().notEmpty(),
  body("accountHolderName").optional().trim().notEmpty(),
  body("accountNumber")
    .optional()
    .trim()
    .matches(/^\d{9,18}$/)
    .withMessage("Enter a valid account number"),
  body("ifscCode")
    .optional()
    .trim()
    .customSanitizer((v) => String(v || "").toUpperCase())
    .matches(IFSC)
    .withMessage("Enter a valid IFSC code"),
  body("bankName").optional().trim().notEmpty(),
  body("branchName").optional({ nullable: true }).trim(),
  body("accountType")
    .optional()
    .isIn(["savings", "current"])
    .withMessage("Invalid account type"),
];

export const bankAccountIdValidators = [param("id").isString().notEmpty()];

export const linkEventValidators = [
  param("id").isString().notEmpty(),
  body("eventName").trim().notEmpty().withMessage("Event name is required"),
  body("eventId").optional({ nullable: true }).trim(),
];

export const unlinkEventValidators = [
  param("id").isString().notEmpty(),
  param("linkId").isString().notEmpty(),
];
