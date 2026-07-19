import { body, param } from "express-validator";

export const createTicketValidators = [
  body("type").trim().notEmpty().withMessage("Ticket type is required"),
  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ max: 200 })
    .withMessage("Subject is too long"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 5000 })
    .withMessage("Description is too long"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),
  body("eventName").optional({ nullable: true }).trim(),
];

export const ticketIdValidators = [param("id").isString().notEmpty()];
