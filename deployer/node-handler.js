function resolveNodeRuntimeConfig(server) {
  return {
    command: server.command || "node",
    args: Array.isArray(server.args) ? server.args : [],
  };
}

module.exports = { resolveNodeRuntimeConfig };
