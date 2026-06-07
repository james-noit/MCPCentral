import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'
import { exec, spawn } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#0f172a'
  })

  if (process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ──────────────────────────────────────────────
// IPC Handlers for MCP operations
// ──────────────────────────────────────────────

const getMcpInstallDir = (): string => {
  const base = app.getPath('userData')
  const dir = join(base, 'mcp-servers')
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  return dir
}

/** Check whether python / uvx / npx are available */
ipcMain.handle('mcp:check-prerequisites', async () => {
  const results: Record<string, boolean> = {}
  for (const cmd of ['python3', 'uvx', 'npx', 'node']) {
    try {
      await execAsync(`${cmd} --version`)
      results[cmd] = true
    } catch {
      results[cmd] = false
    }
  }
  return results
})

/** Download / install an MCP server */
ipcMain.handle('mcp:install', async (_event, mcp: { id: string; installCmd: string }) => {
  const dir = getMcpInstallDir()
  try {
    const { stdout, stderr } = await execAsync(mcp.installCmd, { cwd: dir })
    return { success: true, stdout, stderr }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error.message ?? String(err) }
  }
})

/** Check if an MCP is installed */
ipcMain.handle('mcp:is-installed', async (_event, mcpId: string) => {
  const dir = join(getMcpInstallDir(), mcpId)
  return existsSync(dir)
})

/** Launch / deploy an MCP server */
ipcMain.handle('mcp:deploy', async (_event, mcp: { id: string; startCmd: string }) => {
  const dir = join(getMcpInstallDir(), mcp.id)
  try {
    const parts = mcp.startCmd.split(' ')
    const child = spawn(parts[0], parts.slice(1), {
      cwd: existsSync(dir) ? dir : getMcpInstallDir(),
      detached: true,
      stdio: 'ignore'
    })
    child.unref()
    return { success: true, pid: child.pid }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error.message ?? String(err) }
  }
})

/** Delete an MCP server from disk */
ipcMain.handle('mcp:delete', async (_event, mcpId: string) => {
  const dir = join(getMcpInstallDir(), mcpId)
  try {
    if (existsSync(dir)) {
      await execAsync(`rm -rf "${dir}"`)
    }
    return { success: true }
  } catch (err: unknown) {
    const error = err as { message?: string }
    return { success: false, error: error.message ?? String(err) }
  }
})

/** Open MCP install directory in system file manager */
ipcMain.handle('mcp:open-folder', async (_event, mcpId: string) => {
  const dir = join(getMcpInstallDir(), mcpId)
  const target = existsSync(dir) ? dir : getMcpInstallDir()
  await shell.openPath(target)
  return { success: true }
})

/** Get the install directory path */
ipcMain.handle('mcp:get-install-dir', () => getMcpInstallDir())
