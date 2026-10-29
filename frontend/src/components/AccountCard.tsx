import { useState, useEffect } from 'react';
import { Account } from '../types';
import { accountAPI } from '../services/api';
import { Wallet, RefreshCw, CheckCircle, XCircle, Lock } from 'lucide-react';

interface AccountCardProps {
  account: Account;
  onRefresh: () => void;
}

export default function AccountCard({ account }: AccountCardProps) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, [account._id]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getBalance(account._id);
      setBalance(response.balance);
    } catch (err) {
      console.error('Failed to fetch balance:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBalance();
    setRefreshing(false);
  };

  const getStatusColor = () => {
    switch (account.status) {
      case 'active':
        return 'text-emerald-400 bg-emerald-500/10';
      case 'frozen':
        return 'text-blue-400 bg-blue-500/10';
      case 'closed':
        return 'text-red-400 bg-red-500/10';
      default:
        return 'text-slate-400 bg-slate-500/10';
    }
  };

  const getStatusIcon = () => {
    switch (account.status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'frozen':
        return <Lock className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Account</h3>
            <p className="text-slate-400 text-sm">***{account._id.slice(-6)}</p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw
            className={`w-5 h-5 text-slate-400 ${refreshing ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      <div className="mb-4">
        <p className="text-slate-400 text-sm mb-1">Balance</p>
        {loading ? (
          <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
        ) : (
          <p className="text-3xl font-bold text-white">
            {account.currency} {balance?.toFixed(2) || '0.00'}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-700">
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium capitalize">{account.status}</span>
        </div>
        <span className="text-slate-500 text-xs">
          {new Date(account.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
