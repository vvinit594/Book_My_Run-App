import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;

async function startServer() {
  try {
    // Placeholder for future Prisma connection
    // await prisma.$connect();

    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`BookMyRun backend listening on port ${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();