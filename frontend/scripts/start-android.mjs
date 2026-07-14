/**
 * Start Expo for Android emulators with ADB recovery.
 * Uses localhost + adb reverse so Pixel_3a (and any emulator) does not
 * depend on flaky LAN IPs while ADB is recovering.
 */
import { spawn, execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function runNode(script, args = []) {
  execSync(`node "${script}" ${args.join(" ")}`, {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
  });
}

runNode(path.join(__dirname, "free-metro-port.mjs"));
runNode(path.join(__dirname, "ensure-android.mjs"));

const child = spawn(
  "npx expo start --localhost --clear --android",
  {
    stdio: "inherit",
    shell: true,
    cwd: path.join(__dirname, ".."),
  }
);

child.on("exit", (code) => process.exit(code ?? 0));
