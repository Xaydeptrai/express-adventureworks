# 🌍 Distributed Sales Management System

This project is a distributed sales management system using Docker Compose with Nginx load balancing across multiple regional backend services.

## 📦 Architecture Overview
Client → Nginx (Load Balancer) → Backend Containers (NA, EU, MASTER)

### 🧩 Components

- **Nginx**: Acts as a reverse proxy and routes requests based on region.
- **Backend Servers**:
  - `master`: Central reference server (e.g., customer and product data)
  - `na_1`, `na_2`: North America region backend
  - `eu_1`, `eu_2`: Europe region backend

---

## 🚀 Getting Started

### 1. Clone this repository
```bash
git clone https://github.com/Xaydeptrai/express-adventureworks.git
cd express-adventureworks
```

### 2.🗄️Database Setup – MSSQL with Backup Restore
🐳 Start MSSQL Server Containers
```bash
cd database
docker-compose up -d
```
🔌 Connect to MSSQL from SSMS
```bash
localhost,1533 -- (master-db)
localhost,1535 -- (eu-db)
localhost,1536 -- (na-db)
```
🔑 Login 
  - Authentication: SQL Server Authentication
  - Login: sa
  - Password: Password123@

♻️ Restore Database in SSMS
Repeat these steps for all 3 servers:
1. Right-click Databases → Restore Database...
2. Select Device → Add:
```swift
/var/opt/mssql/backup/{BackupDBFile}.bak
```
3. In Files tab: Tick Relocate all files to folder
4. Click OK to restore the database.

### 3. ⚙️ Build & Start the Services
```bash
docker-compose up --build
```
### 4. 🌐 Access the System
Open your browser to test the endpoints:
```bash
NA	http://localhost:3000/api/na/report/totalSalesByYear?year=2011
EU	http://localhost:3000/api/eu/report/totalSalesByYear?year=2011
Master	http://localhost:3000/api/master/report/totalSalesByYear?year=2011
```

---

## 🔧 Configuration
| Service        | Host Port | Container Port |
|----------------|-----------|----------------|
| Nginx          | 3000      | 3000           |
| Master Server  | 3001      | 3001           |
| NA Server 1    | 3002      | 3002           |
| NA Server 2    | 3003      | 3003           |
| EU Server 1    | 3004      | 3004           |
| EU Server 2    | 3005      | 3005           |


## 📚 API Endpoint List

| Method | Endpoint                                                                       | Description                                           |
|--------|--------------------------------------------------------------------------------|-------------------------------------------------------|
| `GET`  | `/api/{region}/products?page=1&limit=5&search=`                                | Retrieve a paginated list of products (searchable)   |
| `GET`  | `/api/{region}/order?page=1&limit=10&search=`                                  | Retrieve a paginated list of orders (searchable)     |
| `GET`  | `/api/{region}/order/{orderId}`                                                | Retrieve the detailed information of a specific order |
| `GET`  | `/api/{region}/report/bySubcategory?year=2011`                                 | Get total sales grouped by product subcategory       |
| `GET`  | `/api/{region}/report/totalSalesByYear?year=2011`                              | Get total sales value by year                        |
| `GET`  | `/api/{region}/reports/customersByRevenue?page=1&limit=5`                      | Retrieve top customers ranked by revenue             |
