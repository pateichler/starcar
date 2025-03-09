# Run from analysis directory

FROM python:3.13-alpine AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY ./analysis_1 /app/

# Install starcar API
COPY ./starcar_api /app/starcar_api/
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels /app/starcar_api/

# Install rest of requirements
COPY ./analysis_1/requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /app/wheels -r requirements.txt



FROM python:3.13-alpine

WORKDIR /app

# RUN addgroup --system app && adduser --system --group app
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app


COPY --from=builder /app/wheels /wheels
RUN pip install --no-cache /wheels/*

COPY ./analysis_1/src /app/src/
RUN chown -R app:app /app

USER app