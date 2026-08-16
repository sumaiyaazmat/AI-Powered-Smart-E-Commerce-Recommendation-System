import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  User,
  Search as SearchIcon,
  LogOut,
} from 'lucide-react';

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
  const { isAuthenticated, user, logout } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // ============================
  // LOGOUT
  // ============================
  const handleLogout = () => {
    logout();

    setMobileOpen(false);

    navigate('/');

    console.log('USER LOGGED OUT');
  };

  return (
    <>
      <motion.header
        className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <div className="container navbar__inner">

          {/* ============================
              MOBILE MENU BUTTON
          ============================ */}
          <button
            className="navbar__hamburger"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>


          {/* ============================
              LOGO
          ============================ */}
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">ARC</span>
            <span className="navbar__logo-sub">market</span>
          </Link>


          {/* ============================
              DESKTOP NAVIGATION
          ============================ */}
          <nav className="navbar__links" aria-label="Primary">

            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className="nav-link"
              >
                {l.label}
              </NavLink>
            ))}

            <CategoryDropdown />

          </nav>


          {/* ============================
              DESKTOP SEARCH
          ============================ */}
          <div className="navbar__search-desktop">
            <SearchBar />
          </div>


          {/* ============================
              NAVBAR ACTIONS
          ============================ */}
          <div className="navbar__actions">

            {/* Search */}
            <button
              className="navbar__icon-only"
              aria-label="Search"
              onClick={() => setMobileSearchOpen((v) => !v)}
            >
              <SearchIcon size={20} />
            </button>


            {/* ============================
                ACCOUNT - DESKTOP
            ============================ */}
            {isAuthenticated ? (
              <div className="navbar__account">

                <div className="navbar__account-user">
                  <User size={20} />

                  <span className="navbar__account-name">
                    {user?.name || 'Account'}
                  </span>
                </div>

                <button
                  type="button"
                  className="navbar__logout"
                  onClick={handleLogout}
                >
                  <LogOut size={17} />
                  <span>Logout</span>
                </button>

              </div>
            ) : (
              <Link
                to="/login"
                className="navbar__icon-only"
                aria-label="Account"
              >
                <User size={20} />
              </Link>
            )}


            {/* Cart */}
            <button
              className="navbar__icon-only navbar__cart"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart size={20} />

              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  className="navbar__cart-badge"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 20,
                  }}
                >
                  {itemCount}
                </motion.span>
              )}
            </button>

          </div>
        </div>


        {/* ============================
            MOBILE SEARCH
        ============================ */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              className="navbar__search-mobile"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <div className="container">
                <SearchBar
                  onNavigate={() => setMobileSearchOpen(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.header>


      {/* ============================
          MOBILE NAVIGATION DRAWER
      ============================ */}
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
              transition={{
                type: 'spring',
                stiffness: 320,
                damping: 34,
              }}
            >

              <div className="mobile-drawer__head">

                <span className="navbar__logo-mark">
                  ARC
                </span>

                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                >
                  <X size={22} />
                </button>

              </div>


              <nav className="mobile-drawer__links">

                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                  </NavLink>
                ))}


                {/* Categories */}
                <span className="mobile-drawer__label">
                  Categories
                </span>

                <div className="mobile-drawer__cats">

                  {[
                    'electronics',
                    'beauty',
                    'clothing',
                    'home-kitchen',
                    'books',
                    'sports',
                    'grocery',
                    'accessories',
                  ].map((id) => (
                    <Link
                      key={id}
                      to={`/products?category=${id}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {id.replace('-', ' & ')}
                    </Link>
                  ))}

                </div>


                {/* ============================
                    MOBILE ACCOUNT
                ============================ */}
                {isAuthenticated ? (
                  <>
                    <div className="mobile-drawer__user">
                      <User size={18} />

                      <span>
                        {user?.name || 'Account'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="mobile-drawer__logout"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login / Sign Up
                  </Link>
                )}

              </nav>

            </motion.aside>
          </>
        )}
      </AnimatePresence>


      {/* ============================
          CART DRAWER
      ============================ */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />

    </>
  );
}