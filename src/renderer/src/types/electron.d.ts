export interface MCPApi {
  checkPrerequisites: () => Promise<Record<string, boolean>>
  install: (mcp: { id: string; installCmd: string }) => Promise<{
    success: boolean
    stdout?: string
    stderr?: string
    error?: string
  }>
  isInstalled: (mcpId: string) => Promise<boolean>
  deploy: (mcp: { id: string; startCmd: string }) => Promise<{
    success: boolean
    pid?: number
    error?: string
  }>
  delete: (mcpId: string) => Promise<{ success: boolean; error?: string }>
  openFolder: (mcpId: string) => Promise<{ success: boolean }>
  getInstallDir: () => Promise<string>
}

declare global {
  interface Window {
    mcpAPI: MCPApi
  }
}
