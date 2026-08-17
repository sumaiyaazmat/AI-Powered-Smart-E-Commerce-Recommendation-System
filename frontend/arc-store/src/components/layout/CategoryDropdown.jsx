import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ChevronDown } from 'lucide-react';

import { categories } from '../../data/categories';
import { apiRequest } from '../../services/api';

export default function CategoryDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(categories[0].id);
  const [products, setProducts] = useState([]);

  const wrapRef = useRef(null);

  // ==========================================================
  // LOAD REAL PRODUCTS FROM BACKEND
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const data = await apiRequest('/products/');

        if (!cancelled) {
          setProducts(data);
          console.log(
            'CATEGORY DROPDOWN PRODUCTS:',
            data.length
          );
        }
      } catch (error) {
        console.error(
          'CATEGORY DROPDOWN PRODUCT ERROR:',
          error
        );
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // ACTIVE CATEGORY
  // ==========================================================

  const activeCategory = categories.find(
    (c) => c.id === active
  );

  // ==========================================================
  // FRONTEND CATEGORY -> DATABASE CATEGORY
  // ==========================================================

  const categoryMap = {
    electronics: 'Electronics',
    beauty: 'Beauty',
    clothing: 'Fashion',
    'home-kitchen': 'Home',
    books: 'Books',
    sports: 'Sports',
    grocery: 'Grocery',
    accessories: 'Other',
  };

  const databaseCategory =
    categoryMap[active];

  // ==========================================================
  // REAL POPULAR PRODUCTS
  // ==========================================================

  const popular = products
    .filter(
      (product) =>
        product.Category === databaseCategory
    )
    .sort(
      (a, b) =>
        Number(b.Reviews ?? 0) -
        Number(a.Reviews ?? 0)
    )
    .slice(0, 3);

  // ==========================================================
  // CLOSE ON OUTSIDE CLICK
  // ==========================================================

  useEffect(() => {
    const handler = (e) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handler
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handler
      );
    };
  }, []);

  // ==========================================================
  // CLOSE ON ESCAPE
  // ==========================================================

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener(
      'keydown',
      handler
    );

    return () => {
      document.removeEventListener(
        'keydown',
        handler
      );
    };
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
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 8,
            }}
            transition={{
              duration: 0.16,
            }}
          >
            {/* ==================================================
                CATEGORY LIST
            ================================================== */}

            <div className="mega-menu__cats">
              {categories.map((c) => {
                const Icon =
                  Icons[c.icon] || Icons.Tag;

                return (
                  <button
                    key={c.id}
                    type="button"
                    className={`mega-menu__cat ${
                      active === c.id
                        ? 'is-active'
                        : ''
                    }`}
                    onMouseEnter={() =>
                      setActive(c.id)
                    }
                    onClick={() =>
                      setActive(c.id)
                    }
                  >
                    <Icon size={16} />
                    <span>{c.name}</span>
                  </button>
                );
              })}
            </div>

            {/* ==================================================
                CATEGORY PANEL
            ================================================== */}

            <div className="mega-menu__panel">
              <h4>
                {activeCategory.name}
              </h4>

              {/* SUBCATEGORIES */}

              <div className="mega-menu__subcats">
                {activeCategory.subcategories.map(
                  (s) => (
                    <Link
                      key={s}
                      to={`/products?category=${active}&sub=${encodeURIComponent(
                        s
                      )}`}
                      onClick={
                        closeAndNavigate
                      }
                    >
                      {s}
                    </Link>
                  )
                )}
              </div>

              {/* ==================================================
                  REAL PRODUCTS FROM MYSQL
              ================================================== */}

              {popular.length > 0 && (
                <>
                  <span className="mega-menu__popular-label">
                    Popular right now
                  </span>

                  <div className="mega-menu__popular">
                    {popular.map((p) => (
                      <Link
                        key={p.Product_ID}
                        to={`/product/${p.Product_ID}`}
                        onClick={
                          closeAndNavigate
                        }
                      >
                        <img
                          src={
                            p.Image_URL || ''
                          }
                          alt={p.Product_Name}
                        />

                        <span>
                          {p.Product_Name}
                        </span>
                      </Link>
                    ))}
                  </div>
                </>
              )}

              {/* VIEW ALL */}

              <Link
                to={`/products?category=${active}`}
                className="mega-menu__all"
                onClick={
                  closeAndNavigate
                }
              >
                View all{' '}
                {activeCategory.name} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}