import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const total = cart.reduce(
    (sum, product) =>
      sum + product.price * product.quantity,
    0
  );

  const totalItems = cart.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <div className="cart-page">

      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Looks like you haven't added anything yet.
          </p>

          <Link
            to="/products"
            className="continue-shopping"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">

          {/* LEFT SIDE */}

          <div className="cart-items">

            {cart.map((product) => (
              <div
                className="cart-card"
                key={product.id}
              >

                <img
                  src={product.image}
                  alt={product.name}
                  className="cart-product-image"
                />

                <div className="cart-product-info">

                  <h3>{product.name}</h3>

                  <p className="cart-category">
                    {product.category}
                  </p>

                  <p className="cart-price">
                    ₹{product.price.toLocaleString("en-IN")}
                  </p>

                </div>

                <div className="quantity">
                  <button
                    onClick={() =>
                      decreaseQuantity(product.id)
                    }
                  >
                    -
                  </button>

                  <span>{product.quantity}</span>

                  <button
                    onClick={() =>
                      increaseQuantity(product.id)
                    }
                  >
                    +
                  </button>
                </div>

              </div>
            ))}

          </div>


          {/* RIGHT SIDE */}

          <div className="order-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>

              <span className="free">
                Free
              </span>
            </div>

            <div className="summary-line"></div>

            <div className="summary-total">
              <span>Total</span>

              <span>
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>

            <Link
              to="/checkout"
              className="checkout-button"
            >
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="continue-shopping-cart"
            >
              Continue Shopping
            </Link>

          </div>

        </div>
      )}

    </div>
  );
}

export default Cart;