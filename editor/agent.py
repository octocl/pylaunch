#!/usr/bin/env python3
"""PyLaunch VPS agent — connects to PyLaunch editor for remote code execution."""

import os
import sys
import json
import time
import socket
import urllib.request
import urllib.error
import subprocess
import tempfile
import threading

AGENT_ID = os.environ.get("PYLAUNCH_AGENT_ID", socket.gethostname())
SERVER_URL = os.environ.get("PYLAUNCH_SERVER", "http://localhost:3000")
POLL_INTERVAL = 5


def json_post(path: str, body: dict) -> dict | None:
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        f"{SERVER_URL}{path}",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 204:
            return None
        print(f"[agent] HTTP {e.code}: {e.read().decode()}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"[agent] Request failed: {e}", file=sys.stderr)
        return None


def json_get(path: str, timeout: int = 30) -> dict | None:
    req = urllib.request.Request(f"{SERVER_URL}{path}")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            if resp.status == 204:
                return None
            return json.loads(resp.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 204:
            return None
        return None
    except Exception as e:
        return None


def get_memory():
    mem = {"total": 0, "available": 0, "used": 0, "percent": 0.0}
    try:
        with open("/proc/meminfo") as f:
            for line in f:
                if line.startswith("MemTotal:"):
                    mem["total"] = int(line.split()[1]) * 1024
                elif line.startswith("MemAvailable:"):
                    mem["available"] = int(line.split()[1]) * 1024
                elif line.startswith("MemFree:"):
                    mem["free"] = int(line.split()[1]) * 1024
        mem["used"] = mem["total"] - mem["available"]
        if mem["total"] > 0:
            mem["percent"] = round(mem["used"] / mem["total"] * 100, 1)
    except:
        pass
    return mem


def heartbeat():
    while True:
        json_post("/api/agent/ping", {
            "id": AGENT_ID,
            "hostname": socket.gethostname(),
            "version": "0.1.0",
            "memory": get_memory(),
        })
        time.sleep(10)


def poll_tasks():
    while True:
        task = json_get(f"/api/agent/next-task?id={AGENT_ID}", timeout=30)
        if task and "code" in task:
            print(f"[agent] Received task: {task.get('taskId', 'unknown')}", file=sys.stderr)
            run_and_report(task)
        time.sleep(1)


def run_and_report(task: dict):
    task_id = task.get("taskId", "")
    code = task.get("code", "")
    env_overrides = task.get("env", {})

    with tempfile.NamedTemporaryFile(suffix=".py", mode="w", delete=False) as f:
        f.write(code)
        tmpfile = f.name

    env = {**os.environ, **env_overrides}

    buf_out = []
    buf_err = []
    exit_code = -1

    try:
        proc = subprocess.Popen(
            ["python3", "-u", tmpfile],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            env=env,
            text=True,
        )

        for line in iter(proc.stdout.readline, ""):
            buf_out.append(line)
            json_post(f"/api/agent/output/{task_id}", {
                "stream": "stdout",
                "data": line,
            })
        for line in iter(proc.stderr.readline, ""):
            buf_err.append(line)
            json_post(f"/api/agent/output/{task_id}", {
                "stream": "stderr",
                "data": line,
            })

        proc.wait()
        exit_code = proc.returncode
    except Exception as e:
        buf_err.append(str(e))
        exit_code = 1
    finally:
        try:
            os.unlink(tmpfile)
        except OSError:
            pass

    json_post(f"/api/agent/result/{task_id}", {
        "exitCode": exit_code,
        "stdout": "".join(buf_out),
        "stderr": "".join(buf_err),
    })


def main():
    print(f"[agent] Starting PyLaunch agent (id={AGENT_ID}, server={SERVER_URL})", file=sys.stderr)
    print(f"[agent] Heartbeat service: {SERVER_URL}/api/agent/ping", file=sys.stderr)

    t1 = threading.Thread(target=heartbeat, daemon=True)
    t2 = threading.Thread(target=poll_tasks, daemon=True)
    t1.start()
    t2.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n[agent] Shutting down", file=sys.stderr)
        sys.exit(0)


if __name__ == "__main__":
    main()
