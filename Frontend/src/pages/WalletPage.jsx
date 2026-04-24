import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Wallet, TrendingDown, TrendingUp, Download } from 'lucide-react';
import '../styles/wallet.css';

function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingCoins, setBuyingCoins] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const walletRes = await api.get('/wallet/balance');
      setWallet(walletRes.data);
      
      const transRes = await api.get('/wallet/transactions');
      setTransactions(transRes.data.transactions);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
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
      
      // Redirect to Paystack
      window.location.href = response.data.authorizationUrl;
    } catch (error) {
      alert('Failed to initialize payment');
    } finally {
      setBuyingCoins(false);
    }
  };

  const handleDailyReward = async () => {
    try {
      const response = await api.post('/wallet/daily-reward');
      alert(`Daily reward claimed! +${response.data.wallet.balance} coins`);
      fetchWalletData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to claim daily reward');
    }
  };

  if (loading) return <div className="loading">Loading wallet...</div>;

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
        </div>
      </section>

      <section className="buy-coins">
        <h2>Buy Coins</h2>
        <div className="coin-packages">
          {[
            { coins: 100, price: 50, popular: false },
            { coins: 500, price: 270, popular: true },
            { coins: 1000, price: 530, popular: false },
            { coins: 5000, price: 1700, popular: false },
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

      <section className="daily-reward">
        <button className="btn-primary" onClick={handleDailyReward}>
          Claim Daily Reward (5 coins)
        </button>
      </section>

      <section className="transactions">
        <h2>Transaction History</h2>
        <div className="transactions-list">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div key={tx._id} className="transaction-item">
                <div className="tx-info">
                  {tx.type === 'vote' ? (
                    <TrendingDown size={20} className="icon-out" />
                  ) : (
                    <TrendingUp size={20} className="icon-in" />
                  )}
                  <span>{tx.description}</span>
                </div>
                <span className={`amount ${tx.amount < 0 ? 'negative' : 'positive'}`}>
                  {tx.amount < 0 ? '' : '+'}{tx.amount}
                </span>
              </div>
            ))
          ) : (
            <p>No transactions yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default WalletPage;
