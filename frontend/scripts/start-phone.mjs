import { execSync, spawn } from "node:child_process";
import os from "node:os";

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

function adb(command) {
  return execSync(`adb ${command}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function hasPhysicalDevice() {
  try {
    adb("-d get-state");
    return true;
  } catch {
    return false;
  }
}

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return "YOUR_PC_IP";
}

function startExpo(args) {
  const child = spawn("npx expo start " + args.join(" "), {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
  });

  child.on("exit", (code) => process.exit(code ?? 0));
}

if (process.platform === "win32") {
  freePortWindows(PORT);
}

const lanIp = getLanIp();

if (hasPhysicalDevice()) {
  console.log("");
  console.log("Physical phone detected over USB.");
  console.log("Using adb reverse - bypasses Wi-Fi and firewall issues.");
  console.log("");

  try {
    adb("-d reverse --remove-all");
  } catch {
    // No existing reverse rules.
  }

  execSync("adb -d reverse tcp:8081 tcp:8081", { stdio: "inherit" });
  startExpo(["--localhost", "--clear"]);
} else {
  console.log("");
  console.log("No USB phone detected - using LAN mode.");
  console.log(`Your PC IP: ${lanIp}`);
  console.log(`Phone URL:  exp://${lanIp}:${PORT}`);
  console.log("");
  console.log("If the phone still fails to load:");
  console.log("  1. Connect phone via USB and enable USB debugging");
  console.log("  2. Run: npm run start:phone  (auto-switches to USB mode)");
  console.log("  3. In Expo Go: clear app cache, then scan QR again");
  console.log("  4. Ensure phone is on the SAME Wi-Fi (not mobile data)");
  console.log("  5. Update Expo Go from the Play Store");
  console.log("");

  startExpo(["--lan", "--clear"]);
}
