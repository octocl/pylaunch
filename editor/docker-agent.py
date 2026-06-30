#!/usr/bin/env python3
"""PyLaunch Docker agent — runs each task in an isolated Docker container with 12h TTL."""

import os
import sys
import json
import time
import socket
import uuid
import urllib.request
import urllib.error
import subprocess
import tempfile
import threading
import shutil
import re

AGENT_ID = os.environ.get("PYLAUNCH_AGENT_ID", socket.gethostname())
SERVER_URL = os.environ.get("PYLAUNCH_SERVER", sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000")
CONTAINER_TTL = 12 * 3600
IMAGE = "python:3.12-slim"


def log(msg):
    print(f"[agent] {msg}", file=sys.stderr)


def json_post(path: str, body: dict, timeout: int = 10) -> dict | None:
    try:
        data = json.dumps(body).encode()
        req = urllib.request.Request(f"{SERVER_URL}{path}", data=data, headers={"Content-Type": "application/json"}, method="POST")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode()) if resp.status != 204 else None
    except Exception:
        return None


def json_get(path: str, timeout: int = 30) -> dict | None:
    try:
        req = urllib.request.Request(f"{SERVER_URL}{path}")
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode()) if resp.status != 204 else None
    except Exception:
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
    except Exception:
        pass
    return mem


def get_system_info():
    info = {"os": "linux", "cpu": 0, "disk_total": 0, "disk_used": 0}
    try:
        with open("/etc/os-release") as f:
            for line in f:
                if line.startswith("PRETTY_NAME="):
                    info["os"] = line.split("=", 1)[1].strip().strip('"')
                    break
    except Exception:
        try:
            with open("/etc/lsb-release") as f:
                for line in f:
                    if line.startswith("DISTRIB_DESCRIPTION="):
                        info["os"] = line.split("=", 1)[1].strip().strip('"')
                        break
        except Exception:
            pass
    try:
        info["cpu"] = os.cpu_count() or 0
    except Exception:
        pass
    try:
        result = subprocess.run(
            ["df", "--block-size=1", "/"],
            capture_output=True, text=True, timeout=5
        )
        lines = result.stdout.strip().splitlines()
        if len(lines) >= 2:
            parts = lines[1].split()
            if len(parts) >= 4:
                info["disk_total"] = int(parts[1])
                info["disk_used"] = int(parts[2])
    except Exception:
        pass
    return info


def heartbeat():
    while True:
        json_post("/api/agent/ping", {
            "id": AGENT_ID, "hostname": socket.gethostname(),
            "version": "0.1.0", "memory": get_memory(),
            "system": get_system_info(),
        })
        time.sleep(30)


def poll_tasks():
    while True:
        task = json_get(f"/api/agent/next-task?id={AGENT_ID}", timeout=30)
        if task and "code" in task:
            log(f"Received task: {task.get('taskId', 'unknown')}")
            run_in_docker(task)
        time.sleep(1)


def run_in_docker(task: dict):
    task_id = task.get("taskId", str(uuid.uuid4()))
    code = task.get("code", "")
    env_overrides = task.get("env", {})

    tmpdir = tempfile.mkdtemp(prefix="pylaunch_")
    script_path = os.path.join(tmpdir, "script.py")
    try:
        with open(script_path, "w") as f:
            f.write(code)

        env_flags = []
        for k, v in env_overrides.items():
            env_flags.extend(["-e", f"{k}={v}"])

        container_name = f"pylaunch_{task_id[:12]}"

        cmd = [
            "docker", "run",
            "--name", container_name,
            "--label", "pylaunch_container=true",
            "--label", f"pylaunch_task={task_id}",
            "--label", f"pylaunch_started={int(time.time())}",
            "--network", "none",
            "--memory", "256m",
            "--cpus", "0.5",
            "--read-only",
            "--rm",
        ] + env_flags + [
            "-v", f"{tmpdir}:/code:ro",
            IMAGE,
            "python3", "-u", "/code/script.py",
        ]

        proc = subprocess.Popen(
            cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
        )

        for line in iter(proc.stdout.readline, ""):
            json_post(f"/api/agent/output/{task_id}", {"stream": "stdout", "data": line})
        for line in iter(proc.stderr.readline, ""):
            json_post(f"/api/agent/output/{task_id}", {"stream": "stderr", "data": line})

        proc.wait()
        exit_code = proc.returncode

        json_post(f"/api/agent/result/{task_id}", {"exitCode": exit_code})

    except Exception as e:
        log(f"Task {task_id} failed: {e}")
        json_post(f"/api/agent/result/{task_id}", {"exitCode": 1, "stderr": str(e)})
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)


def cleanup_old_containers():
    while True:
        try:
            result = subprocess.run(
                ["docker", "ps", "--filter", "label=pylaunch_container=true",
                 "--format", "{{.ID}} {{.Label \"pylaunch_started\"}}"],
                capture_output=True, text=True, timeout=15
            )
            now = time.time()
            for line in result.stdout.strip().splitlines():
                parts = line.split()
                if len(parts) != 2:
                    continue
                cid, started = parts
                if started.isdigit() and (now - int(started)) > CONTAINER_TTL:
                    subprocess.run(["docker", "kill", cid], capture_output=True, timeout=10)
                    log(f"Killed stale container {cid[:12]}")
        except Exception:
            pass
        time.sleep(300)


def ensure_image():
    try:
        subprocess.run(["docker", "image", "inspect", IMAGE],
                       capture_output=True, timeout=10)
    except Exception:
        log(f"Pulling {IMAGE}...")
        subprocess.run(["docker", "pull", IMAGE], timeout=120)


def check_deps():
    for cmd in ["docker"]:
        if not shutil.which(cmd):
            log(f"ERROR: {cmd} not found. Install it first.")
            sys.exit(1)
    try:
        subprocess.run(["docker", "info"], capture_output=True, timeout=10)
    except Exception:
        log("ERROR: Docker daemon not running.")
        sys.exit(1)


def main():
    log(f"Starting Docker agent (id={AGENT_ID}, server={SERVER_URL})")
    check_deps()
    ensure_image()

    t1 = threading.Thread(target=heartbeat, daemon=True)
    t2 = threading.Thread(target=poll_tasks, daemon=True)
    t3 = threading.Thread(target=cleanup_old_containers, daemon=True)
    t1.start()
    t2.start()
    t3.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        log("Shutting down")
        sys.exit(0)


if __name__ == "__main__":
    main()
