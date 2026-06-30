import { NextRequest } from "next/server";
import { spawn } from "child_process";
import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import {
  getAgent,
  queueTask,
  registerOutputStream,
  waitForTask,
} from "@/lib/agent-store";
import { incrementTasks } from "@/lib/task-counter";
import { setProcess } from "@/lib/process-store";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { code, timeout = 30, env: userEnv = {}, target } = await req.json();

  if (!code || typeof code !== "string") {
    return new Response(JSON.stringify({ error: "code is required" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const isAgent = typeof target === "string" && target.startsWith("agent-");
  const agentId = isAgent ? target.replace("agent-", "") : null;

  if (isAgent && agentId) {
    return handleAgentExecution(code, userEnv, agentId);
  }

  return handleLocalExecution(code, userEnv, timeout);
}

async function handleLocalExecution(
  code: string,
  userEnv: Record<string, string>,
  timeout: number
): Promise<Response> {
  incrementTasks();
  const taskId = randomUUID();
  const nonEmpty = Object.entries(userEnv).filter(([k]) => k.trim());
  let patchedCode = code;
  if (nonEmpty.length > 0) {
    const shebang = code.startsWith("#!") ? code.split("\n")[0] + "\n" : "";
    const rest = shebang ? code.slice(code.indexOf("\n") + 1) : code;
    const assignments = nonEmpty
      .map(([k, v]) => `os.environ[${JSON.stringify(k)}] = ${JSON.stringify(v)}`)
      .join("\n");
    patchedCode = shebang + "import os\n" + assignments + "\n" + rest;
  }

  const tmpFile = join(tmpdir(), `pylaunch_${randomUUID()}.py`);
  await writeFile(tmpFile, patchedCode);

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout * 1000);

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      let done = false;

      const send = (event: string, data: Record<string, unknown>) => {
        if (done) return;
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify({ event, ...data }) + "\n")
          );
        } catch {
          // controller closed, ignore
        }
      };

      try {
        const proc = spawn("python3", ["-u", tmpFile], {
          signal: abortController.signal,
          stdio: ["pipe", "pipe", "pipe"],
          env: { ...process.env, PYTHONUNBUFFERED: "1", ...userEnv },
        });

        setProcess(taskId, proc);

        send("task_start", { taskId });

        let exitCode: number | null = null;

        const onStdout = (chunk: Buffer) => {
          send("stdout", { data: chunk.toString() });
        };
        const onStderr = (chunk: Buffer) => {
          send("stderr", { data: chunk.toString() });
        };

        proc.stdout.on("data", onStdout);
        proc.stderr.on("data", onStderr);

        proc.on("close", (code) => {
          exitCode = code;
          proc.stdout.off("data", onStdout);
          proc.stderr.off("data", onStderr);
        });

        await new Promise<void>((resolve, reject) => {
          proc.on("close", () => resolve());
          proc.on("error", (err) => {
            if ((err as Error & { code?: string }).code === "ABORT_ERR") {
              send("timeout", {});
            } else {
              send("error", { message: err.message });
            }
            reject(err);
          });
        });

        send("exit", { code: exitCode });
      } catch {
        // handled above
      } finally {
        done = true;
        clearTimeout(timeoutId);
        try {
          await unlink(tmpFile);
        } catch {
          // ignore cleanup errors
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson",
      "x-content-type-options": "nosniff",
    },
  });
}

async function handleAgentExecution(
  code: string,
  userEnv: Record<string, string>,
  agentId: string
): Promise<Response> {
  incrementTasks();
  const agent = getAgent(agentId);
  if (!agent) {
    return new Response(
      JSON.stringify({ error: `Agent "${agentId}" not found or offline` }),
      {
        status: 404,
        headers: { "content-type": "application/json" },
      }
    );
  }

  const taskId = randomUUID();
  const task = { taskId, code, env: userEnv };

  queueTask(agentId, task);

  const stream = new ReadableStream({
    async start(controller) {
      let done = false;
      const send = (event: string, data: Record<string, unknown>) => {
        if (done) return;
        const encoder = new TextEncoder();
        try {
          controller.enqueue(
            encoder.encode(JSON.stringify({ event, ...data }) + "\n")
          );
        } catch {
          /* closed */
        }
      };

      registerOutputStream(taskId, controller);

      send("agent_start", { agent: agentId, hostname: agent.hostname });

      try {
        const result = await waitForTask(taskId);
        send("exit", { code: result.exitCode });
      } catch {
        send("error", { message: "Task cancelled" });
      } finally {
        done = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "application/x-ndjson",
      "x-content-type-options": "nosniff",
    },
  });
}
