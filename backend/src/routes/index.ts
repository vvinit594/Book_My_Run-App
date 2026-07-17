import { Router } from "express";
import authRoutes from "./auth.routes";
import organizerRoutes from "./organizer.routes";
import userRoutes from "./user.routes";
import validationRoutes from "./validation.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizer", organizerRoutes);
router.use("/user", userRoutes);
router.use("/validation", validationRoutes);

export default router;
