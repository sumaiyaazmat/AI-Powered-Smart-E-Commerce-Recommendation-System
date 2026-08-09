import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login({ email, password });
    setLoading(false);
    showToast(`Welcome back${email ? ', ' + email.split('@')[0] : ''}.`);
    navigate('/');
  };

  return (
    <div className="container auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1>Welcome back</h1>
        <p className="auth-card__sub">Log in to track orders and pick up your cart where you left off.</p>
        <p className="auth-card__notice">
          Frontend demo — no account is created on a server yet. This form is wired for a future backend.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Email</span>
            <div className="field__input">
              <Mail size={16} />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="field__input">
              <Lock size={16} />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
          </label>

          <div className="auth-card__row">
            <label className="checkbox">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember me
            </label>
            <a href="#" className="auth-card__forgot">Forgot password?</a>
          </div>

          <Button type="submit" variant="primary" size="lg" className="w-full" icon={LogIn} disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="auth-card__switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
