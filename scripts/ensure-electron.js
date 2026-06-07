const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const electronDir = path.join(rootDir, "node_modules", "electron");
const pathFile = path.join(electronDir, "path.txt");
const installScript = path.join(electronDir, "install.js");
const distDir = path.join(electronDir, "dist");

function getPlatformPath() {
  if (process.platform === "darwin") {
    return "Electron.app/Contents/MacOS/Electron";
  }
  if (process.platform === "win32") {
    return "electron.exe";
  }
  return "electron";
}

function writePathFileIfDistExists() {
  const platformPath = getPlatformPath();
  if (!fs.existsSync(distDir)) {
    return false;
  }
  fs.writeFileSync(pathFile, platformPath);
  return true;
}

if (fs.existsSync(pathFile)) {
  process.exit(0);
}

if (!fs.existsSync(installScript)) {
  console.error("Electron install script not found. Run `npm install` first.");
  process.exit(1);
}

console.log("Electron binary metadata missing. Reinstalling Electron binary...");
execFileSync(process.execPath, [installScript], {
  cwd: rootDir,
  stdio: "inherit",
});

if (!fs.existsSync(pathFile) && writePathFileIfDistExists()) {
  console.log("Recreated Electron path metadata.");
}

if (!fs.existsSync(pathFile)) {
  console.error("Electron binary metadata still missing after reinstall.");
  process.exit(1);
}
