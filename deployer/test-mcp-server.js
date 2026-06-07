const http = require("http");

const port = Number(process.env.TEST_MCP_PORT || 3001);

const server = http.createServer((req, res) => {
  if (req.url === "/api/v1/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ ok: true, server: "test-mcp-server" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`test-mcp-server listening on http://127.0.0.1:${port}\n`);
});
