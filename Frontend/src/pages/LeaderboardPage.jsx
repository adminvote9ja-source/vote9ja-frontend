import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Trophy, Medal } from 'lucide-react';
import '../styles/leaderboard.css';

function LeaderboardPage() {
  const { contestId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [contestId]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`/leaderboard/${contestId}`);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
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

  if (loading) return <div className="loading">Loading leaderboard...</div>;

  return (
    <div className="leaderboard-page">
      <section className="leaderboard-header">
        <Trophy size={40} />
        <h1>Live Leaderboard</h1>
      </section>

      <section className="leaderboard-table">
        <table>
          <thead>
            <tr>
              <th>Position</th>
              <th>Contestant</th>
              <th>Votes</th>
              <th>Prize</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry._id} className={index < 3 ? 'top-three' : ''}>
                <td className="position">{getMedalIcon(index + 1)}</td>
                <td className="contestant">
                  <img src={entry.contestantId.avatar} alt={entry.contestantId.username} />
                  {entry.contestantId.username}
                </td>
                <td className="votes">{entry.votes}</td>
                <td className="prize">
                  {index === 0 && '₦100,000'}
                  {index === 1 && '₦50,000'}
                  {index === 2 && '₦30,000'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default LeaderboardPage;
