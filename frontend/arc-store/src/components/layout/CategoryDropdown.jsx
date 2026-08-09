import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { categories } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';

export default function CategoryDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(categories[0].id);
  const wrapRef = useRef(null);

  const activeCategory = categories.find((c) => c.id === active);
  const popular = getProductsByCategory(active).slice(0, 3);

  // Close on outside click / tap (needed now that the menu also opens on click).
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close on Escape for keyboard users.
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const closeAndNavigate = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div
      className="category-dropdown"
      ref={wrapRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="nav-link category-dropdown__trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Categories <ChevronDown size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="mega-menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16 }}
          >
            <div className="mega-menu__cats">
              {categories.map((c) => {
                const Icon = Icons[c.icon] || Icons.Tag;
                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`mega-menu__cat ${active === c.id ? 'is-active' : ''}`}
                    onMouseEnter={() => setActive(c.id)}
                    onClick={() => setActive(c.id)}
                  >
                    <Icon size={16} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>
            <div className="mega-menu__panel">
              <h4>{activeCategory.name}</h4>
              <div className="mega-menu__subcats">
                {activeCategory.subcategories.map((s) => (
                  <Link
                    key={s}
                    to={`/products?category=${active}&sub=${encodeURIComponent(s)}`}
                    onClick={closeAndNavigate}
                  >
                    {s}
                  </Link>
                ))}
              </div>
              {popular.length > 0 && (
                <>
                  <span className="mega-menu__popular-label">Popular right now</span>
                  <div className="mega-menu__popular">
                    {popular.map((p) => (
                      <Link key={p.id} to={`/product/${p.id}`} onClick={closeAndNavigate}>
                        <img src={p.image} alt="" />
                        <span>{p.name}</span>
                      </Link>
                    ))}
                  </div>
                </>
              )}
              <Link
                to={`/products?category=${active}`}
                className="mega-menu__all"
                onClick={closeAndNavigate}
              >
                View all {activeCategory.name} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
