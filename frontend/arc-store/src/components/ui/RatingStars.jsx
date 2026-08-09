import { Star } from 'lucide-react';

export default function RatingStars({ rating, reviews, size = 14 }) {
  return (
    <div className="rating" aria-label={`Rated ${rating} out of 5`}>
      <div className="rating__stars">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={size}
            fill={i < Math.round(rating) ? 'var(--accent)' : 'none'}
            stroke={i < Math.round(rating) ? 'var(--accent)' : 'var(--muted-light)'}
          />
        ))}
      </div>
      <span className="rating__value">{rating.toFixed(1)}</span>
      {reviews != null && <span className="rating__count">({reviews})</span>}
    </div>
  );
}
