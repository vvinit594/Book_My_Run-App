/**
 * Start Expo for Android after ADB/emulator is healthy.
 * Avoids Expo's "TCP port 5554 refused" race by waiting for a fully
 * booted emulator BEFORE asking Expo to open Android.
 */
import { spawn, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runNode(script, args = []) {
  execSync(`node "${script}" ${args.join(" ")}`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
}

function adb(args) {
  return execSync(`adb ${args}`, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function hasExpoGo() {
  try {
    return adb("shell pm path host.exp.exponent").includes("package:");
  } catch {
    return false;
  }
}

runNode(path.join(__dirname, "free-metro-port.mjs"));
runNode(path.join(__dirname, "ensure-android.mjs"));

if (!hasExpoGo()) {
  console.error("");
  console.error("Install Expo Go on the emulator from the Play Store, then re-run:");
  console.error("  npm run start:android");
  console.error("");
  process.exit(1);
}

// Start Metro first (no --android) so Expo does not race a half-booted emulator.
const child = spawn("npx expo start --localhost --clear", {
  stdio: "inherit",
  shell: true,
  cwd: path.join(__dirname, ".."),
});

// After Metro has a moment to bind, open Expo Go via ADB reverse URL.
void (async () => {
  await delay(8000);
  try {
    adb("reverse tcp:8081 tcp:8081");
    adb("reverse tcp:5000 tcp:5000");
    adb('shell am start -a android.intent.action.VIEW -d "exp://127.0.0.1:8081"');
    console.log("Opened exp://127.0.0.1:8081 on the emulator.");
  } catch (error) {
    console.warn(
      "Metro is running. Open Expo Go manually and enter exp://127.0.0.1:8081"
    );
    console.warn(String(error.message || error));
  }
})();

child.on("exit", (code) => process.exit(code ?? 0));
