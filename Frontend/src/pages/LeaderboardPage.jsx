import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Trophy, Medal, TrendingUp } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import '../styles/leaderboard.css';

function LeaderboardPage() {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchData();

    // Auto-refresh leaderboard every 10 seconds
    if (autoRefresh) {
      const interval = setInterval(fetchData, 10000);
      return () => clearInterval(interval);
    }
  }, [contestId, autoRefresh]);

  const fetchData = async () => {
    try {
      const [leaderboardRes, contestRes] = await Promise.all([
        api.get(`/leaderboard/${contestId}`),
        api.get(`/contests/${contestId}`),
      ]);

      setLeaderboard(leaderboardRes.data.data);
      setContest(contestRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch leaderboard');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return position;
  };

  const getPrize = (position) => {
    const prizes = contest?.prizes || [];
    const prize = prizes.find((p) => p.position === position);
    return prize?.amount || 0;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="leaderboard-page">
      <section className="leaderboard-header">
        <div className="header-content">
          <div className="header-title">
            <Trophy size={40} className="trophy-icon" />
            <div>
              <h1>Live Leaderboard</h1>
              {contest && <p className="contest-name">{contest.title}</p>}
            </div>
          </div>

          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto-refresh (10s)</span>
          </label>
        </div>

        {contest && (
          <div className="contest-info">
            <div className="info-item">
              <span>Status:</span>
              <span className="badge">{contest.status}</span>
            </div>
            <div className="info-item">
              <span>Total Votes:</span>
              <span>{contest.totalVotes}</span>
            </div>
          </div>
        )}
      </section>

      <section className="leaderboard-table-section">
        {leaderboard.length > 0 ? (
          <div className="table-wrapper">
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th className="position-col">Position</th>
                  <th className="contestant-col">Contestant</th>
                  <th className="votes-col">
                    <TrendingUp size={18} />
                    Votes
                  </th>
                  <th className="prize-col">Prize</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr
                    key={entry._id}
                    className={`
                      leaderboard-row
                      ${index < 3 ? 'top-three' : ''}
                      ${index === 0 ? 'first-place' : ''}
                      ${index === 1 ? 'second-place' : ''}
                      ${index === 2 ? 'third-place' : ''}
                    `}
                  >
                    <td className="position-col">
                      <span className="medal">{getMedalIcon(index + 1)}</span>
                      <span className="position-number">#{index + 1}</span>
                    </td>
                    <td className="contestant-col">
                      <img
                        src={entry.contestantId?.avatar || 'https://via.placeholder.com/40'}
                        alt={entry.contestantId?.username}
                        className="contestant-avatar"
                      />
                      <div className="contestant-info">
                        <p className="contestant-name">{entry.contestantId?.username}</p>
                        <p className="contestant-bio">{entry.contestantId?.bio}</p>
                      </div>
                    </td>
                    <td className="votes-col">
                      <span className="vote-count">{entry.votes}</span>
                    </td>
                    <td className="prize-col">
                      {getPrize(index + 1) > 0 ? (
                        <span className="prize-amount">₦{getPrize(index + 1).toLocaleString()}</span>
                      ) : (
                        <span className="no-prize">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-entries">
            <p>No entries yet</p>
          </div>
        )}
      </section>

      <section className="leaderboard-footer">
        <p>Leaderboard updates in real-time. Refresh manually if auto-refresh is disabled.</p>
      </section>
    </div>
  );
}

export default LeaderboardPage;
