import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, subtitle, products, eyebrow }) {
  const trackRef = useRef(null);

  const scrollBy = (dir) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild?.offsetWidth || 280;
    track.scrollBy({ left: dir * (cardWidth + 20) * 2, behavior: 'smooth' });
  };

  if (!products.length) return null;

  return (
    <section className="carousel-section">
      <div className="container carousel-section__head">
        <div>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          {subtitle && <p className="carousel-section__subtitle">{subtitle}</p>}
        </div>
        <div className="carousel-nav">
          <button aria-label="Scroll left" className="icon-btn" onClick={() => scrollBy(-1)}>
            <ChevronLeft size={18} />
          </button>
          <button aria-label="Scroll right" className="icon-btn" onClick={() => scrollBy(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className="carousel-track" ref={trackRef}>
        {products.map((p) => (
          <div className="carousel-track__item" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
