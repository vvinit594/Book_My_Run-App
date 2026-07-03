import { execSync } from "node:child_process";

const PORT = 8081;

function freePortWindows(port) {
  try {
    const output = execSync(`netstat -ano | findstr ":${port}"`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });

    const pids = new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes("LISTENING"))
        .map((line) => line.split(/\s+/).at(-1))
        .filter(Boolean)
    );

    for (const pid of pids) {
      if (pid === "0") continue;
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
        console.log(`Freed port ${port} (stopped PID ${pid})`);
      } catch {
        // Process may have already exited.
      }
    }
  } catch {
    // No process is using the port.
  }
}

if (process.platform === "win32") {
  freePortWindows(PORT);
}
