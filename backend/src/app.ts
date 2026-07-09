import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

const app: Application = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Request logging
app.use(morgan("dev"));

// Body parsing
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Cookies
app.use(cookieParser());

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "BookMyRun Backend Running 🚀",
  });
});

export default app;