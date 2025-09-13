# Multi Power Group Order System

## Getting Started

Follow these steps to set up and run the system locally:

### 1. Clone the Repository

```
git clone https://github.com/akunumanarif/multi-power-group.git
cd multi-power-group
```

### 2. Create Environment Files

Create a `.env` file in the project root and in each service directory as needed.

> **Note:** The required environment variables will be provided separately. Please copy the provided content into your `.env` files.

### 3. Build and Start the System with Docker Compose

Make sure Docker and Docker Compose are installed on your machine.

```
docker-compose up --build
```

This command will build and start all necessary containers, including:
- PostgreSQL database
- Kafka & Zookeeper
- Swagger
- Elastic and Kibana UI
- Kafdrop (Kafka UI)
- Order Service
- Notification Service

### 4. Accessing the Services

- **Order Service API:** http://localhost:3001
- **Swagger Documentation:** http://localhost:3001/api
- **Kafdrop UI:** http://localhost:9000
- **Kibana UI (Logs & Metrics):** http://localhost:5601

### 5. Running Tests (Optional)

To run unit tests for the Order Service:

```
docker build --target test -t order-service-test ./apps/order-service
```

Or run tests locally:

```
cd apps/order-service
npm install
npm run test
```

---

For any issues, please check the logs of each container or contact the maintainer.