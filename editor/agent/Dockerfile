FROM python:3.12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 pylaunch \
    && adduser --system --uid 1001 --ingroup pylaunch --home /app pylaunch

WORKDIR /app

COPY agent.py .

USER pylaunch

ENV PYLAUNCH_SERVER=http://localhost:3000

ENTRYPOINT ["python3", "agent.py"]
