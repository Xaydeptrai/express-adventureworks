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

## 🚀 Getting Started

### 1. Clone this repository
```bash
git clone https://github.com/Xaydeptrai/express-adventureworks.git
cd express-adventureworks
```

### 2.🗄️Database Setup – MSSQL with Backup Restore
Start SQL Server containers
```bash
cd database
docker-compose up -d
```
Connect to MSSQL Management Studio
```css
localhost,1533 -- (master-db)
localhost,1535 -- (eu-db)
localhost,1536 -- (na-db)
```
Login 
Authentication: SQL Server Authenticatio
Login: sa
Password: Password123@

