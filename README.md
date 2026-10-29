# Backend Banking System

A full-stack banking application with a React and TypeScript frontend and an Express, Node.js, and MongoDB backend. Users can register, create accounts, view balances, and transfer funds between accounts.

## Features

- User registration and login with JWT authentication
- Protected account and transaction endpoints
- Create accounts and retrieve account balances
- Transfer funds with transaction records and idempotency keys
- Ledger entries for transaction debits and credits
- Responsive React frontend

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Prerequisites

- Node.js and npm
- MongoDB configured as a replica set. The transaction endpoints use MongoDB sessions, which require a replica set.

## Run locally

### 1. Configure the backend

```powershell
cd backend
npm install
```

Create `backend/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/banking-system?replicaSet=rs0
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
```

Use your MongoDB connection string and a unique, strong JWT secret. Make sure your MongoDB replica set is running and initialized.

Start the backend:

```powershell
npm start
```

The API runs at `http://localhost:3000` by default.

### 2. Configure and run the frontend

In another terminal:

```powershell
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000/api
```

Start the frontend:

```powershell
npm run dev
```

Open the local URL printed by Vite (by default, `http://localhost:5173`).

## API overview

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/logout` | Log out |
| `POST` | `/api/accounts/create` | Create an account (authenticated) |
| `GET` | `/api/accounts/get` | Get the user's accounts (authenticated) |
| `GET` | `/api/accounts/get-balance/:accountId` | Get an account balance (authenticated) |
| `POST` | `/api/transactions` | Transfer funds (authenticated) |
| `POST` | `/api/transactions/system/initial-funds` | Add initial funds (system user only) |

The frontend expects the backend at `http://localhost:3000`; configure `VITE_API_URL` if it is hosted elsewhere. The backend's CORS configuration currently allows `http://localhost:5173`.

## Useful frontend commands

Run these from `frontend/`:

```powershell
npm run build
npm run lint
npm run typecheck
```

## Repository structure

```text
backend/
  server.js
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
frontend/
  src/
    components/
    contexts/
    pages/
    services/
    types/
```

See [frontend/README.md](./frontend/README.md) for frontend-specific details.
