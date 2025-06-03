# Universe Test

## 🧩 Overview

This repository implements a scalable and maintainable event processing pipeline that integrates with NATS JetStream, processes social media events, and exposes analytics and reporting via API.

The system simulates event ingestion via a prebuilt `publisher` Docker image and provides a full-stack backend solution using NestJS, PostgreSQL, Prisma, and Prometheus/Grafana for observability.

---

## 📦 Features

- **Gateway**
    - Accepts incoming webhook events via `EVENT_ENDPOINT`
    - Forwards events to the appropriate NATS JetStream topics
- **Collectors**
    - Process Facebook and Tiktok events from NATS
    - Persist data to PostgreSQL using Prisma
- **Reporter**
    - Exposes API endpoints to retrieve:
        - Aggregated event statistics
        - Revenue analytics
        - User demographics
- **Monitoring**
    - Prometheus + Grafana dashboards with panels for:
        - Gateway: accepted, processed, and failed events
        - Collectors: per-minute aggregation
        - Reporter: request latency
- **Logging**
    - Structured logs with correlation IDs for traceability
- **Reliability**
    - Health/liveness probes for all services
    - Graceful shutdown with in-flight event handling
- **Infrastructure**
    - PostgreSQL with persistent storage
    - NATS JetStream with custom NestJS wrappers
    - Prisma migrations auto-run on startup

---

## 🚀 Quick Start


```bash
docker-compose up --build
