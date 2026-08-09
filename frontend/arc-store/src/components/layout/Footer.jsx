import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Send } from 'lucide-react';
import { categories } from '../../data/categories';
import { useToast } from '../../context/ToastContext';

export default function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    showToast("You're subscribed. Welcome to ARC.");
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <span className="navbar__logo-mark footer__logo-mark">ARC</span>
          <p>
            A curated marketplace for everyday essentials — sourced carefully,
            delivered simply, built to last longer than the trend cycle.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
            <a href="#" aria-label="YouTube"><Youtube size={18} /></a>
          </div>
        </div>

        <div className="footer__col">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/products">All Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login">Login</Link>
          <Link to="/signup">Create Account</Link>
        </div>

        <div className="footer__col">
          <h4>Categories</h4>
          {categories.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/products?category=${c.id}`}>{c.name}</Link>
          ))}
        </div>

        <div className="footer__col">
          <h4>Customer Support</h4>
          <a href="#">Shipping Info</a>
          <a href="#">Returns & Exchanges</a>
          <a href="#">Order Tracking</a>
          <a href="#">FAQs</a>
          <div className="footer__contact">
            <p>hello@arcmarket.com</p>
            <p>+1 (555) 018-2043</p>
            <p>212 Market Street, Austin, TX</p>
          </div>
        </div>

        <div className="footer__col footer__newsletter">
          <h4>Stay in the loop</h4>
          <p>New arrivals and offers, once a week, no clutter.</p>
          <form onSubmit={handleSubscribe}>
            <Mail size={16} />
            <input
              type="email"
              required
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe">
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <span>© {new Date().getFullYear()} ARC Market. All rights reserved.</span>
          <div className="footer__legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
