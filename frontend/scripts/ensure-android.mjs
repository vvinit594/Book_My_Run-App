/**
 * Recover offline Android emulators / devices and set up port reverse.
 *
 * Usage:
 *   node scripts/ensure-android.mjs
 *   node scripts/ensure-android.mjs --avd Pixel_3a
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

async function waitForOnlineDevice(timeoutMs = 120000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const devices = listDevices();
    const online = devices.find((d) => d.state === "device");
    if (online) {
      try {
        const boot = adb(`-s ${online.id} shell getprop sys.boot_completed`).trim();
        if (boot === "1") return online;
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
  throw new Error("Timed out waiting for an online Android device/emulator.");
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

function openExpo(deviceId) {
  // With adb reverse, Expo Go should load localhost on the device.
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
  }

  console.log(`Online: ${online.id}`);
  setupReverse(online.id);

  if (SHOULD_OPEN) {
    openExpo(online.id);
  }

  console.log("");
  console.log("Ready. In Expo terminal press `a`, or run:");
  console.log("  npm run start:android");
  console.log("For physical phones: enable USB debugging + use the same Wi-Fi,");
  console.log("or USB + `npm run start:phone`.");
  console.log("");
}

main().catch((error) => {
  console.error("\nensure-android failed:", error.message || error);
  process.exit(1);
});
