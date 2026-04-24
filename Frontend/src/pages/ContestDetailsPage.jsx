import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Vote, Upload, Users, Trophy, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import '../styles/contest-details.css';

function ContestDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const [contest, setContest] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(null);

  useEffect(() => {
    fetchContest();
  }, [id]);

  const fetchContest = async () => {
    try {
      const contestRes = await api.get(`/contests/${id}`);
      setContest(contestRes.data);
      
      const entriesRes = await api.get(`/contests/${id}/entries`);
      setEntries(entriesRes.data);
    } catch (error) {
      console.error('Failed to fetch contest:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (entryId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setVoting(entryId);
    try {
      await api.post('/voting/cast', {
        entryId,
        contestId: id,
      });
      
      // Refresh entries to show updated vote counts
      fetchContest();
    } catch (error) {
      alert(error.response?.data?.error || 'Voting failed');
    } finally {
      setVoting(null);
    }
  };

  if (loading) return <div className="loading">Loading contest...</div>;
  if (!contest) return <div>Contest not found</div>;

  return (
    <div className="contest-details-page">
      <section className="contest-header">
        <div className="contest-banner">
          <img src={contest.image} alt={contest.title} />
        </div>
        
        <div className="contest-info">
          <h1>{contest.title}</h1>
          <p className="description">{contest.description}</p>
          
          <div className="contest-stats">
            <div className="stat">
              <Trophy size={20} />
              <span>Prize Pool: ₦{contest.prizes.reduce((a, b) => a + b.amount, 0).toLocaleString()}</span>
            </div>
            <div className="stat">
              <Clock size={20} />
              <span>Ends {formatDistanceToNow(new Date(contest.endDate), { addSuffix: true })}</span>
            </div>
            <div className="stat">
              <Users size={20} />
              <span>{entries.length} Contestants</span>
            </div>
          </div>
        </div>
      </section>

      <section className="entries-section">
        <h2>Contestants</h2>
        
        <div className="entries-grid">
          {entries.map((entry) => (
            <div key={entry._id} className="entry-card">
              <div className="entry-media">
                {entry.mediaType === 'image' ? (
                  <img src={entry.mediaUrl} alt={entry.title} />
                ) : (
                  <video src={entry.mediaUrl} controls />
                )}
              </div>
              
              <div className="entry-details">
                <h3>{entry.title}</h3>
                <p className="contestant-name">by {entry.contestantId.username}</p>
                
                <div className="entry-stats">
                  <span className="vote-count">
                    <Vote size={16} /> {entry.votes} votes
                  </span>
                </div>
                
                <button
                  className="vote-btn"
                  onClick={() => handleVote(entry._id)}
                  disabled={voting === entry._id}
                >
                  {voting === entry._id ? 'Voting...' : 'Vote (1 coin)'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ContestDetailsPage;
