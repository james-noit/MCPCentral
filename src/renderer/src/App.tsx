import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { MCPGrid } from './components/MCPGrid'
import { MCPModal } from './components/MCPModal'
import { MCP_CATALOG, MCPServer, MCPCategory } from './data/mcps'
import './styles/index.css'

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<MCPCategory | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMCP, setSelectedMCP] = useState<MCPServer | null>(null)
  const [installedIds, setInstalledIds] = useState<Set<string>>(new Set())

  const isElectron = typeof window !== 'undefined' && !!window.mcpAPI

  // On startup, check which MCPs are already installed
  useEffect(() => {
    if (!isElectron) return
    const checkAll = async () => {
      const installed = new Set<string>()
      await Promise.all(
        MCP_CATALOG.map(async (mcp) => {
          const result = await window.mcpAPI.isInstalled(mcp.id)
          if (result) installed.add(mcp.id)
        })
      )
      setInstalledIds(installed)
    }
    checkAll()
  }, [isElectron])

  const handleInstallStatusChange = (mcpId: string, isInstalled: boolean) => {
    setInstalledIds((prev) => {
      const next = new Set(prev)
      if (isInstalled) {
        next.add(mcpId)
      } else {
        next.delete(mcpId)
      }
      return next
    })
  }

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-950/80 backdrop-blur-sm">
          <div>
            <h1 className="text-xl font-bold text-white">
              {selectedCategory === 'all'
                ? 'All MCP Servers'
                : MCP_CATALOG.find(() => true) && getCategoryLabel(selectedCategory)}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {installedIds.size > 0
                ? `${installedIds.size} server${installedIds.size === 1 ? '' : 's'} installed`
                : 'Click a card to download, deploy or manage an MCP server'}
            </p>
          </div>

          {!isElectron && (
            <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5">
              <span>⚠️</span>
              <span>Demo mode — run as Electron app for full functionality</span>
            </div>
          )}
        </header>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <MCPGrid
            servers={MCP_CATALOG}
            installedIds={installedIds}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectMCP={setSelectedMCP}
          />
        </div>
      </main>

      {/* MCP detail modal */}
      <MCPModal
        mcp={selectedMCP}
        onClose={() => setSelectedMCP(null)}
        onInstallStatusChange={handleInstallStatusChange}
      />
    </div>
  )
}

function getCategoryLabel(category: MCPCategory | 'all'): string {
  const labels: Record<MCPCategory | 'all', string> = {
    all: 'All MCP Servers',
    productivity: 'Productivity',
    development: 'Development',
    data: 'Data & Storage',
    web: 'Web & Browser',
    ai: 'AI & Reasoning',
    system: 'System'
  }
  return labels[category] ?? 'MCP Servers'
}
