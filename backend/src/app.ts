import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";
import { uploadsRoot } from "./middleware/upload.middleware";

const app: Application = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(uploadsRoot));

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "BookMyRun Backend Running",
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api", apiRoutes);

app.use(errorHandler);

export default app;
