import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { User, Trophy, Heart } from 'lucide-react';
import '../styles/contestant-profile.css';

function ContestantProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const response = await api.get(`/users/${id}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="contestant-profile-page">
      <section className="profile-header">
        <img src={profile.avatar} alt={profile.username} className="profile-image" />
        <div className="profile-info">
          <h1>{profile.username}</h1>
          <p className="bio">{profile.bio}</p>
          <div className="profile-stats">
            <div className="stat">
              <Trophy size={20} />
              <span>Contests: 0</span>
            </div>
            <div className="stat">
              <Heart size={20} />
              <span>Total Votes: 0</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContestantProfilePage;
