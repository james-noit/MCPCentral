# MCPCentral
MCPCentral aims to provide a centralized application to deploy and manage MCP Servers in Linux, MacOS and Windows computers.

## Features

- **Card-based catalog** — Browse 12+ popular MCP servers (MarkItDown, Filesystem, GitHub, Brave Search, PostgreSQL, SQLite, Puppeteer, Fetch, Memory, Sequential Thinking, Slack, Google Maps).
- **Collapsible sidebar** — Filter by category (Productivity, Development, Data & Storage, Web & Browser, AI & Reasoning, System) with full-text search.
- **MCP management modal** — Click any card to open a popup with:
  - **Download & Install** — runs the appropriate `pip install` / `npm install` / `uvx` command.
  - **Deploy** — starts the MCP server process in the background.
  - **Manage** — opens the install directory in your system file manager.
  - **Delete from disk** — removes the installed server with a confirmation prompt.
- **Cross-platform** — builds for macOS (DMG), Linux (AppImage / deb) and Windows 11 (NSIS installer).

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | [Electron](https://www.electronjs.org/) v33 |
| Build tool | [electron-vite](https://electron-vite.org/) v2 |
| UI | [React](https://react.dev/) 18 + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3 |
| Packaging | [electron-builder](https://www.electron.build/) v25 |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Development

```bash
npm install
npm run dev        # starts Electron in hot-reload mode
```

### Production build

```bash
npm run build      # compile to out/
npm run package    # create installer in release/
```

The packager will auto-detect your OS and produce the appropriate artifact (`.dmg` / `.AppImage` / `.exe`).

## Project Structure

```
src/
├── main/           # Electron main process (IPC handlers for MCP operations)
├── preload/        # Context bridge exposing mcpAPI to the renderer
└── renderer/
    └── src/
        ├── App.tsx
        ├── components/
        │   ├── Sidebar.tsx    # Collapsible category navigation + search
        │   ├── MCPCard.tsx    # Individual MCP card
        │   ├── MCPGrid.tsx    # Filtered grid of cards
        │   └── MCPModal.tsx   # Download / Deploy / Manage / Delete popup
        └── data/
            └── mcps.ts        # MCP catalog (name, description, install/start commands)
```

## Adding More MCP Servers

Edit `src/renderer/src/data/mcps.ts` and add an entry to the `MCP_CATALOG` array:

```ts
{
  id: 'my-server',
  name: 'My Server',
  description: 'Short description shown on the card.',
  longDescription: 'Longer description shown in the modal.',
  category: 'development',           // see MCPCategory type
  author: 'You',
  repoUrl: 'https://github.com/…',
  iconEmoji: '🔧',
  tags: ['tag1', 'tag2'],
  installCmd: 'npm install -g my-mcp-server',
  startCmd: 'npx my-mcp-server',
  requiresPython: false,
  requiresNode: true,
  version: '1.0.0'
}
```
