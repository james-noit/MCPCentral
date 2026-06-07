import { useState, useEffect, useCallback } from 'react'
import { MCPServer } from '../data/mcps'

type ActionStatus = 'idle' | 'running' | 'success' | 'error'

interface MCPModalProps {
  mcp: MCPServer | null
  onClose: () => void
  onInstallStatusChange: (mcpId: string, installed: boolean) => void
}

export function MCPModal({ mcp, onClose, onInstallStatusChange }: MCPModalProps) {
  const [installed, setInstalled] = useState(false)
  const [actionStatus, setActionStatus] = useState<ActionStatus>('idle')
  const [actionLog, setActionLog] = useState('')
  const [currentAction, setCurrentAction] = useState('')
  const [installDir, setInstallDir] = useState('')

  const isElectron = typeof window !== 'undefined' && !!window.mcpAPI

  const refreshInstallStatus = useCallback(async () => {
    if (!mcp || !isElectron) return
    const result = await window.mcpAPI.isInstalled(mcp.id)
    setInstalled(result)
  }, [mcp, isElectron])

  useEffect(() => {
    if (!mcp) return
    setActionStatus('idle')
    setActionLog('')
    setCurrentAction('')
    refreshInstallStatus()
    if (isElectron) {
      window.mcpAPI.getInstallDir().then(setInstallDir)
    }
  }, [mcp, isElectron, refreshInstallStatus])

  if (!mcp) return null

  const runAction = async (label: string, fn: () => Promise<{ success: boolean; stdout?: string; stderr?: string; error?: string; pid?: number }>) => {
    setCurrentAction(label)
    setActionStatus('running')
    setActionLog('')
    try {
      const result = await fn()
      if (result.success) {
        setActionStatus('success')
        const log = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
        setActionLog(log || `${label} completed successfully.`)
        await refreshInstallStatus()
        onInstallStatusChange(mcp.id, await window.mcpAPI.isInstalled(mcp.id))
      } else {
        setActionStatus('error')
        setActionLog(result.error ?? 'Unknown error.')
      }
    } catch (e: unknown) {
      setActionStatus('error')
      setActionLog(e instanceof Error ? e.message : String(e))
    }
  }

  const handleDownload = () =>
    runAction('Download & Install', () =>
      window.mcpAPI.install({ id: mcp.id, installCmd: mcp.installCmd })
    )

  const handleDeploy = () =>
    runAction('Deploy', () =>
      window.mcpAPI.deploy({ id: mcp.id, startCmd: mcp.startCmd })
    )

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${mcp.name} from disk? This cannot be undone.`)) return
    runAction('Delete', () => window.mcpAPI.delete(mcp.id))
  }

  const handleOpenFolder = async () => {
    if (isElectron) await window.mcpAPI.openFolder(mcp.id)
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-start gap-4 p-6 border-b border-slate-700/60">
          <span className="text-4xl leading-none flex-shrink-0">{mcp.iconEmoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-white">{mcp.name}</h2>
              <span className="text-xs text-slate-400 font-mono">v{mcp.version}</span>
              {installed && (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-2 py-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Installed
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 mt-0.5">by {mcp.author}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg p-1.5 transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">{mcp.longDescription}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {mcp.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-slate-800 border border-slate-700 text-slate-400 rounded-full px-2.5 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Install command */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Install command
            </p>
            <code className="block w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-indigo-300 break-all">
              {mcp.installCmd}
            </code>
          </div>

          {/* Start command */}
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Start command
            </p>
            <code className="block w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-green-300 break-all">
              {mcp.startCmd}
            </code>
          </div>

          {/* Install dir */}
          {installDir && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                Install directory
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-400 break-all truncate">
                  {installDir}
                </code>
                {isElectron && (
                  <button
                    onClick={handleOpenFolder}
                    className="flex-shrink-0 text-xs text-slate-400 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg px-3 py-2 transition-colors"
                  >
                    Open
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action log */}
          {actionLog && (
            <div
              className={`rounded-lg border px-3 py-2.5 text-xs font-mono whitespace-pre-wrap break-all max-h-32 overflow-y-auto ${
                actionStatus === 'error'
                  ? 'bg-red-950/40 border-red-700/50 text-red-300'
                  : 'bg-slate-950 border-slate-700 text-slate-300'
              }`}
            >
              {actionLog}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 px-6 pb-6">
          {/* Download / Install */}
          <ActionButton
            label={installed ? 'Reinstall' : 'Download & Install'}
            icon="⬇️"
            variant="primary"
            loading={actionStatus === 'running' && currentAction.startsWith('Download')}
            disabled={actionStatus === 'running'}
            onClick={isElectron ? handleDownload : undefined}
            demoMode={!isElectron}
          />

          {/* Deploy */}
          <ActionButton
            label="Deploy"
            icon="🚀"
            variant="success"
            loading={actionStatus === 'running' && currentAction === 'Deploy'}
            disabled={actionStatus === 'running' || (!isElectron && false)}
            onClick={isElectron ? handleDeploy : undefined}
            demoMode={!isElectron}
          />

          {/* Manage / Open folder */}
          <ActionButton
            label="Manage"
            icon="⚙️"
            variant="secondary"
            disabled={actionStatus === 'running'}
            onClick={isElectron ? handleOpenFolder : undefined}
            demoMode={!isElectron}
          />

          {/* GitHub */}
          <a
            href={mcp.repoUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg px-4 py-2.5 transition-colors"
          >
            🐙 GitHub
          </a>

          {/* Delete */}
          {installed && (
            <ActionButton
              label="Delete from disk"
              icon="🗑️"
              variant="danger"
              loading={actionStatus === 'running' && currentAction === 'Delete'}
              disabled={actionStatus === 'running'}
              onClick={isElectron ? handleDelete : undefined}
              demoMode={!isElectron}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  label: string
  icon: string
  variant: 'primary' | 'success' | 'secondary' | 'danger'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  demoMode?: boolean
}

const VARIANT_CLASSES: Record<string, string> = {
  primary: 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent',
  success: 'bg-emerald-600 hover:bg-emerald-500 text-white border-transparent',
  secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-transparent',
  danger: 'bg-red-700 hover:bg-red-600 text-white border-transparent'
}

function ActionButton({
  label,
  icon,
  variant,
  loading,
  disabled,
  onClick,
  demoMode
}: ActionButtonProps) {
  const handleClick = () => {
    if (demoMode) {
      alert(`[Demo] Action: ${label}\nRun MCPCentral as an Electron app to execute.`)
      return
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled && !demoMode}
      className={`flex items-center gap-2 text-sm font-medium border rounded-lg px-4 py-2.5 transition-all duration-150 ${
        VARIANT_CLASSES[variant]
      } ${disabled && !demoMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {loading ? (
        <span className="animate-spin">⟳</span>
      ) : (
        <span>{icon}</span>
      )}
      {label}
    </button>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="w-5 h-5"
    >
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  )
}
