import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);
    await signup(form);
    setLoading(false);
    showToast('Account created. Welcome to ARC.');
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
        <h1>Create your account</h1>
        <p className="auth-card__sub">Save items, speed through checkout, track every order.</p>
        <p className="auth-card__notice">
          Frontend demo — no account is created on a server yet. This form is wired for a future backend.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="field">
            <span>Full name</span>
            <div className="field__input">
              <User size={16} />
              <input required value={form.name} onChange={update('name')} placeholder="Jordan Lee" />
            </div>
          </label>

          <label className="field">
            <span>Email</span>
            <div className="field__input">
              <Mail size={16} />
              <input type="email" required value={form.email} onChange={update('email')} placeholder="you@email.com" />
            </div>
          </label>

          <label className="field">
            <span>Password</span>
            <div className="field__input">
              <Lock size={16} />
              <input type="password" required value={form.password} onChange={update('password')} placeholder="••••••••" />
            </div>
          </label>

          <label className="field">
            <span>Confirm password</span>
            <div className="field__input">
              <Lock size={16} />
              <input type="password" required value={form.confirm} onChange={update('confirm')} placeholder="••••••••" />
            </div>
          </label>

          {error && <p className="field__error">{error}</p>}

          <Button type="submit" variant="primary" size="lg" className="w-full" icon={UserPlus} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account'}
          </Button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
