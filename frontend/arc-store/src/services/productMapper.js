export function mapBackendProduct(product) {
  const price = Number(product.Price || 0);
  const listPrice = Number(product.List_Price || price);

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

  return {
    // IMPORTANT:
    // Actual database Product_ID
    id: product.Product_ID,

    // Explicit SKU
    sku: product.Product_ID,

    name: product.Product_Name,

    category: product.Category,

    // Backend doesn't currently have Subcategory
    subcategory: product.Category,

    price,

    listPrice,

    discount,

    rating: Number(product.Rating || 0),

    reviews: Number(product.Reviews || 0),

    stock: Number(product.Stock || 0),

    image: product.Image_URL,

    description: product.Description || '',

    brand: product.Brand || '',

    status: product.Status || '',

    badges,
  };
}
