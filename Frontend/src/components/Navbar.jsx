import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Wallet, LogOut, LogIn } from 'lucide-react';
import { useState } from 'react';
import '../styles/navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          🏆 Vote9ja
        </Link>
        
        <button 
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/feed" className="nav-link">Feed</Link>
          
          {user ? (
            <>
              <Link to="/wallet" className="nav-link">
                <Wallet size={18} /> Wallet
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="nav-link">Admin</Link>
              )}
              <button 
                className="nav-link logout-btn"
                onClick={logout}
              >
                <LogOut size={18} /> Logout
              </button>
              <span className="user-info">{user.username}</span>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <LogIn size={18} /> Login
              </Link>
              <Link to="/register" className="nav-link signup">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
