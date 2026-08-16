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



//
//  const handleSubmit = async (e) => {
//   e.preventDefault();
//   setLoading(true);
//
//   try {
//     const loggedInUser = await login({
//       email,
//       password,
//     });
//
//     showToast(
//       `Welcome back, ${loggedInUser.name || email.split('@')[0]}.`
//     );
//
//     navigate('/');
//   } catch (error) {
//     showToast(error.message || 'Login failed');
//   } finally {
//     setLoading(false);
//   }
// };


const handleSubmit = async (e) => {
  e.preventDefault();


  setLoading(true);

  try {
    console.log("Calling login API...");

    const loggedInUser = await login({
      email,
      password,
    });

    console.log("LOGIN API SUCCESS:", loggedInUser);

    showToast(
      `Welcome back, ${loggedInUser.name || email.split('@')[0]}.`
    );

    navigate('/');
  } catch (error) {
    console.error("LOGIN API ERROR:", error);

    showToast(error.message || 'Login failed');
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
        <h1>Welcome back</h1>
        <p className="auth-card__sub">Log in to track orders and pick up your cart where you left off.</p>
      

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

 <button
  type="button"
  className="btn btn--primary btn--lg w-full"
  onClick={() => {
    console.log("🔥 LOGIN BUTTON CLICKED DIRECTLY");
    handleSubmit({
      preventDefault: () => {},
    });
  }}
>
  {loading ? 'Logging in…' : 'Login'}
</button>
        </form>

        <p className="auth-card__switch">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}
