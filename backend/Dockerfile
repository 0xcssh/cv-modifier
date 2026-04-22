# TODO: pin to @sha256:... digest for full reproducibility (e.g. python:3.12.8-slim@sha256:<digest>)
FROM python:3.12.8-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# System deps for Playwright chromium (must run as root)
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    ca-certificates \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libxcb1 \
    libxkbcommon0 \
    libx11-6 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libpango-1.0-0 \
    libcairo2 \
    libasound2 \
    libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Non-root user for runtime
RUN useradd --create-home --uid 10001 --shell /bin/bash appuser

# Python deps (installed as root into system site-packages)
COPY pyproject.toml requirements.lock.txt ./
RUN pip install --upgrade pip && pip install -r requirements.lock.txt

# App code
COPY app ./app

# Storage dir + ownership
RUN mkdir -p /app/storage \
    && chown -R appuser:appuser /app /home/appuser

# Switch to non-root for anything that writes to $HOME (Playwright browser cache)
USER appuser

# Playwright chromium (downloads to /home/appuser/.cache/ms-playwright)
RUN playwright install chromium

EXPOSE 8000

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
