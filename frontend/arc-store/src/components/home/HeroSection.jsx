import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import Button from '../ui/Button';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true">
        <motion.span
          className="hero__blob hero__blob--a"
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="hero__blob hero__blob--b"
          animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="hero__grid-lines" />
      </div>

      <div className="container hero__inner">
        <motion.div
          className="hero__copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="eyebrow eyebrow--light">The everyday marketplace</span>
          <h1>
            Fewer, better things —
            <br /> delivered without the noise.
          </h1>
          <p className="hero__sub">
            ARC curates electronics, beauty, home, and everyday essentials from
            makers who actually stand behind them. No endless scroll — just
            the good stuff, organized.
          </p>
          <div className="hero__cta">
            <Button as={Link} to="/products" variant="accent" size="lg" icon={ArrowRight} iconPosition="right">
              Shop Now
            </Button>
            <Button as={Link} to="/products" variant="ghost-light" size="lg" icon={Compass}>
              Explore Products
            </Button>
          </div>
          <div className="hero__stats">
            <div>
              <strong>1,200+</strong>
              <span>Curated products</span>
            </div>
            <div>
              <strong>48hr</strong>
              <span>Average dispatch</span>
            </div>
            <div>
              <strong>4.6★</strong>
              <span>Average rating</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.92, rotate: 3 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
        >
          <div className="hero__visual-card hero__visual-card--main">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=700&h=820&q=80"
              alt="Curated ARC products arranged on a shelf"
            />
          </div>
          <motion.div
            className="hero__floating-tag"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <span className="price-tag__notch" aria-hidden="true" />
            <span className="price">$59.00</span>
            <span className="hero__floating-tag-label">Halo Speaker</span>
          </motion.div>
          <motion.div
            className="hero__floating-badge"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
          >
            Free returns, 30 days
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
