import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import products from "../data/products";

function Home() {
  return (
    <div className="home">

      {/* Sale Banner */}
      <div className="sale-banner">
        <div className="sale-content">
          <p className="sale-small">
            LIMITED TIME OFFER
          </p>

          <h1>BIG SALE</h1>

          <h2>UP TO 50% OFF</h2>

          <p>
            Grab the best deals on electronics
            and gadgets.
          </p>

          <Link
            to="/products"
            className="sale-button"
          >
            Shop Now →
          </Link>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="home-content">
        <h1>Welcome to MyStore</h1>

        <p>
          Discover our latest products and best deals.
        </p>
      </div>

      {/* Featured Products */}
      <section className="featured-products">
        <h2>Featured Products</h2>

        <div className="products">
          {products.slice(0, 6).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

        <div className="view-all-products">
          <Link to="/products">
            View All Products →
          </Link>
        </div>
      </section>

    </div>
  );
}

export default Home;