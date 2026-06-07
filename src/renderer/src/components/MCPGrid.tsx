import { MCPServer, MCPCategory } from '../data/mcps'
import { MCPCard } from './MCPCard'

interface MCPGridProps {
  servers: MCPServer[]
  installedIds: Set<string>
  selectedCategory: MCPCategory | 'all'
  searchQuery: string
  onSelectMCP: (mcp: MCPServer) => void
}

export function MCPGrid({
  servers,
  installedIds,
  selectedCategory,
  searchQuery,
  onSelectMCP
}: MCPGridProps) {
  const filtered = servers.filter((mcp) => {
    const matchCat = selectedCategory === 'all' || mcp.category === selectedCategory
    const q = searchQuery.toLowerCase().trim()
    const matchSearch =
      !q ||
      mcp.name.toLowerCase().includes(q) ||
      mcp.description.toLowerCase().includes(q) ||
      mcp.author.toLowerCase().includes(q) ||
      mcp.tags.some((t) => t.includes(q))
    return matchCat && matchSearch
  })

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 text-slate-500 gap-3 py-24">
        <span className="text-5xl">🔍</span>
        <p className="text-lg font-medium text-slate-400">No MCP servers found</p>
        <p className="text-sm">Try adjusting your search or category filter.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filtered.map((mcp) => (
        <MCPCard
          key={mcp.id}
          mcp={mcp}
          installed={installedIds.has(mcp.id)}
          onClick={() => onSelectMCP(mcp)}
        />
      ))}
    </div>
  )
}
