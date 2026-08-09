import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { categories } from '../../data/categories';
import { getProductsByCategory } from '../../data/products';

export default function FeaturedCategories() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Browse by category</span>
          <h2>Shop the essentials</h2>
        </div>
        <div className="category-grid">
          {categories.map((c, i) => {
            const Icon = Icons[c.icon] || Icons.Tag;
            const count = getProductsByCategory(c.id).length;
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                whileHover={{ y: -5 }}
              >
                <Link to={`/products?category=${c.id}`} className="category-card">
                  <span className="category-card__icon">
                    <Icon size={22} />
                  </span>
                  <span className="category-card__name">{c.name}</span>
                  <span className="category-card__count">{count}+ products</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
