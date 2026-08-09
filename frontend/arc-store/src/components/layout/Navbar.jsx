import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Search as SearchIcon } from 'lucide-react';
import CategoryDropdown from './CategoryDropdown';
import SearchBar from './SearchBar';
import CartDrawer from '../cart/CartDrawer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
  }, [mobileOpen]);

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container navbar__inner">
          <button className="navbar__hamburger" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
            <Menu size={22} />
          </button>

          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">ARC</span>
            <span className="navbar__logo-sub">market</span>
          </Link>

          <nav className="navbar__links" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} className="nav-link">
                {l.label}
              </NavLink>
            ))}
            <CategoryDropdown />
          </nav>

          <div className="navbar__search-desktop">
            <SearchBar />
          </div>

          <div className="navbar__actions">
            <button
              className="navbar__icon-only"
              aria-label="Search"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <SearchIcon size={20} />
            </button>
            <Link to="/login" className="navbar__icon-only" aria-label="Account">
              <User size={20} />
              {isAuthenticated && <span className="navbar__user-dot" title={user?.name} />}
            </Link>
            <button className="navbar__icon-only navbar__cart" aria-label="Open cart" onClick={() => setCartOpen(true)}>
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  className="navbar__cart-badge"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              className="navbar__search-mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="container">
                <SearchBar onNavigate={() => setMobileSearchOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Mobile navigation drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="mobile-drawer"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            >
              <div className="mobile-drawer__head">
                <span className="navbar__logo-mark">ARC</span>
                <button aria-label="Close menu" onClick={() => setMobileOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <nav className="mobile-drawer__links">
                {links.map((l) => (
                  <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setMobileOpen(false)}>
                    {l.label}
                  </NavLink>
                ))}
                <span className="mobile-drawer__label">Categories</span>
                <div className="mobile-drawer__cats">
                  {[
                    'electronics', 'beauty', 'clothing', 'home-kitchen',
                    'books', 'sports', 'grocery', 'accessories',
                  ].map((id) => (
                    <Link key={id} to={`/products?category=${id}`} onClick={() => setMobileOpen(false)}>
                      {id.replace('-', ' & ')}
                    </Link>
                  ))}
                </div>
                <Link to="/login" onClick={() => setMobileOpen(false)}>Login / Sign Up</Link>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
