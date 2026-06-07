#!/usr/bin/env python3
"""Initial Python runtime handler scaffold."""

import json
import os
import subprocess
import sys


def run(config: dict) -> int:
    command = config.get("command", sys.executable)
    args = config.get("args", [])
    env = os.environ.copy()
    env.update(config.get("env", {}))
    process = subprocess.Popen([command, *args], env=env)
    return process.pid


if __name__ == "__main__":
    payload = json.loads(sys.stdin.read())
    pid = run(payload)
    print(json.dumps({"pid": pid}))
