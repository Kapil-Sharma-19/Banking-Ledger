import { AuthResponse, AccountResponse, BalanceResponse, TransactionResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authAPI = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    return response.json();
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    return response.json();
  },

  logout: async (): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Logout failed');
    }
  },
};

export const accountAPI = {
  createAccount: async (): Promise<AccountResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create account');
    }
    return response.json();
  },

  getAccounts: async (): Promise<AccountResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/get`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch accounts');
    }
    return response.json();
  },

  getBalance: async (accountId: string): Promise<BalanceResponse> => {
    const response = await fetch(`${API_BASE_URL}/accounts/get-balance/${accountId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch balance');
    }
    return response.json();
  },
};

export const transactionAPI = {
  createTransaction: async (
    fromAccount: string,
    toAccount: string,
    amount: number,
    idempotencyKey: string
  ): Promise<TransactionResponse> => {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ fromAccount, toAccount, amount, idempotencyKey }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Transaction failed');
    }
    return response.json();
  },

  addInitialFunds: async (
    toAccount: string,
    amount: number,
    idempotencyKey: string
  ): Promise<TransactionResponse> => {
    const response = await fetch(`${API_BASE_URL}/transactions/system/initial-funds`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ toAccount, amount, idempotencyKey }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add initial funds');
    }
    return response.json();
  },
};
