const LABELS = {
  bestseller: 'Bestseller',
  new: 'New',
};

export default function ProductBadge({ type }) {
  if (!LABELS[type]) return null;
  return <span className={`badge badge--${type}`}>{LABELS[type]}</span>;
}

// The signature "price ticket" chip — echoes a torn retail price tag,
// set in mono type like a receipt printer. Used anywhere a price appears.
export function PriceTag({ price, originalPrice, discount }) {
  return (
    <span className="price-tag">
      <span className="price-tag__notch" aria-hidden="true" />
      <span className="price price-tag__price">${price.toFixed(2)}</span>
      {discount > 0 && (
        <>
          <span className="price-tag__original">${originalPrice.toFixed(2)}</span>
          <span className="price-tag__discount">-{discount}%</span>
        </>
      )}
    </span>
  );
}
