async function refreshServers() {
  const target = document.getElementById("servers");
  const data = await window.mcpManager.listServers();
  const statusMap = new Map(data.statuses.map((entry) => [entry.id, entry]));

  target.innerHTML = "";

  data.catalog.forEach((server) => {
    const status = statusMap.get(server.id) || { status: "stopped", pid: null };
    const card = document.createElement("div");
    card.className = "server-card";

    const heading = document.createElement("h2");
    heading.textContent = `${server.name} (${server.id})`;
    card.appendChild(heading);

    const details = document.createElement("p");
    details.textContent = `${server.description} | Status: ${status.status}${status.pid ? ` | PID: ${status.pid}` : ""}`;
    card.appendChild(details);

    if (server.endpoint) {
      const endpoint = document.createElement("p");
      endpoint.textContent = `Endpoint: ${server.endpoint}`;
      card.appendChild(endpoint);
    }

    const deployButton = document.createElement("button");
    deployButton.textContent = "Start Service";
    deployButton.onclick = async () => {
      await window.mcpManager.deployServer(server.id);
      await refreshServers();
    };
    card.appendChild(deployButton);

    const stopButton = document.createElement("button");
    stopButton.textContent = "Stop Service";
    stopButton.onclick = async () => {
      await window.mcpManager.stopServer(server.id);
      await refreshServers();
    };
    card.appendChild(stopButton);

    const logsButton = document.createElement("button");
    logsButton.textContent = "View Logs";
    logsButton.onclick = async () => {
      const logs = await window.mcpManager.getLogs(server.id, 100);
      logOutput.textContent = logs || "(no logs yet)";
    };
    card.appendChild(logsButton);

    const logOutput = document.createElement("pre");
    logOutput.textContent = "(log output)";
    card.appendChild(logOutput);

    target.appendChild(card);
  });
}

refreshServers();
