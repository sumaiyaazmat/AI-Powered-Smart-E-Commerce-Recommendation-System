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

  try {
    console.log('SIGNUP BUTTON CLICKED');
    console.log('SIGNUP DATA:', {
      name: form.name,
      email: form.email,
    });

    const newUser = await signup({
      name: form.name,
      email: form.email,
      password: form.password,
    });

    console.log('SIGNUP API SUCCESS:', newUser);

    showToast('Account created. Welcome to ARC.');

    navigate('/');
  } catch (error) {
    console.error('SIGNUP API ERROR:', error);

    setError(error.message || 'Unable to create account.');
    showToast(error.message || 'Signup failed');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="auth-card__notice">
  Create an account to save items, speed through checkout, and track your orders.
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
