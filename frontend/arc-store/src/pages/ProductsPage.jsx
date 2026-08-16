import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';

import ProductGrid from '../components/product/ProductGrid';
import { categories } from '../data/categories';
import { apiRequest } from '../services/api';

const PAGE_SIZE = 12;

// ==========================================================
// BACKEND PRODUCT -> FRONTEND PRODUCT
// ==========================================================

function mapProduct(product) {
  const price = Number(product.Price ?? 0);
  const listPrice = Number(product.List_Price ?? price);

  const discount =
    listPrice > price
      ? Math.round(((listPrice - price) / listPrice) * 100)
      : 0;

  const badges = [];

  if (product.BestSeller) {
    badges.push('bestseller');
  }

  if (product.Prime) {
    badges.push('prime');
  }

  if (product.AmazonChoice) {
    badges.push('amazon-choice');
  }

  // ========================================================
  // DATABASE CATEGORY -> FRONTEND CATEGORY
  // ========================================================

  const categoryMap = {
    Electronics: 'electronics',
    Beauty: 'beauty',
    Fashion: 'clothing',
    Home: 'home-kitchen',
    Books: 'books',
    Other: 'accessories',
  };

  const category =
    categoryMap[product.Category] ||
    String(product.Category || 'other')
      .toLowerCase()
      .replace(/\s+/g, '-');

  // ========================================================
  // PRODUCT
  // ========================================================

  return {
    // REAL DATABASE PRODUCT ID
    id: product.Product_ID,

    // REAL DATABASE PRODUCT ID AS SKU
    sku: product.Product_ID,

    name: product.Product_Name,

    category,

    // Backend has no separate subcategory
    subcategory: product.Category,

    price,

    listPrice,

    discount,

    rating: Number(product.Rating ?? 0),

    reviews: Number(product.Reviews ?? 0),

    stock: Number(product.Stock ?? 0),

    // DIRECTLY FROM DATABASE
    image: product.Image_URL || '',

    description: product.Description || '',

    brand: product.Brand || '',

    status: product.Status || '',

    badges,
  };
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [layout, setLayout] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ==========================================================
  // LOAD PRODUCTS FROM BACKEND
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        setLoading(true);
        setError('');

        console.log('Loading products from backend...');

        const data = await apiRequest('/products/');

        const mappedProducts = data.map(mapProduct);

        if (!cancelled) {
          setProducts(mappedProducts);

          console.log(
            'PRODUCTS LOADED FROM BACKEND:',
            mappedProducts.length
          );
        }
      } catch (err) {
        console.error('PRODUCT LOAD ERROR:', err);

        if (!cancelled) {
          setError(
            err.message || 'Unable to load products.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================================
  // URL FILTERS
  // ==========================================================

  const activeCategory =
    searchParams.get('category') || '';

  const activeSub =
    searchParams.get('sub') || '';

  const searchQuery =
    (searchParams.get('search') || '')
      .toLowerCase()
      .trim();

  const sortBy =
    searchParams.get('sort') || 'featured';

  const minRating =
    Number(searchParams.get('rating') || 0);

  // 0 means NO price filter
  const maxPrice =
    Number(searchParams.get('maxPrice') || 0);

  // ==========================================================
  // SET URL PARAM
  // ==========================================================

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);

    if (value === '' || value == null) {
      next.delete(key);
    } else {
      next.set(key, value);
    }

    setSearchParams(next);

    // Reset load-more whenever filter changes
    setVisibleCount(PAGE_SIZE);
  };

  // ==========================================================
  // FILTER + SORT
  // ==========================================================

  const filtered = useMemo(() => {
    let list = [...products];

    // CATEGORY
    if (activeCategory) {
      list = list.filter(
        (product) =>
          product.category === activeCategory
      );
    }

    // SUBCATEGORY
    if (activeSub) {
      list = list.filter(
        (product) =>
          product.subcategory === activeSub
      );
    }

    // SEARCH
    if (searchQuery) {
      list = list.filter((product) => {
        const name =
          product.name?.toLowerCase() || '';

        const description =
          product.description?.toLowerCase() || '';

        const category =
          product.category?.toLowerCase() || '';

        const brand =
          product.brand?.toLowerCase() || '';

        return (
          name.includes(searchQuery) ||
          description.includes(searchQuery) ||
          category.includes(searchQuery) ||
          brand.includes(searchQuery)
        );
      });
    }

    // RATING
    if (minRating > 0) {
      list = list.filter(
        (product) =>
          product.rating >= minRating
      );
    }

    // PRICE
    // Only apply when user selected a max price
    if (maxPrice > 0) {
      list = list.filter(
        (product) =>
          product.price <= maxPrice
      );
    }

    // SORT
    switch (sortBy) {
      case 'price-asc':
        list.sort(
          (a, b) =>
            a.price - b.price
        );
        break;

      case 'price-desc':
        list.sort(
          (a, b) =>
            b.price - a.price
        );
        break;

      case 'rating':
        list.sort(
          (a, b) =>
            b.rating - a.rating
        );
        break;

      case 'newest':
        list.sort(
          (a, b) =>
            (b.badges.includes('new') ? 1 : 0) -
            (a.badges.includes('new') ? 1 : 0)
        );
        break;

      default:
        break;
    }

    return list;
  }, [
    products,
    activeCategory,
    activeSub,
    searchQuery,
    sortBy,
    minRating,
    maxPrice,
  ]);

  // ==========================================================
  // VISIBLE PRODUCTS
  // ==========================================================

  const visible = filtered.slice(
    0,
    visibleCount
  );

  // ==========================================================
  // ACTIVE CATEGORY
  // ==========================================================

  const activeCategoryObj =
    categories.find(
      (category) =>
        category.id === activeCategory
    );

  // ==========================================================
  // CLEAR FILTERS
  // ==========================================================

  const clearAll = () => {
    setSearchParams({});
    setVisibleCount(PAGE_SIZE);
  };

  // ==========================================================
  // LOAD MORE
  // ==========================================================

  const hasMore =
    visibleCount < filtered.length;

  const handleLoadMore = () => {
    setVisibleCount(
      (current) =>
        Math.min(
          current + PAGE_SIZE,
          filtered.length
        )
    );
  };

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <div className="container empty-state empty-state--tall">
        <h2>Loading products...</h2>

        <p>
          Fetching the latest products
          from the database.
        </p>
      </div>
    );
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {
    return (
      <div className="container empty-state empty-state--tall">
        <h2>Unable to load products</h2>

        <p>{error}</p>

        <button
          className="catalog__clear"
          onClick={() =>
            window.location.reload()
          }
        >
          Try again
        </button>
      </div>
    );
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <div className="catalog">
      <div className="container">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="catalog__head">
          <div>

            <h1>
              {activeCategoryObj
                ? activeCategoryObj.name
                : searchQuery
                  ? `Results for "${searchParams.get('search')}"`
                  : 'All Products'}
            </h1>

            <p>
              Showing {visible.length} of{' '}
              {filtered.length} products
            </p>

          </div>

          <div className="catalog__controls">

            {/* SORT */}

            <select
              value={sortBy}
              onChange={(e) =>
                setParam(
                  'sort',
                  e.target.value
                )
              }
              aria-label="Sort products"
            >
              <option value="featured">
                Sort: Featured
              </option>

              <option value="price-asc">
                Price: Low to High
              </option>

              <option value="price-desc">
                Price: High to Low
              </option>

              <option value="rating">
                Highest Rated
              </option>

              <option value="newest">
                Newest
              </option>
            </select>

            {/* LAYOUT */}

            <div className="catalog__layout-toggle">

              <button
                className={
                  layout === 'grid'
                    ? 'is-active'
                    : ''
                }
                aria-label="Grid view"
                onClick={() =>
                  setLayout('grid')
                }
              >
                <LayoutGrid size={16} />
              </button>

              <button
                className={
                  layout === 'list'
                    ? 'is-active'
                    : ''
                }
                aria-label="List view"
                onClick={() =>
                  setLayout('list')
                }
              >
                <List size={16} />
              </button>

            </div>

            {/* FILTER BUTTON */}

            <button
              className="catalog__filter-toggle"
              onClick={() =>
                setFiltersOpen(
                  (value) => !value
                )
              }
            >
              <SlidersHorizontal size={16} />
              Filters
            </button>

          </div>
        </div>

        {/* ==================================================
            BODY
        ================================================== */}

        <div className="catalog__body">

          {/* FILTER SIDEBAR */}

          <aside
            className={`catalog__filters ${
              filtersOpen
                ? 'is-open'
                : ''
            }`}
          >

            <div className="catalog__filters-head">

              <h3>Filters</h3>

              <button
                aria-label="Close filters"
                onClick={() =>
                  setFiltersOpen(false)
                }
              >
                <X size={18} />
              </button>

            </div>

            {/* CATEGORY */}

            <div className="filter-group">

              <h4>Category</h4>

              <label className="filter-radio">

                <input
                  type="radio"
                  name="cat"
                  checked={!activeCategory}
                  onChange={() =>
                    setParam(
                      'category',
                      ''
                    )
                  }
                />

                All Categories

              </label>

              {categories.map(
                (category) => (
                  <label
                    className="filter-radio"
                    key={category.id}
                  >

                    <input
                      type="radio"
                      name="cat"
                      checked={
                        activeCategory ===
                        category.id
                      }
                      onChange={() =>
                        setParam(
                          'category',
                          category.id
                        )
                      }
                    />

                    {category.name}

                  </label>
                )
              )}

            </div>

            {/* PRICE */}

            <div className="filter-group">

              <h4>
                {maxPrice > 0
                  ? `Max Price: $${maxPrice}`
                  : 'Max Price: No Limit'}
              </h4>

              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={
                  maxPrice > 0
                    ? maxPrice
                    : 5000
                }
                onChange={(e) =>
                  setParam(
                    'maxPrice',
                    e.target.value
                  )
                }
              />

              {maxPrice > 0 && (
                <button
                  className="catalog__clear"
                  onClick={() =>
                    setParam(
                      'maxPrice',
                      ''
                    )
                  }
                >
                  Remove price limit
                </button>
              )}

            </div>

            {/* RATING */}

            <div className="filter-group">

              <h4>
                Minimum Rating
              </h4>

              {[0, 3, 4, 4.5].map(
                (rating) => (

                  <label
                    className="filter-radio"
                    key={rating}
                  >

                    <input
                      type="radio"
                      name="rating"
                      checked={
                        minRating ===
                        rating
                      }
                      onChange={() =>
                        setParam(
                          'rating',
                          rating
                        )
                      }
                    />

                    {rating === 0
                      ? 'Any rating'
                      : `${rating}+ stars`}

                  </label>

                )
              )}

            </div>

            {/* CLEAR */}

            <button
              className="catalog__clear"
              onClick={clearAll}
            >
              Clear all filters
            </button>

          </aside>

          {/* RESULTS */}

          <div
            className={`catalog__results ${
              layout === 'list'
                ? 'catalog__results--list'
                : ''
            }`}
          >

            <ProductGrid
              products={visible}
            />

            {/* LOAD MORE */}

            {hasMore && (
              <div className="catalog__load-more">

                <button
                  onClick={handleLoadMore}
                >
                  Load more products
                </button>

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}