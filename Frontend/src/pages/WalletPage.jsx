import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wallet, TrendingDown, TrendingUp, Download, Gift } from 'lucide-react';
import { LoadingSpinner, SkeletonGrid } from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import '../styles/wallet.css';

function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingCoins, setBuyingCoins] = useState(false);
  const [claimingReward, setClaimingReward] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, transRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions'),
      ]);

      setWallet(walletRes.data.data);
      setTransactions(transRes.data.data.transactions || []);
    } catch (error) {
      toast.error('Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCoins = async (amount) => {
    setBuyingCoins(true);
    try {
      const response = await api.post('/paystack/initialize', {
        amount,
        email: user.email,
      });

      window.location.href = response.data.data.authorizationUrl;
    } catch (error) {
      toast.error('Failed to initialize payment');
      setBuyingCoins(false);
    }
  };

  const handleDailyReward = async () => {
    setClaimingReward(true);
    try {
      const response = await api.post('/wallet/daily-reward');
      setWallet(response.data.data);
      toast.success(response.data.message);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setClaimingReward(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="wallet-page">
      <section className="wallet-header">
        <Wallet size={40} />
        <h1>My Wallet</h1>
      </section>

      <section className="wallet-balance">
        <div className="balance-card">
          <p className="label">Available Coins</p>
          <h2 className="amount">{wallet?.balance || 0}</h2>
          <p className="subtext">₦{(wallet?.balance * 100).toLocaleString() || 0}</p>
          <div className="stats">
            <span>Earned: {wallet?.totalEarned || 0}</span>
            <span>Spent: {wallet?.totalSpent || 0}</span>
          </div>
        </div>
      </section>

      <section className="daily-reward">
        <button
          className="btn-reward"
          onClick={handleDailyReward}
          disabled={claimingReward}
        >
          <Gift size={20} />
          {claimingReward ? 'Claiming...' : 'Claim Daily Reward (5 coins)'}
        </button>
      </section>

      <section className="buy-coins">
        <h2>Buy Coins</h2>
        <div className="coin-packages">
          {[
            { coins: 110, price: 1000 },
            { coins: 540, price: 5000, popular: true }
            { coins: 220, price: 2000 },
            { coins: 330, price: 3000 },
          ].map((pkg) => (
            <div key={pkg.coins} className={`coin-package ${pkg.popular ? 'popular' : ''}`}>
              {pkg.popular && <span className="badge">Popular</span>}
              <h3>{pkg.coins} Coins</h3>
              <p className="price">₦{pkg.price.toLocaleString()}</p>
              <button
                className="btn-primary"
                onClick={() => handleBuyCoins(pkg.price)}
                disabled={buyingCoins}
              >
                {buyingCoins ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="transactions">
        <h2>Transaction History</h2>
        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx._id} className="transaction-item">
                <div className="tx-info">
                  {tx.amount < 0 ? (
                    <TrendingDown size={20} className="icon-out" />
                  ) : (
                    <TrendingUp size={20} className="icon-in" />
                  )}
                  <div>
                    <span className="tx-desc">{tx.description}</span>
                    <span className="tx-date">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className={`amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                  {tx.amount < 0 ? '' : '+'}{tx.amount}
                </span>
              </div>
            ))
          ) : (
            <p className="no-transactions">No transactions yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default WalletPage;
