import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { loginSchema } from '../utils/validation';
import { LogIn } from 'lucide-react';
import { LoadingSpinner } from '../components/LoadingSpinner';
import '../styles/auth.css';

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  const { register, handleSubmit, errors, isSubmitting, isValid } = useForm(
    loginSchema,
    handleSubmit
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">
          <LogIn size={32} /> Login to Vote9ja
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register('password')}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
