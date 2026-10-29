# Banking System Frontend

A modern, production-ready frontend for a banking system built with React, TypeScript, and Tailwind CSS.

## Features

- **User Authentication**: Register and login with secure JWT-based authentication
- **Account Management**: Create and manage multiple banking accounts
- **Real-time Balance**: View account balances with live updates
- **Money Transfers**: Transfer funds between accounts with transaction tracking
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Protected Routes**: Secure access to authenticated pages

## Getting Started

### Prerequisites

Make sure your backend server is running on `http://localhost:3000` with the following endpoints:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/logout`
- POST `/api/accounts/create`
- GET `/api/accounts/get`
- GET `/api/accounts/get-balance/:accountId`
- POST `/api/transactions`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
VITE_API_URL=http://localhost:3000/api
```

3. Start the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── AccountCard.tsx
│   └── ProtectedRoute.tsx
├── contexts/          # React context providers
│   └── AuthContext.tsx
├── pages/             # Page components
│   ├── AuthPage.tsx
│   ├── Dashboard.tsx
│   └── TransferPage.tsx
├── services/          # API service layer
│   └── api.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── App.tsx            # Main app component with routing
└── main.tsx           # App entry point
```

## Usage

### Register a New User
1. Navigate to the home page
2. Click "Don't have an account? Sign up"
3. Enter username, email, and password
4. Click "Create Account"

### Create an Account
1. Log in to the dashboard
2. Click "Create New Account" card
3. Your new account will be created with INR currency

### Transfer Money
1. From the dashboard, click "Transfer" button
2. Select source and destination accounts
3. Enter the amount to transfer
4. Click "Complete Transfer"

### View Balance
- Account balances are displayed on each account card
- Click the refresh icon to update the balance

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

## API Integration

The app communicates with your backend using the following structure:

- **Authentication**: JWT tokens stored in localStorage
- **Authorization**: Bearer token sent in request headers
- **Error Handling**: User-friendly error messages for all API failures
- **Loading States**: Visual feedback during async operations
