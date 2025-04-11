# 🌍 Distributed Sales Management System

This project is a distributed sales management system using Docker Compose with Nginx load balancing across multiple regional backend services.

## 📦 Architecture Overview
Client → Nginx (Load Balancer) → Backend Containers (NA, EU, MASTER)

### Components
- **Nginx**: Acts as a reverse proxy and load balancer.
- **Backend Servers**:
  - `master`: Central reference server (e.g., customer, product data)
  - `na_1`, `na_2`: North America region servers
  - `eu_1`, `eu_2`: Europe region servers

## 📁 Project Structure
. ├── docker-compose.yml ├── nginx.conf ├── logs/ # Nginx access/error logs ├── src/ # Backend application source code │ └── server.js # Entry point └── ...

## 🚀 Getting Started

### 1. Clone this repository

```bash
git clone https://github.com/Xaydeptrai/express-adventureworks.git
cd express-adventureworks

