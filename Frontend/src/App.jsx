import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ContestDetailsPage from './pages/ContestDetailsPage';
import ContestantProfilePage from './pages/ContestantProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import WalletPage from './pages/WalletPage';
import FeedPage from './pages/FeedPage';
import AdminDashboard from './pages/AdminDashboard';

import './styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/contests/:id" element={<ContestDetailsPage />} />
                <Route path="/contestant/:id" element={<ContestantProfilePage />} />
                <Route path="/leaderboard/:contestId" element={<LeaderboardPage />} />
                <Route path="/feed" element={<FeedPage />} />

                {/* User Only Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/wallet" element={<WalletPage />} />
                </Route>

                {/* Admin Only Routes */}
                <Route element={<PrivateRoute role="admin" />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>
              </Route>

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </AuthProvider>
        </Router>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
