import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Users, Trophy, CheckCircle } from 'lucide-react';
import '../styles/admin.css';

function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [contests, setContests] = useState([]);
  const [entries, setEntries] = useState([]);
  const [tab, setTab] = useState('overview');

  useEffect(() => {
    if (user?.role !== 'admin') return;
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const contestsRes = await api.get('/contests?limit=100');
      setContests(contestsRes.data.contests);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  if (user?.role !== 'admin') {
    return <div className="error">Access denied. Admin only.</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="tab-navigation">
        <button
          className={`tab-btn ${tab === 'overview' ? 'active' : ''}`}
          onClick={() => setTab('overview')}
        >
          <BarChart size={20} /> Overview
        </button>
        <button
          className={`tab-btn ${tab === 'contests' ? 'active' : ''}`}
          onClick={() => setTab('contests')}
        >
          <Trophy size={20} /> Contests
        </button>
        <button
          className={`tab-btn ${tab === 'entries' ? 'active' : ''}`}
          onClick={() => setTab('entries')}
        >
          <CheckCircle size={20} /> Entries
        </button>
        <button
          className={`tab-btn ${tab === 'users' ? 'active' : ''}`}
          onClick={() => setTab('users')}
        >
          <Users size={20} /> Users
        </button>
      </div>

      {tab === 'contests' && (
        <section className="admin-section">
          <h2>Manage Contests</h2>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Contestants</th>
                <th>Total Votes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contests.map((contest) => (
                <tr key={contest._id}>
                  <td>{contest.title}</td>
                  <td>{contest.status}</td>
                  <td>0</td>
                  <td>{contest.totalVotes}</td>
                  <td>
                    <button className="action-btn">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}

export default AdminDashboard;
