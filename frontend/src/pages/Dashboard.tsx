import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { accountAPI } from '../services/api';
import { Account } from '../types';
import { Building2, Plus, LogOut, ArrowRightLeft, Wallet } from 'lucide-react';
import AccountCard from '../components/AccountCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await accountAPI.getAccounts();
      setAccounts(response.accounts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    try {
      setCreating(true);
      setError('');
      await accountAPI.createAccount();
      await fetchAccounts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setCreating(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="bg-slate-800/50 border-b border-slate-700 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Banking System</h1>
                <p className="text-sm text-slate-400">Welcome, {user?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate('/transfer')}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all transform hover:scale-105"
              >
                <ArrowRightLeft className="w-4 h-4" />
                <span>Transfer</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Your Accounts</h2>
          <p className="text-slate-400">Manage your banking accounts and view balances</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {accounts.map((account) => (
                <AccountCard key={account._id} account={account} onRefresh={fetchAccounts} />
              ))}

              <button
                onClick={handleCreateAccount}
                disabled={creating}
                className="bg-slate-800 border-2 border-dashed border-slate-700 rounded-2xl p-8 hover:border-emerald-500 hover:bg-slate-750 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                    {creating ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    ) : (
                      <Plus className="w-8 h-8 text-slate-400 group-hover:text-white transition-all" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">Create New Account</p>
                    <p className="text-slate-400 text-sm mt-1">
                      {creating ? 'Creating...' : 'Add another account'}
                    </p>
                  </div>
                </div>
              </button>
            </div>

            {accounts.length === 0 && !loading && (
              <div className="text-center py-12 bg-slate-800 rounded-2xl border border-slate-700">
                <Wallet className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No accounts yet</h3>
                <p className="text-slate-400 mb-6">
                  Create your first account to start managing your finances
                </p>
                <button
                  onClick={handleCreateAccount}
                  disabled={creating}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  <Plus className="w-5 h-5" />
                  <span>Create Account</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
