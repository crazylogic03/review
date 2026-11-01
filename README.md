# PeerReview – Assignment Review & Feedback Platform

A full-stack web application where students can submit assignments, share project links, and receive structured peer reviews from classmates.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react) ![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite) ![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss) ![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?logo=postgresql)

## Features

- **Landing Page** — Professional hero, features section, how-it-works, and CTA
- **Authentication** — JWT-based registration and login with Argon2 password hashing
- **Student Dashboard** — Stats cards, quick actions, and activity feed
- **Assignment Submission** — Title, subject, description, GitHub URL, and submission date
- **Peer Review** — Browse assignments, rate on design/functionality/code quality, and write feedback
- **Profile** — View/edit student info, assignments, and received reviews
- **Admin Dashboard** — Platform stats, recent activity, and user management
- **Security Demo** — Side-by-side comparison of plaintext vs Argon2 password storage

## Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14 (running locally or via Docker)
- **npm** ≥ 9

## Quick Start

### 1. Clone and install dependencies

```bash
# Server
cd server
cp .env.example .env
npm install

# Client
cd ../client
npm install
```

### 2. Configure the database

Edit `server/.env` and set your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/peerreview?schema=public"
JWT_SECRET="your-secret-key-here"
PORT=3001
CLIENT_URL="http://localhost:5173"
```

### 3. Create the database and run migrations

```bash
cd server

# Create the database (if it doesn't exist)
createdb peerreview

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed with demo data
node prisma/seed.js
```

### 4. Start the development servers

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

## Demo Credentials

| Role    | Email                   | Password     |
|---------|-------------------------|-------------|
| Admin   | admin@peerreview.demo   | demo123456  |
| Student | alex@peerreview.demo    | demo123456  |
| Student | priya@peerreview.demo   | demo123456  |
| Student | jordan@peerreview.demo  | demo123456  |
| Student | mei@peerreview.demo     | demo123456  |
| Student | omar@peerreview.demo    | demo123456  |

> ⚠️ **Privacy Notice:** This is a demo application. Use only the demo credentials above. Never enter real passwords from other services.

## Project Structure

```
├── client/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar)
│   │   ├── context/           # Auth context provider
│   │   ├── pages/             # All page components
│   │   ├── utils/             # API client
│   │   ├── App.jsx            # Root with routing
│   │   ├── index.css          # Tailwind v4 + custom styles
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                    # Node.js + Express backend
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Seed data
│   ├── src/
│   │   ├── middleware/        # JWT auth middleware
│   │   ├── routes/            # API routes (auth, assignments, reviews, admin, users, security)
│   │   └── index.js           # Express server entry
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user

### Assignments
- `GET /api/assignments` — List all (with search, filter, pagination)
- `GET /api/assignments/:id` — Get single assignment
- `POST /api/assignments` — Create assignment (auth required)
- `GET /api/assignments/user/me` — Get own assignments
- `DELETE /api/assignments/:id` — Delete assignment
- `GET /api/assignments/meta/subjects` — Get distinct subjects

### Reviews
- `POST /api/reviews` — Submit a review (auth required)
- `GET /api/reviews/user/me` — Get reviews written by user
- `GET /api/reviews/received` — Get reviews received on user's assignments

### Users
- `GET /api/users/:id` — Get user profile
- `PATCH /api/users/me` — Update own profile
- `GET /api/users/me/stats` — Get dashboard stats

### Admin
- `GET /api/admin/stats` — Platform statistics (admin only)
- `GET /api/admin/users` — List all users (admin only)
- `DELETE /api/admin/users/:id` — Delete user (admin only)

### Security
- `POST /api/security/demo` — Run password hashing demo

## Technology Stack

| Layer          | Technology              |
|---------------|-------------------------|
| Frontend      | React 19, Vite 6        |
| Styling       | Tailwind CSS v4          |
| Icons         | Lucide React             |
| Routing       | React Router v7          |
| Backend       | Node.js, Express         |
| Database      | PostgreSQL               |
| ORM           | Prisma                   |
| Auth          | JWT + Argon2             |
| Validation    | Zod                      |

## License

This project is for educational/demonstration purposes.
