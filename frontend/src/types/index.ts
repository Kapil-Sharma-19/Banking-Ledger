export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Account {
  _id: string;
  user: string;
  status: 'active' | 'frozen' | 'closed';
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  _id: string;
  fromAccount: string;
  toAccount: string;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  amount: number;
  idempotencyKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AccountResponse {
  success: boolean;
  data?: Account;
  accounts?: Account[];
  message?: string;
}

export interface BalanceResponse {
  success: boolean;
  balance: number;
  message?: string;
}

export interface TransactionResponse {
  message: string;
  transaction: Transaction;
}
