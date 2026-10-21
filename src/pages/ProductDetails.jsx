import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import products from "../data/products";
function ProductDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <Link to="/products">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      <div className="product-details-card">

        {/* Product Image */}

        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
          />
        </div>

        {/* Product Information */}

        <div className="product-details-info">

          <p className="product-category">
            {product.category}
          </p>

          <h1>{product.name}</h1>

          <div className="product-rating">
            ⭐⭐⭐⭐⭐
            <span>4.5</span>
          </div>

          <h2 className="product-details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </h2>

          <p className="product-description">
            {product.description}
          </p>

          <div className="product-actions">

            <button
              className="add-cart-button"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <Link
              to="/cart"
              className="buy-now-button"
            >
              Go to Cart
            </Link>

          </div>

          <div className="product-features">

            <div>
              🚚 <span>Free Shipping</span>
            </div>

            <div>
              🔄 <span>7 Days Return</span>
            </div>

            <div>
              🔒 <span>Secure Payment</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ProductDetails;