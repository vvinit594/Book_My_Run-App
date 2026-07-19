import path from "path";
import fs from "fs";
import multer from "multer";
import { AppError } from "../utils/AppError";

const uploadsRoot = path.join(process.cwd(), "uploads");
const ticketUploadsDir = path.join(uploadsRoot, "tickets");

fs.mkdirSync(ticketUploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, ticketUploadsDir);
  },
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new AppError("Only image uploads are allowed", 400, "INVALID_FILE"));
    return;
  }
  cb(null, true);
}

export const ticketUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
});

export { uploadsRoot, ticketUploadsDir };
