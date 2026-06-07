import { useState } from 'react'
import { CATEGORIES, MCPCategory } from '../data/mcps'

interface SidebarProps {
  selectedCategory: MCPCategory | 'all'
  onSelectCategory: (cat: MCPCategory | 'all') => void
  searchQuery: string
  onSearchChange: (q: string) => void
}

export function Sidebar({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`flex flex-col bg-slate-900 border-r border-slate-700/50 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-0 flex-shrink-0`}
    >
      {/* Logo / header */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <span className="text-2xl flex-shrink-0">🔌</span>
        {!collapsed && (
          <span className="font-bold text-white text-lg tracking-tight truncate">MCPCentral</span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="ml-auto text-slate-400 hover:text-white transition-colors flex-shrink-0 p-1 rounded hover:bg-slate-700"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </button>
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-3 py-3">
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search MCPs…"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {!collapsed && (
          <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Categories
          </p>
        )}
        {CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id as MCPCategory | 'all')}
              title={cat.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/50'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <span className="text-base flex-shrink-0">{cat.emoji}</span>
              {!collapsed && <span className="truncate">{cat.label}</span>}
            </button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-700/50 p-3">
        {collapsed ? (
          <span className="block text-center text-slate-500 text-xs">⚙️</span>
        ) : (
          <p className="text-xs text-slate-500 text-center">MCPCentral v0.1.0</p>
        )}
      </div>
    </aside>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-4 h-4"
    >
      <path
        fillRule="evenodd"
        d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
        clipRule="evenodd"
      />
    </svg>
  )
}
