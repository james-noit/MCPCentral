const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");

const { ProcessManager } = require("../deployer/process-manager");

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      const chunks = [];
      res.on("data", (chunk) => chunks.push(chunk));
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          body: Buffer.concat(chunks).toString("utf8"),
        });
      });
    });
    req.on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test("deploys and stops a configured server", async () => {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "mcpcentral-test-"));
  const repoRoot = path.resolve(__dirname, "..");
  const port = 3301;

  const registry = [
    {
      id: "test-server",
      name: "Test Server",
      description: "Server for process manager tests",
      runtime: "node",
      command: "node",
      args: ["deployer/test-mcp-server.js"],
      env: { TEST_MCP_PORT: String(port) },
      endpoint: `http://127.0.0.1:${port}/api/v1/health`,
      cwd: ".",
    },
  ];

  const registryPath = path.join(tempDir, "server-registry.json");
  fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2));

  const manager = new ProcessManager({ registryPath, rootDir: repoRoot });
  manager.deployServer("test-server");

  let response;
  for (let i = 0; i < 20; i += 1) {
    try {
      response = await httpGet(registry[0].endpoint);
      break;
    } catch (_error) {
      await sleep(100);
    }
  }

  assert.ok(response, "server did not become reachable in time");
  assert.equal(response.statusCode, 200);
  assert.match(response.body, /"ok":true/);

  const statuses = manager.getStatuses();
  assert.equal(statuses[0].status, "running");

  manager.stopServer("test-server");
  await sleep(150);

  const stopped = manager.getStatuses();
  assert.equal(stopped[0].status, "stopped");

  const logs = manager.getLogs("test-server", 50);
  assert.match(logs, /test-mcp-server listening/);

  const serverProcess = manager.processes.get("test-server");
  if (serverProcess && !serverProcess.exited) {
    process.kill(serverProcess.child.pid, "SIGKILL");
  }

  fs.rmSync(tempDir, { recursive: true, force: true });
});
