const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("mcpManager", {
  listServers: () => ipcRenderer.invoke("servers:list"),
  deployServer: (serverId) => ipcRenderer.invoke("servers:deploy", serverId),
  stopServer: (serverId) => ipcRenderer.invoke("servers:stop", serverId),
  stopAllServers: () => ipcRenderer.invoke("servers:stopAll"),
  getLogs: (serverId, lines) => ipcRenderer.invoke("servers:logs", serverId, lines),
});
