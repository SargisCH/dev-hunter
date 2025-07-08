# 🚀 NestJS Starter Project

This is a backend starter project built with [NestJS](https://nestjs.com).

---

## 📦 Project Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start MongoDB and Redis using Docker Compose

Start the services:

```bash
docker-compose up -d
```

---

## ⚙️ Environment Variables

Create a `.env` file:

```env
PORT=3000
DATABASE_URI=mongodb://localhost:27017/dev_hunter
```

---

## ▶️ Run the Application

```bash
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod
```

---

## 🧪 Run Tests

```bash
# unit tests
npm run test
```

---

## 🛠 Tech Stack

- [NestJS](https://nestjs.com) — Progressive Node.js framework
- MongoDB + Mongoose
- Redis (with ioredis or keyv)
- Docker Compose

---
