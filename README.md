# MCP Server Manager Daemon Utility (Initial Scaffold)

MCPCentral is an Electron-based desktop utility scaffold for deploying and managing MCP-related services as background processes.

## Current Scaffold Capabilities

- Desktop control panel (Electron + secure preload bridge)
- Server registry (`/config/server-registry.json`)
- Background process deployment and stop controls
- Per-server log files under `~/.mcpcentral/logs`
- Built-in local MCP test server (`deployer/test-mcp-server.js`) exposed at:
  - `http://127.0.0.1:3001/api/v1/health`

## Prerequisites

- Node.js 22.12+ (required by current Electron dependency)
- npm

## Install

```bash
npm install
```

## Run (Development)

```bash
npm run dev
```

In the UI, start **Local Test MCP Server** and verify:

```bash
curl http://127.0.0.1:3001/api/v1/health
```

## Scripts

- `npm run dev` — run Electron app
- `npm run test` — run Node tests
- `npm run build` — generate scaffold build output in `out/`
- `npm run package` — alias for build in this scaffold

## Project Structure

```text
MCPCentral/
├── config/
│   └── server-registry.json
├── deployer/
│   ├── process-manager.js
│   ├── node-handler.js
│   ├── python-handler.py
│   └── test-mcp-server.js
├── electron-main/
│   ├── main.js
│   └── preload.js
├── renderer/
│   ├── index.html
│   └── renderer.js
└── tests/
    └── process-manager.test.js
```
