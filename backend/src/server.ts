import { env } from "./config/env";
import prisma from "./config/prisma";
import app from "./app";

async function startServer() {
  try {
    await prisma.$connect();

    app.listen(env.port, "0.0.0.0", () => {
      console.log(`BookMyRun backend listening on port ${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
}

void startServer();
