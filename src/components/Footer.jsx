import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* Brand */}

        <div className="footer-section">
          <h2>MyStore</h2>

          <p>
            Your one-stop destination for quality
            products at the best prices.
          </p>
        </div>


        {/* Quick Links */}

        <div className="footer-section">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>

          <Link to="/products">
            Products
          </Link>

          <Link to="/cart">
            Cart
          </Link>

          <Link to="/login">
            Login
          </Link>
        </div>


        {/* Customer Service */}

        <div className="footer-section">
          <h3>Customer Service</h3>

          <a href="#">Contact Us</a>

          <a href="#">Shipping Policy</a>

          <a href="#">Return Policy</a>

          <a href="#">Privacy Policy</a>
        </div>


        {/* Social */}

        <div className="footer-section">
          <h3>Follow Us</h3>

          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
        </div>

      </div>


      <div className="footer-bottom">
        <p>
          © 2026 MyStore. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;