import { body } from "express-validator";

export const organizerProfileValidators = [
  body("organizerName")
    .trim()
    .notEmpty()
    .withMessage("Organizer name is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Organizer name must be 2-120 characters"),
  body("supportEmail")
    .optional({ nullable: true, checkFalsy: true })
    .isEmail()
    .withMessage("Enter a valid support email"),
  body("websiteUrl")
    .optional({ nullable: true, checkFalsy: true })
    .isURL()
    .withMessage("Enter a valid website URL"),
];
