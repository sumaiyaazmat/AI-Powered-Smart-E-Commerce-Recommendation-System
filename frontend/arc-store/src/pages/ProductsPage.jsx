import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import { products } from '../data/products';
import { categories } from '../data/categories';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [layout, setLayout] = useState('grid');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeSub = searchParams.get('sub') || '';
  const searchQuery = (searchParams.get('search') || '').toLowerCase();
  const sortBy = searchParams.get('sort') || 'featured';
  const minRating = Number(searchParams.get('rating') || 0);
  const maxPrice = Number(searchParams.get('maxPrice') || 250);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === '' || value == null) next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (activeSub) list = list.filter((p) => p.subcategory === activeSub);
    if (searchQuery) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
      );
    }
    list = list.filter((p) => p.rating >= minRating && p.price <= maxPrice);

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list = [...list].sort((a, b) => (b.badges.includes('new') ? 1 : 0) - (a.badges.includes('new') ? 1 : 0));
        break;
      default:
        break;
    }
    return list;
  }, [activeCategory, activeSub, searchQuery, sortBy, minRating, maxPrice]);

  const visible = filtered.slice(0, visibleCount);
  const activeCategoryObj = categories.find((c) => c.id === activeCategory);

  const clearAll = () => setSearchParams({});

  return (
    <div className="catalog">
      <div className="container">
        <div className="catalog__head">
          <div>
            <h1>{activeCategoryObj ? activeCategoryObj.name : searchQuery ? `Results for "${searchParams.get('search')}"` : 'All Products'}</h1>
            <p>{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="catalog__controls">
            <select value={sortBy} onChange={(e) => setParam('sort', e.target.value)} aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
            <div className="catalog__layout-toggle">
              <button className={layout === 'grid' ? 'is-active' : ''} aria-label="Grid view" onClick={() => setLayout('grid')}>
                <LayoutGrid size={16} />
              </button>
              <button className={layout === 'list' ? 'is-active' : ''} aria-label="List view" onClick={() => setLayout('list')}>
                <List size={16} />
              </button>
            </div>
            <button className="catalog__filter-toggle" onClick={() => setFiltersOpen((v) => !v)}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>
        </div>

        <div className="catalog__body">
          <aside className={`catalog__filters ${filtersOpen ? 'is-open' : ''}`}>
            <div className="catalog__filters-head">
              <h3>Filters</h3>
              <button aria-label="Close filters" onClick={() => setFiltersOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="filter-group">
              <h4>Category</h4>
              <label className="filter-radio">
                <input type="radio" name="cat" checked={!activeCategory} onChange={() => setParam('category', '')} />
                All Categories
              </label>
              {categories.map((c) => (
                <label className="filter-radio" key={c.id}>
                  <input
                    type="radio"
                    name="cat"
                    checked={activeCategory === c.id}
                    onChange={() => setParam('category', c.id)}
                  />
                  {c.name}
                </label>
              ))}
            </div>

            <div className="filter-group">
              <h4>Max Price: ${maxPrice}</h4>
              <input
                type="range"
                min="10"
                max="250"
                step="5"
                value={maxPrice}
                onChange={(e) => setParam('maxPrice', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <h4>Minimum Rating</h4>
              {[0, 3, 4, 4.5].map((r) => (
                <label className="filter-radio" key={r}>
                  <input type="radio" name="rating" checked={minRating === r} onChange={() => setParam('rating', r)} />
                  {r === 0 ? 'Any rating' : `${r}+ stars`}
                </label>
              ))}
            </div>

            <button className="catalog__clear" onClick={clearAll}>Clear all filters</button>
          </aside>

          <div className={`catalog__results ${layout === 'list' ? 'catalog__results--list' : ''}`}>
            <ProductGrid products={visible} />
            {visibleCount < filtered.length && (
              <div className="catalog__load-more">
                <button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>Load more products</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
