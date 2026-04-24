import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContestDetailsPage from './pages/ContestDetailsPage';
import ContestantProfilePage from './pages/ContestantProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import FeedPage from './pages/FeedPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/contests/:id" element={<ContestDetailsPage />} />
            <Route path="/contestant/:id" element={<ContestantProfilePage />} />
            <Route path="/leaderboard/:contestId" element={<LeaderboardPage />} />
            <Route path="/feed" element={<FeedPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
