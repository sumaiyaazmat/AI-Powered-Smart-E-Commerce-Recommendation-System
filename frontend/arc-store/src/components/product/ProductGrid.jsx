import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
    },
  },
};

export default function ProductGrid({
  products,
  emptyMessage = 'No products match your filters yet.',
}) {
  if (!products.length) {
    return (
      <div className="empty-state">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="product-grid"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {products.map((p) => (
        <motion.div key={p.id} variants={item}>
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}