/**
 * Recover offline Android emulators / devices and set up port reverse.
 *
 * Usage:
 *   node scripts/ensure-android.mjs
 *   node scripts/ensure-android.mjs --avd Medium_Phone_API_36.1
 *   node scripts/ensure-android.mjs --open
 */
import { execSync, spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";
import { setTimeout as delay } from "node:timers/promises";

const PORTS = [8081, 5000];
const AVD_FROM_ARGS = process.argv.find((a) => a.startsWith("--avd="))?.slice(6)
  ?? (process.argv.includes("--avd")
    ? process.argv[process.argv.indexOf("--avd") + 1]
    : process.env.AVD_NAME);
const SHOULD_OPEN = process.argv.includes("--open");
const SDK = process.env.ANDROID_HOME
  || process.env.ANDROID_SDK_ROOT
  || path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");
const EMULATOR = path.join(SDK, "emulator", "emulator.exe");
const EXPO_GO_PACKAGE = "host.exp.exponent";

function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  }).trim();
}

function adb(args, opts = {}) {
  return run(`adb ${args}`, opts);
}

function listDevices() {
  try {
    const out = adb("devices");
    return out
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [id, state] = line.split(/\s+/);
        return { id, state };
      });
  } catch {
    return [];
  }
}

async function restartAdb() {
  try {
    adb("kill-server");
  } catch {
    // ignore
  }
  await delay(1000);
  adb("start-server");
  await delay(1500);
}

function listAvds() {
  try {
    return run(`"${EMULATOR}" -list-avds`)
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

async function killEmulators() {
  try {
    adb("emu kill");
  } catch {
    // ignore
  }
  await delay(2000);
  if (process.platform === "win32") {
    try {
      execSync("taskkill /IM qemu-system-x86_64.exe /F", { stdio: "ignore" });
    } catch {
      // ignore
    }
    try {
      execSync("taskkill /IM emulator.exe /F", { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  await delay(2000);
}

function pickAvd(preferred) {
  const avds = listAvds();
  if (!avds.length) {
    throw new Error("No Android Virtual Devices found. Create one in Android Studio.");
  }
  if (preferred && avds.includes(preferred)) return preferred;
  // Prefer AVDs that usually ship with Play Store for Expo Go installs
  if (avds.includes("Medium_Phone_API_36.1")) return "Medium_Phone_API_36.1";
  if (avds.includes("Pixel_3a")) return "Pixel_3a";
  return avds[0];
}

function bootAvd(avdName) {
  console.log(`Cold-booting AVD "${avdName}" (no snapshot)...`);
  spawn(
    EMULATOR,
    ["-avd", avdName, "-no-snapshot-load", "-netdelay", "none", "-netspeed", "full"],
    {
      detached: true,
      stdio: "ignore",
      windowsHide: true,
    }
  ).unref();
}

async function waitForOnlineDevice(timeoutMs = 180000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const devices = listDevices();
    const online = devices.find((d) => d.state === "device");
    if (online) {
      try {
        const boot = adb(`-s ${online.id} shell getprop sys.boot_completed`).trim();
        if (boot === "1") {
          // Extra settle time so Expo's ADB connect to :5554 does not race
          await delay(3000);
          return online;
        }
      } catch {
        // still booting
      }
    }
    const offline = devices.filter((d) => d.state === "offline");
    if (offline.length) {
      process.stdout.write(
        `Waiting... (${offline.map((d) => d.id).join(", ")} offline)\r`
      );
    } else {
      process.stdout.write("Waiting for emulator...\r");
    }
    await delay(3000);
  }
  throw new Error(
    "Timed out waiting for an online Android device/emulator. " +
      "Open Android Studio → Device Manager → cold boot the AVD, then retry."
  );
}

function setupReverse(deviceId) {
  for (const port of PORTS) {
    try {
      adb(`-s ${deviceId} reverse tcp:${port} tcp:${port}`);
      console.log(`adb reverse tcp:${port} -> host:${port}`);
    } catch (error) {
      console.warn(`Failed to reverse port ${port}:`, error.message || error);
    }
  }
}

function hasExpoGo(deviceId) {
  try {
    const pathOut = adb(`-s ${deviceId} shell pm path ${EXPO_GO_PACKAGE}`);
    return pathOut.includes("package:");
  } catch {
    return false;
  }
}

function openExpoGoPlayStore(deviceId) {
  try {
    adb(
      `-s ${deviceId} shell am start -a android.intent.action.VIEW -d "market://details?id=${EXPO_GO_PACKAGE}"`
    );
  } catch {
    // ignore
  }
}

function openExpo(deviceId) {
  const url = "exp://127.0.0.1:8081";
  console.log(`Opening ${url} on ${deviceId}...`);
  try {
    adb(
      `-s ${deviceId} shell am start -a android.intent.action.VIEW -d "${url}"`
    );
  } catch (error) {
    console.warn("Could not auto-open Expo Go. Open Expo Go and enter:", url);
    console.warn(String(error.message || error));
  }
}

async function main() {
  console.log("");
  console.log("BookMyRun Android device recovery");
  console.log("--------------------------------");

  await restartAdb();
  let devices = listDevices();
  console.log(
    "ADB devices:",
    devices.length
      ? devices.map((d) => `${d.id} (${d.state})`).join(", ")
      : "(none)"
  );

  let online = devices.find((d) => d.state === "device");
  const hasOffline = devices.some((d) => d.state === "offline");

  if (!online && (hasOffline || devices.length === 0)) {
    console.log("Device offline or missing — restarting emulator...");
    await killEmulators();
    await restartAdb();
    const avd = pickAvd(AVD_FROM_ARGS);
    bootAvd(avd);
    online = await waitForOnlineDevice();
  } else if (!online) {
    online = await waitForOnlineDevice();
  } else {
    // Even if listed as device, wait until boot completes
    online = await waitForOnlineDevice(60000);
  }

  console.log(`Online: ${online.id}`);
  setupReverse(online.id);

  if (!hasExpoGo(online.id)) {
    console.log("");
    console.log("Expo Go is NOT installed on this emulator.");
    console.log("Opening Play Store — install \"Expo Go\", then press `a` in Expo.");
    openExpoGoPlayStore(online.id);
    console.log("");
  } else if (SHOULD_OPEN) {
    openExpo(online.id);
  }

  console.log("Ready. Prefer:");
  console.log("  npm run start:android");
  console.log("Avoid pressing `a` until the emulator home screen is fully up.");
  console.log("");
}

main().catch((error) => {
  console.error("\nensure-android failed:", error.message || error);
  process.exit(1);
});
