import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Trophy, Heart, MessageSquare, Share2 } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import '../styles/contestant-profile.css';

function ContestantProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileRes = await api.get(`/users/${id}`);
      setProfile(profileRes.data.data);

      // In production, you'd fetch user's contest entries
      // const entriesRes = await api.get(`/contests/entries?userId=${id}`);
      // setEntries(entriesRes.data.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await api.post(`/users/${id}/follow`);
      setFollowing(!following);
      toast.success(following ? 'Unfollowed' : 'Followed');
    } catch (error) {
      toast.error('Failed to follow user');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/contestant/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.username,
          text: `Check out ${profile?.username} on Vote9ja!`,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!profile) return <div className="not-found">Profile not found</div>;

  return (
    <div className="contestant-profile-page">
      <section className="profile-header">
        <div className="profile-cover" style={{ backgroundImage: 'url(https://via.placeholder.com/1200x300)' }}></div>

        <div className="profile-info-container">
          <img
            src={profile.avatar || 'https://via.placeholder.com/150'}
            alt={profile.username}
            className="profile-image"
          />

          <div className="profile-details">
            <div className="profile-name-section">
              <div>
                <h1>{profile.username}</h1>
                <p className="bio">{profile.bio || 'No bio yet'}</p>
              </div>

              {user?.id !== id && (
                <div className="action-buttons">
                  <button
                    className="btn-follow"
                    onClick={handleFollow}
                  >
                    {following ? 'Following' : 'Follow'}
                  </button>
                  <button
                    className="btn-share"
                    onClick={handleShare}
                    title="Share profile"
                  >
                    <Share2 size={20} />
                  </button>
                </div>
              )}
            </div>

            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">0</span>
                <span className="stat-label">Contests</span>
              </div>
              <div className="stat">
                <span className="stat-value">0</span>
                <span className="stat-label">Total Votes</span>
              </div>
              <div className="stat">
                <span className="stat-value">0</span>
                <span className="stat-label">Followers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-entries">
        <h2>Contest Entries</h2>
        {entries.length > 0 ? (
          <div className="entries-grid">
            {entries.map((entry) => (
              <div key={entry._id} className="entry-card-small">
                <img src={entry.mediaUrl} alt={entry.title} />
                <h4>{entry.title}</h4>
                <p>{entry.votes} votes</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-entries">No contest entries yet</p>
        )}
      </section>
    </div>
  );
}

export default ContestantProfilePage;
