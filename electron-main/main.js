const path = require("path");
const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const { ProcessManager } = require("../deployer/process-manager");

const processManager = new ProcessManager({
  registryPath: path.resolve(__dirname, "../config/server-registry.json"),
  rootDir: path.resolve(__dirname, ".."),
});

let mainWindow;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 760,
    webPreferences: {
      preload: path.resolve(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.resolve(__dirname, "../renderer/index.html"));

  mainWindow.on("close", (event) => {
    if (isQuitting) {
      return;
    }

    const hasRunning = processManager
      .getStatuses()
      .some((server) => server.status === "running");

    if (!hasRunning) {
      return;
    }

    event.preventDefault();
    const choice = dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Cancel", "Close all services and exit", "Keep services running and exit"],
      defaultId: 1,
      cancelId: 0,
      message: "Do you want to close all running background services?",
    });

    if (choice === 1) {
      processManager.stopAllServers();
      isQuitting = true;
      mainWindow.close();
    } else if (choice === 2) {
      isQuitting = true;
      mainWindow.close();
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("servers:list", () => {
  return {
    catalog: processManager.getCatalog(),
    statuses: processManager.getStatuses(),
  };
});

ipcMain.handle("servers:deploy", async (_event, serverId) => {
  return processManager.deployServer(serverId);
});

ipcMain.handle("servers:stop", async (_event, serverId) => {
  return processManager.stopServer(serverId);
});

ipcMain.handle("servers:stopAll", async () => {
  return processManager.stopAllServers();
});

ipcMain.handle("servers:logs", async (_event, serverId, lines = 200) => {
  return processManager.getLogs(serverId, lines);
});
