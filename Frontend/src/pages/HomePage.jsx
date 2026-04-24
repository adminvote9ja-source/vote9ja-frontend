import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ContestCard from '../components/ContestCard';
import { TrendingUp, Zap } from 'lucide-react';
import '../styles/home.css';

function HomePage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchContests();
  }, []);

  const fetchContests = async () => {
    try {
      const response = await api.get('/contests?status=active&limit=12');
      setContests(response.data.contests);
    } catch (error) {
      console.error('Failed to fetch contests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>🏆 Vote9ja</h1>
          <p>Nigeria's Premier Online Contest Platform</p>
          <div className="hero-features">
            <div className="feature">
              <Zap className="icon" />
              <span>Real-time Voting</span>
            </div>
            <div className="feature">
              <TrendingUp className="icon" />
              <span>Live Leaderboard</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contests-section">
        <h2>Active Contests</h2>
        
        {loading ? (
          <div className="loading">Loading contests...</div>
        ) : contests.length > 0 ? (
          <div className="contests-grid">
            {contests.map((contest) => (
              <ContestCard key={contest._id} contest={contest} />
            ))}
          </div>
        ) : (
          <p className="no-contests">No active contests at the moment</p>
        )}
      </section>

      {!user && (
        <section className="cta-section">
          <h2>Ready to start voting?</h2>
          <p>Join thousands of Nigerians in discovering and voting for amazing talents</p>
          <a href="/register" className="cta-btn">Get Started</a>
        </section>
      )}
    </div>
  );
}

export default HomePage;
