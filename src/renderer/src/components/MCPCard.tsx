import { MCPServer } from '../data/mcps'

interface MCPCardProps {
  mcp: MCPServer
  installed: boolean
  onClick: () => void
}

const CATEGORY_COLORS: Record<string, string> = {
  productivity: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  development: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  data: 'bg-green-500/20 text-green-300 border-green-500/30',
  web: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  ai: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  system: 'bg-slate-500/20 text-slate-300 border-slate-500/30'
}

export function MCPCard({ mcp, installed, onClick }: MCPCardProps) {
  const catColor = CATEGORY_COLORS[mcp.category] ?? CATEGORY_COLORS.system

  return (
    <button
      onClick={onClick}
      className="group relative text-left bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 hover:border-indigo-500/50 rounded-xl p-5 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {/* Installed badge */}
      {installed && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          Installed
        </span>
      )}

      {/* Icon + name */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl leading-none">{mcp.iconEmoji}</span>
        <div className="min-w-0">
          <h3 className="font-semibold text-white text-base leading-tight truncate">{mcp.name}</h3>
          <p className="text-xs text-slate-400 truncate">by {mcp.author}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-300 line-clamp-2 mb-4 leading-relaxed">
        {mcp.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-xs font-medium border rounded-full px-2.5 py-0.5 capitalize ${catColor}`}
        >
          {mcp.category}
        </span>
        <div className="flex items-center gap-2">
          {mcp.requiresPython && (
            <TechBadge label="Python" color="text-yellow-400" />
          )}
          {mcp.requiresNode && (
            <TechBadge label="Node" color="text-green-400" />
          )}
          {mcp.stars && (
            <span className="text-xs text-slate-400 flex items-center gap-0.5">
              ⭐ {formatStars(mcp.stars)}
            </span>
          )}
        </div>
      </div>

      {/* Hover arrow */}
      <span className="absolute bottom-4 right-4 text-slate-600 group-hover:text-indigo-400 transition-colors text-sm">
        →
      </span>
    </button>
  )
}

function TechBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`text-xs font-mono ${color} opacity-75`}>{label}</span>
  )
}

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`
  return String(n)
}
