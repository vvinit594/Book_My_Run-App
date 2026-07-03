import { execSync } from "node:child_process";
import os from "node:os";

const PORT = 8081;

function getLanIp() {
  const interfaces = os.networkInterfaces();
  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) {
        return entry.address;
      }
    }
  }
  return null;
}

function tryCommand(command) {
  try {
    return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return error.stderr?.toString().trim() || error.message;
  }
}

const lanIp = getLanIp();

console.log("BookMyRun phone connection check");
console.log("================================");
console.log(`PC LAN IP: ${lanIp ?? "not found"}`);
console.log(`Metro URL: exp://${lanIp ?? "YOUR_PC_IP"}:${PORT}`);
console.log("");

console.log("ADB devices:");
console.log(tryCommand("adb devices"));
console.log("");

const metroStatus = tryCommand(
  `powershell -NoProfile -Command "(Invoke-WebRequest -Uri 'http://127.0.0.1:${PORT}/status' -UseBasicParsing -TimeoutSec 3).Content"`
);
console.log(`Metro on port ${PORT}: ${metroStatus.includes("running") ? "running" : metroStatus || "not running"}`);
console.log("");

console.log("Recommended fix (most reliable):");
console.log("  1. Plug phone into PC via USB");
console.log("  2. On phone: Settings > Developer options > USB debugging ON");
console.log("  3. Tap Allow when phone asks to trust this PC");
console.log("  4. Run: npm run start:phone");
console.log("");

console.log("On phone before scanning QR:");
console.log("  - Force-close Expo Go");
console.log("  - Settings > Apps > Expo Go > Storage > Clear cache");
console.log("  - Update Expo Go from Play Store");
