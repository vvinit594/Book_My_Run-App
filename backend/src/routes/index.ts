import { Router } from "express";
import authRoutes from "./auth.routes";
import organizerRoutes from "./organizer.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/organizer", organizerRoutes);

export default router;
