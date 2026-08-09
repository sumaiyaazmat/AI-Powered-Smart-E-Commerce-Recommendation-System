import { motion } from 'framer-motion';
import RatingStars from '../ui/RatingStars';

const reviews = [
  { name: 'Priya M.', rating: 5, text: 'The checkout was so quick and my headphones arrived a day early. Packaging felt genuinely premium.' },
  { name: 'Daniel K.', rating: 5, text: 'Finally a store that isn\u2019t trying to sell me ten thousand near-identical options. Easy to trust.' },
  { name: 'Sara L.', rating: 4, text: 'Great product quality across three orders now. Wish delivery windows were a touch tighter, but no complaints.' },
];

export default function CustomerReviews() {
  return (
    <section className="section">
      <div className="container">
        <div className="section__head">
          <span className="eyebrow">Trusted by shoppers</span>
          <h2>What people are saying</h2>
        </div>
        <div className="review-grid">
          {reviews.map((r, i) => (
            <motion.blockquote
              key={r.name}
              className="review-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <RatingStars rating={r.rating} />
              <p>{r.text}</p>
              <footer>{r.name}</footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
