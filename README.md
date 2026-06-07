# 🚀 MCP Server Manager Daemon Utility



![Status-Alpha%20Release-orange](file://https://img.shields.io/badge/Status-Alpha%20Release-orange)

[

![License-MIT-blue](file://https://img.shields.io/badge/License-MIT-blue)
](./LICENSE)

## 📄 Overview

The **MCP Server Manager** is a sophisticated, cross-platform desktop utility designed to manage and deploy robust Machine Capability Platform (MCP) servers as background services. It provides developers with a centralized graphical interface for discovering, deploying, and managing diverse open-source utilities found across online MCP repositories.

Unlike simple client applications, the MCP Server Manager operates by **daemonizing** deployed services, ensuring they run reliably in the background as dedicated API endpoints. The GUI serves as the control panel—allowing users to start, stop, monitor logs, and interact with these powerful backend processes without manual system configuration.

**Target Users:** Professional developers and advanced technical users who require centralized access to multiple disparate open-source APIs across various operating systems (Windows, macOS, Linux).

## ✨ Core Features

*   **Centralized Daemon Control:** Provides a single dashboard to view the status of all deployed MCP services, treating them as controllable background processes.
*   **API Gateway Management:** Automatically deploys each server into an isolated virtual environment and exposes it as a dedicated local API endpoint (e.g., `http://localhost:3001/api/run`).
*   **Adaptive Deployment Engine:** The core logic automatically detects the required runtime (Python, Node.js, etc.) of an MCP server and manages its specific dependencies and execution environment.
*   **Multi-Language Environment Handling:** Uses advanced tooling (like `pyenv` or equivalent) to manage and switch between multiple isolated Python versions on a per-server basis.
*   **Enhanced Logging & Diagnostics:** Implements a real-time log streaming system, providing developers full traceability and stack traces for immediate troubleshooting of background processes.
*   **Extensible Repository Management:** Supports both a curated internal list of MCP servers (hardcoded) and allows users to define and add custom external repositories.

## 🛠️ Getting Started: Development Setup

### Prerequisites

This project is complex due to its reliance on system services, build tools, and multiple language interpreters. Ensure the following are installed:

*   **Node.js:** Version [Specify Target Version] (Required for Angular/Electron stack).
*   **npm / Yarn:** A package manager.
*   **Git:** For cloning the repository.
*   **Build Tools (Crucial):** To compile and package the final executables, you must have tools available for all target platforms:
    *   **macOS:** Xcode Command Line Tools installed (`xcode-select --install`).
    *   **Windows 11:** Visual Studio Build Tools or appropriate C++ compiler.
    *   **Linux:** `build-essential` package group (or equivalent).
*   **Python Environment Manager:** A tool like **`pyenv`** is highly recommended to manage multiple, isolated Python versions required for server deployment.

### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPO_URL]
    cd mcp-server-manager
    ```
2.  **Install Dependencies:**
    This installs Angular and Electron tooling:
    ```bash
    npm install
    # OR 
    yarn install
    ```

### Running Locally (Development)

To launch the application in development mode, enabling live reloading for both the Angular frontend and the IPC bridge:

```bash
npm run dev
```

***

## ⚙️ Architecture Deep Dive

The system is divided into three communicating processes to ensure stability, modularity, and proper resource management.

1.  **Angular UI (Frontend):**
    *   **Role:** Handles all presentation logic, user interaction, and status display. It does *not* run the core business logic.
    *   **Communication:** Initiates requests by calling `DeploymentService` methods. These calls are immediately intercepted by the Electron main process via **Inter-Process Communication (IPC)**.

2.  **Electron Main Process (The Bridge):**
    *   **Role:** Acts as the central mediator. It manages the lifecycle of the background processes, handles platform-specific API calls, and coordinates communication between the Angular UI and the deployer logic.
    *   **Core Function:** Receives IPC signals, validates input, and spawns the appropriate process handler.

3.  **Deployment Handler (The Engine):**
    *   **Location:** Resides in `deployer/`. This module contains language-specific scripts (`python-handler`, `node-handler`).
    *   **Role:** This is the workhorse. It executes the following sequence:
        1.  Checks for required interpreters (using version managers).
        2.  Creates a fresh, isolated virtual environment (`venv` or similar container).
        3.  Clones and installs dependencies into the isolated environment.
        4.  **Daemonizes:** Starts the server process in the background, ensuring it remains running even if the main GUI application window is closed (until explicitly told to stop by the user).

### Project Structure

```
mcp-server-manager/
├── src/                    # Angular UI Module (Frontend logic)
│   └── app/
├── electron-main/          # Electron IPC handler and OS interaction layer.
├── deployer/               # Core Business Logic Engine (Platform agnostic wrapper).
│   ├── python-handler.py   # Manages multi-version venv creation and process spawning for Python.
│   └── node-handler.js     # Manages Node environment setup and background process control.
├── config/                 # Environment variables and server registry definitions.
├── package.json            # Scripts and metadata.
```

## 📝 Usage Example: Running a Server (Conceptual)

The user interaction is split into two parts: Starting the Daemon, and Consuming the API.

### 1. Starting the Process (Frontend Flow)

When a user clicks "Start Service" on the dashboard for the `markdown-converter` server:

```typescript
// In Angular/TypeScript service file:
deploymentService.deployServer('microsoft/markdown-converter')
    .subscribe({
        next: (status) =&gt; {
            console.log("Deployment initiated. Status:", status); 
            // UI updates to show 'Initializing...'
        },
        error: (e) =&gt; {
            alert(`Deployment Failed: ${e.message}. Check logs.`); // Error handler
        }
    });
```

### 2. Interacting with the Service (API Consumption)

Once deployed and running, the server exposes a local API endpoint that can be called by other applications or scripts:

```bash
# Example CURL command executed *after* successful deployment
curl -X GET http://localhost:3001/api/v1/convert \
     -H "Content-Type: application/json" \
     -d '{ 
           "input_file": "/path/to/doc.docx", 
           "output_format": "markdown" 
         }'
```

## 🚀 Build & Packaging Guide

Due to the requirement for standalone, executable services, the build process must generate platform-specific packages. This requires using a tool like `electron-builder`.

**Script:** The `package.json` script will call the builder, which creates three distinct directories:

1.  `dist/linux`: Contains the executable `.tar.gz` for Linux deployment.
2.  `dist/win`: Contains the executable `.zip` (or installer) for Windows deployment.
3.  `dist/mac`: Contains the executable `.dmg` or compressed archive for macOS deployment.

## ⚠️ Background Process Management & Shutdown

The application operates as a service daemon. When the user explicitly closes the MCP Server Manager GUI, the system must prompt: **"Do you want to close all running background services?"** If confirmed, the main process sends a kill signal (e.g., `SIGTERM`) to every managed Python/Node process, ensuring graceful shutdown and resource release.

***
