# 🪙 Planzo – AI-Powered Personal Finance Management Platform

---

<div align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📌 About The Project

**Planzo** is a full-stack personal finance management platform built for college students and young professionals who want a simple, smart way to manage their money.

Most students have no idea where their money goes each month. Planzo solves this by giving users a clean dashboard to track budgets, log expenses, manage income sources, and receive AI-powered financial advice — all in one place.

> Built as a real-world full-stack project covering authentication, database design, caching, AI integration, and performance optimization.

---

## 🖼️ Screenshots

<div align="center">
  <img src="./client/src/assets/banner.png" width="900" alt="Banner">

</div>

---

## ✨ Features

- 📊 **Interactive Dashboard** — Real-time stats, bar charts, savings rate, recent expenses and latest budgets
- 💰 **Budget Management** — Create, edit, and delete budgets with emoji icons and progress tracking
- 🧾 **Expense Tracking** — Add and delete expenses under specific budgets with live balance updates
- 💵 **Income Management** — Track multiple income sources with amounts
- 🤖 **AI Financial Advisor** — Personalized 3-sentence financial advice powered by Groq AI
- ⚡ **Redis Caching** — AI advice cached for 6 hours, reducing API calls by ~80%
- 🌙 **Dark Mode** — Full dark/light theme with system preference detection and localStorage persistence
- 📱 **Fully Responsive** — Desktop sidebar + mobile hamburger drawer

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 + Vite | UI framework and build tool |
| Tailwind CSS v4 | Styling and dark mode |
| Redux Toolkit | Global state management |
| React Router v6 | Client-side navigation |
| Clerk React SDK | Authentication UI |
| Recharts | Dashboard charts and visualizations |
| Lucide React | Icons |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | Server and REST API |
| Prisma ORM | Database queries and migrations |
| PostgreSQL (Neon) | Primary database |
| Clerk Express SDK | Backend JWT verification |
| Redis (Redis Cloud) | AI advice caching |
| Groq API | AI financial advice generation |

---


## 🗃️ Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  clerkId   String   @unique
  name      String
  email     String   @unique
  imageUrl  String?
  createdAt DateTime @default(now())
  budgets   Budget[]
  incomes   Income[]
}

model Budget {
  id        Int       @id @default(autoincrement())
  name      String
  amount    Float
  icon      String
  createdAt DateTime  @default(now())
  userId    Int
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses  Expense[]
}

model Expense {
  id        Int      @id @default(autoincrement())
  name      String
  amount    Float
  createdAt DateTime @default(now())
  budgetId  Int
  budget    Budget   @relation(fields: [budgetId], references: [id], onDelete: Cascade)
}

model Income {
  id        Int      @id @default(autoincrement())
  name      String
  amount    Float
  icon      String
  createdAt DateTime @default(now())
  userId    Int
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

---

## 🔌 API Endpoints

All endpoints except auth are protected. Every request must include:
```
Authorization: Bearer <clerk_token>
```

---

### 💰 Budgets

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/budgets` | Get all budgets for the logged-in user with total spend and item count |
| `POST` | `/api/budgets` | Create a new budget |
| `PUT` | `/api/budgets/:id` | Update a budget by ID |
| `DELETE` | `/api/budgets/:id` | Delete a budget and all its expenses (cascade) |

---

### 🧾 Expenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/expenses` | Get all expenses across all budgets for the logged-in user |
| `GET` | `/api/expenses/:budgetId` | Get all expenses for a specific budget |
| `POST` | `/api/expenses` | Add a new expense to a budget |
| `DELETE` | `/api/expenses/:id` | Delete an expense by ID |

---

### 💵 Incomes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/incomes` | Get all income sources for the logged-in user |
| `POST` | `/api/incomes` | Create a new income source |
| `DELETE` | `/api/incomes/:id` | Delete an income source by ID |

---

### 🤖 AI Advice

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/ai/advice` | Get personalized financial advice based on user's financial data |

---

## ⚡ Performance Optimizations

### 1. Parallel API Fetching
Dashboard loads three APIs simultaneously using `Promise.all` instead of sequentially — cutting load time by ~60%.

### 2. Redux Cache-First Strategy
Pages check Redux before making API calls. If data already exists in the store, the fetch is skipped entirely.

### 3. Redis AI Caching
AI advice is cached with a 6-hour TTL. Cache key is user-specific and value-specific.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Neon recommended)
- Redis instance (Redis Cloud recommended)
- Clerk account
- Groq API key

---

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/planzo.git
cd planzo
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `/server`:

```env
DATABASE_URL="your_neon_postgresql_connection_string"
CLERK_SECRET_KEY="your_clerk_secret_key"
GROQ_API_KEY="your_groq_api_key"
REDIS_USERNAME="your_redis_username"
REDIS_PASSWORD="your_redis_password"
REDIS_HOST="your_redis_host"
REDIS_PORT="your_redis_port"
PORT=5000
```

Run Prisma migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Start the server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env` file in `/client`:

```env
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
VITE_API_URL="http://localhost:5000"
```

Start the frontend:

```bash
npm run dev
```

---

### 4. Open the App

```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

---

## 🌐 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Cache | Redis Cloud |

---

## 📈 What I Learned

- How to design a relational database with proper foreign keys and cascade deletes
- How to implement user-specific Redis caching with TTL for expensive AI API calls
- How to build a Redux cache-first strategy to eliminate duplicate API calls
- How to sync external auth providers (Clerk) with your own database
- How to scope every database query by user ID to prevent data leakage
- How to use Promise.all to parallelize API requests and improve performance

---

## 🔮 Future Improvements

- [ ] Budget alerts when spending reaches 80% of limit
- [ ] Export data to CSV

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@lokeshbhai007](https://github.com/lokeshbhai007)
- LinkedIn: [lokesh-mondal](https://linkedin.com/in/lokesh-mondal)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>If you found this project helpful, please give it a ⭐</p>
</div>
