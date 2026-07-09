import { CorsOptions } from "cors";

const DEFAULT_DEV_ORIGINS = [
  "http://localhost:8081",
  "http://localhost:19006",
  "http://127.0.0.1:8081",
  "http://127.0.0.1:19006",
];

function getAllowedOrigins(): string[] {
  const fromEnv = process.env.CORS_ORIGIN;
  if (!fromEnv || fromEnv.trim().length === 0) {
    return process.env.NODE_ENV === "production" ? [] : DEFAULT_DEV_ORIGINS;
  }

  return fromEnv
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    const allowedOrigins = getAllowedOrigins();

    // Non-browser clients (mobile apps, Postman, server-to-server) often send no Origin
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
