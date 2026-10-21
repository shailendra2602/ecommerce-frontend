
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => Boolean(localStorage.getItem("token"))
  );

  const { cart } = useCart();
  const navigate = useNavigate();

  const totalItems = cart.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  // Login status ko update karna
  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };

    window.addEventListener("storage", checkLoginStatus);
    window.addEventListener("authChange", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
      window.removeEventListener("authChange", checkLoginStatus);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    closeMenu();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo" onClick={closeMenu}>
          MyStore
        </Link>

        {/* Desktop / Mobile Links */}
        <div
          className={`nav-links ${menuOpen ? "nav-links-open" : ""
            }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/products"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
            onClick={closeMenu}
          >
            Products
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `cart-link ${isActive ? "active" : ""}`
            }
            onClick={closeMenu}
          >
            <span>Cart 🛒</span>

            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* Login / Logout */}
          {isLoggedIn ? (
            <button
              type="button"
              className="login-link"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                isActive ? "active login-link" : "login-link"
              }
              onClick={closeMenu}
            >
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
