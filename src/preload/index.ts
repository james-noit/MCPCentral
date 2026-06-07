import { contextBridge, ipcRenderer } from 'electron'

const api = {
  checkPrerequisites: () => ipcRenderer.invoke('mcp:check-prerequisites'),
  install: (mcp: { id: string; installCmd: string }) => ipcRenderer.invoke('mcp:install', mcp),
  isInstalled: (mcpId: string) => ipcRenderer.invoke('mcp:is-installed', mcpId),
  deploy: (mcp: { id: string; startCmd: string }) => ipcRenderer.invoke('mcp:deploy', mcp),
  delete: (mcpId: string) => ipcRenderer.invoke('mcp:delete', mcpId),
  openFolder: (mcpId: string) => ipcRenderer.invoke('mcp:open-folder', mcpId),
  getInstallDir: () => ipcRenderer.invoke('mcp:get-install-dir')
}

contextBridge.exposeInMainWorld('mcpAPI', api)
