import { Router } from "express";
import authRoutes from "./auth.routes";
import organizerRoutes from "./organizer.routes";
import userRoutes from "./user.routes";
import validationRoutes from "./validation.routes";
import financialsRoutes from "./financials.routes";
import supportRoutes from "./support.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizer", organizerRoutes);
router.use("/user", userRoutes);
router.use("/validation", validationRoutes);
router.use("/financials", financialsRoutes);
router.use("/support/tickets", supportRoutes);

export default router;
