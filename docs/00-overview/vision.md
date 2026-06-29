# Vision

Make Python execution as accessible as opening a web page.

The overhead of setting up a local Python environment — installing the interpreter, managing `pip` dependencies, troubleshooting platform-specific issues — is a real barrier for beginners and a friction point for experienced developers who just want to run a quick script.

PyLaunch removes that barrier entirely. A user should be able to go from "I have a Python script" to "it's running and showing output" in under 10 seconds, with zero configuration.

## Long-term vision

- Become the default "scratchpad" for the Python community
- Support multiple Python versions side-by-side
- Let users share and fork scripts (like a lightweight GitHub Gist with execution)
- Provide a simple REST API for programmatic execution (CI/CD, automation pipelines)
- Keep the free tier genuinely useful so the platform remains accessible to everyone

## Non-goals

- Competing with full cloud IDEs (GitPod, GitHub Codespaces)
- Running stateful services or long-lived daemons
- Supporting languages other than Python
- Being a package registry or deployment platform
