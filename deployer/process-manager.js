const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require("child_process");
const { resolveNodeRuntimeConfig } = require("./node-handler");

class ProcessManager {
  constructor({ registryPath, rootDir = path.resolve(path.dirname(registryPath), "..") }) {
    this.registryPath = registryPath;
    this.rootDir = rootDir;
    this.registry = this.loadRegistry();
    this.processes = new Map();
    this.logDir = path.join(os.homedir(), ".mcpcentral", "logs");
    fs.mkdirSync(this.logDir, { recursive: true });
  }

  loadRegistry() {
    const raw = fs.readFileSync(this.registryPath, "utf8");
    const parsed = JSON.parse(raw);

    if (!Array.isArray(parsed)) {
      throw new Error("Server registry must be an array");
    }

    return parsed;
  }

  getCatalog() {
    return this.registry.map((server) => ({
      id: server.id,
      name: server.name,
      description: server.description,
      runtime: server.runtime,
      endpoint: server.endpoint,
    }));
  }

  getStatuses() {
    return this.registry.map((server) => {
      const running = this.processes.get(server.id);
      return {
        id: server.id,
        name: server.name,
        status: running && !running.exited ? "running" : "stopped",
        pid: running && !running.exited ? running.child.pid : null,
        endpoint: server.endpoint ?? null,
      };
    });
  }

  deployServer(serverId) {
    const server = this.registry.find((entry) => entry.id === serverId);
    if (!server) {
      throw new Error(`Unknown server '${serverId}'`);
    }

    const existing = this.processes.get(serverId);
    if (existing && !existing.exited) {
      return {
        id: serverId,
        status: "running",
        pid: existing.child.pid,
        endpoint: server.endpoint ?? null,
      };
    }

    const logPath = path.join(this.logDir, `${serverId}.log`);
    const logFd = fs.openSync(logPath, "a");

    const runtime = server.runtime || "node";
    const runtimeConfig =
      runtime === "node"
        ? resolveNodeRuntimeConfig(server)
        : {
            command: server.command,
            args: Array.isArray(server.args) ? server.args : [],
          };
    const command = runtimeConfig.command;
    const args = runtimeConfig.args;
    const cwd = server.cwd
      ? path.resolve(this.rootDir, server.cwd)
      : this.rootDir;
    const env = { ...process.env, ...(server.env || {}) };

    const child = spawn(command, args, {
      cwd,
      env,
      detached: true,
      stdio: ["ignore", logFd, logFd],
      windowsHide: true,
    });
    fs.closeSync(logFd);

    child.on("error", (error) => {
      fs.appendFileSync(logPath, `\n[spawn-error] ${error.message}\n`);
    });

    const state = { child, logPath, exited: false };
    this.processes.set(serverId, state);

    child.on("exit", (code, signal) => {
      state.exited = true;
      fs.appendFileSync(
        logPath,
        `\n[exit] code=${String(code)} signal=${String(signal)}\n`,
      );
    });

    child.unref();

    return {
      id: serverId,
      status: "running",
      pid: child.pid,
      endpoint: server.endpoint ?? null,
    };
  }

  stopServer(serverId) {
    const running = this.processes.get(serverId);
    if (!running || running.exited) {
      return { id: serverId, status: "stopped" };
    }

    try {
      process.kill(running.child.pid, "SIGTERM");
    } catch (_error) {
      return { id: serverId, status: "stopped" };
    }

    running.exited = true;
    return { id: serverId, status: "stopped" };
  }

  stopAllServers() {
    const results = [];
    for (const server of this.registry) {
      results.push(this.stopServer(server.id));
    }
    return results;
  }

  getLogs(serverId, lines = 200) {
    const running = this.processes.get(serverId);
    if (!running) {
      return "";
    }

    if (!fs.existsSync(running.logPath)) {
      return "";
    }

    const content = fs.readFileSync(running.logPath, "utf8");
    const split = content.split(/\r?\n/);
    return split.slice(-Math.max(1, lines)).join("\n");
  }
}

module.exports = { ProcessManager };
