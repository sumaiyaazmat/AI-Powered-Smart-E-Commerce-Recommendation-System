import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { searchProducts } from '../../data/products';

export default function SearchBar({ compact = false, onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const navigate = useNavigate();

  const results = query.trim() ? searchProducts(query).slice(0, 6) : [];

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className={`search-bar ${compact ? 'search-bar--compact' : ''}`} ref={wrapRef}>
      <form onSubmit={submitSearch}>
        <Search size={17} className="search-bar__icon" />
        <input
          type="search"
          placeholder="Search products, brands, categories..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          aria-label="Search products"
        />
        {query && (
          <button type="button" aria-label="Clear search" className="search-bar__clear" onClick={() => setQuery('')}>
            <X size={14} />
          </button>
        )}
      </form>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.ul
            className="search-suggestions"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {results.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setOpen(false);
                    setQuery('');
                    onNavigate?.();
                  }}
                >
                  <img src={p.image} alt="" />
                  <span>
                    <strong>{p.name}</strong>
                    <em>{p.category.replace('-', ' & ')}</em>
                  </span>
                  <span className="price">${p.price.toFixed(2)}</span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
