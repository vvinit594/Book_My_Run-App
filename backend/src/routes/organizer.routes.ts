import { Router } from "express";
import * as organizerController from "../controllers/organizer.controller";
import { authenticate } from "../middleware/auth.middleware";
import { validateRequest } from "../middleware/errorHandler";
import { organizerProfileValidators } from "../validators/organizer.validators";

const router = Router();

router.use(authenticate);

router.get("/profile", organizerController.getProfile);
router.post(
  "/profile",
  organizerProfileValidators,
  validateRequest,
  organizerController.createProfile
);
router.put(
  "/profile",
  organizerProfileValidators,
  validateRequest,
  organizerController.updateProfile
);

export default router;
