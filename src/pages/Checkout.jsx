
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  saveAddress,
  getAddresses,
} from "../services/addressService";

function Checkout() {
  const { cart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(true);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [addressForm, setAddressForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const total = cart.reduce(
    (sum, product) =>
      sum + Number(product.price) * Number(product.quantity),
    0
  );

  // Load saved addresses belonging to the logged-in user
  useEffect(() => {
    let active = true;

    const loadAddresses = async () => {
      try {
        const savedAddresses = await getAddresses();

        if (!active) return;

        setAddresses(savedAddresses);

        if (savedAddresses.length > 0) {
          setSelectedAddress(String(savedAddresses[0]._id));
          setShowAddressForm(false);
        } else {
          setShowAddressForm(true);
        }
      } catch (error) {
        if (active) {
          setErrorMessage(error.message);
        }
      } finally {
        if (active) {
          setLoadingAddresses(false);
        }
      }
    };

    loadAddresses();

    return () => {
      active = false;
    };
  }, []);

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setAddressForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setErrorMessage("");
  };

  // Validate address
  const validateAddress = () => {
    const newErrors = {};

    if (!addressForm.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!addressForm.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!addressForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressForm.email)
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!addressForm.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!addressForm.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!addressForm.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    } else if (!/^\d{6}$/.test(addressForm.postalCode)) {
      newErrors.postalCode = "Enter a valid 6 digit postal code";
    }

    if (!addressForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(addressForm.phone)) {
      newErrors.phone = "Enter a valid 10 digit phone number";
    }

    return newErrors;
  };

  // Save address through backend API
  const handleAddAddress = async (event) => {
    event.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const validationErrors = validateAddress();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    setSavingAddress(true);

    try {
      const result = await saveAddress(addressForm);
      const savedAddress = result.address;

      // Use MongoDB _id, not Date.now()
      setAddresses((previous) => [
        savedAddress,
        ...previous,
      ]);

      setSelectedAddress(String(savedAddress._id));

      setAddressForm({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        city: "",
        postalCode: "",
        phone: "",
      });

      setErrors({});
      setShowAddressForm(false);
      setSuccessMessage("Address saved successfully!");
    } catch (error) {
      setErrorMessage(error.message);

      if (
        error.message.toLowerCase().includes("token") ||
        error.message.toLowerCase().includes("login")
      ) {
        // Keep the error visible; user can sign in again.
      }
    } finally {
      setSavingAddress(false);
    }
  };

  // Place order (demo only; order API is not connected yet)
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      setErrorMessage("Please select a delivery address.");
      return;
    }

    const addressExists = addresses.some(
      (address) => String(address._id) === selectedAddress
    );

    if (!addressExists) {
      setErrorMessage("Please select a valid delivery address.");
      return;
    }

    alert(
      "Address selected successfully. Order API integration is the next step."
    );
  };

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products before checkout.</p>
        <Link to="/products">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-layout">
        {/* LEFT SIDE */}
        <div className="checkout-form">
          {/* DELIVERY ADDRESS */}
          <div className="checkout-section">
            <div className="checkout-section-header">
              <div>
                <h2>Delivery Address</h2>
                <p>Select an address or add a new one.</p>
              </div>

              {!showAddressForm && (
                <button
                  type="button"
                  className="add-address-button"
                  onClick={() => {
                    setShowAddressForm(true);
                    setSuccessMessage("");
                    setErrorMessage("");
                  }}
                >
                  + Add Address
                </button>
              )}
            </div>

            {loadingAddresses && <p>Loading saved addresses...</p>}

            {successMessage && (
              <div className="checkout-success">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="error-message" role="alert">
                {errorMessage}
              </div>
            )}

            {/* SAVED ADDRESSES */}
            {addresses.length > 0 && (
              <div className="saved-addresses">
                {addresses.map((address) => (
                  <label
                    key={address._id}
                    className={`address-card ${
                      selectedAddress === String(address._id)
                        ? "selected-address"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="selectedAddress"
                      value={address._id}
                      checked={
                        selectedAddress === String(address._id)
                      }
                      onChange={(event) => {
                        setSelectedAddress(event.target.value);
                        setErrorMessage("");
                      }}
                    />

                    <div className="address-content">
                      <div className="address-name">
                        {address.firstName} {address.lastName}
                      </div>

                      <p>{address.address}</p>
                      <p>
                        {address.city} - {address.postalCode}
                      </p>
                      <p>Phone: {address.phone}</p>
                      <p>Email: {address.email}</p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* ADD ADDRESS FORM */}
            {showAddressForm && (
              <form
                className="address-form"
                onSubmit={handleAddAddress}
              >
                <h3>Add New Address</h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={addressForm.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? "input-error" : ""}
                    />
                    {errors.firstName && (
                      <p className="error-message">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={addressForm.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? "input-error" : ""}
                    />
                    {errors.lastName && (
                      <p className="error-message">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={addressForm.email}
                    onChange={handleChange}
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    id="address"
                    name="address"
                    placeholder="Enter your full address"
                    value={addressForm.address}
                    onChange={handleChange}
                    className={errors.address ? "input-error" : ""}
                    rows="3"
                  />
                  {errors.address && (
                    <p className="error-message">{errors.address}</p>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      placeholder="City"
                      value={addressForm.city}
                      onChange={handleChange}
                      className={errors.city ? "input-error" : ""}
                    />
                    {errors.city && (
                      <p className="error-message">{errors.city}</p>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="postalCode">Postal Code</label>
                    <input
                      id="postalCode"
                      type="text"
                      name="postalCode"
                      placeholder="6 digit postal code"
                      value={addressForm.postalCode}
                      onChange={handleChange}
                      maxLength={6}
                      className={errors.postalCode ? "input-error" : ""}
                    />
                    {errors.postalCode && (
                      <p className="error-message">{errors.postalCode}</p>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="10 digit phone number"
                    value={addressForm.phone}
                    onChange={handleChange}
                    maxLength={10}
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && (
                    <p className="error-message">{errors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="save-address-button"
                  disabled={savingAddress}
                >
                  {savingAddress ? "Saving..." : "Save Address"}
                </button>
              </form>
            )}
          </div>

          {/* PAYMENT */}
          <div className="checkout-section">
            <h2>Payment Method</h2>

            <label className="payment-option">
              <input type="radio" name="payment" defaultChecked />
              <span>Cash on Delivery</span>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>UPI</span>
            </label>

            <label className="payment-option">
              <input type="radio" name="payment" />
              <span>Credit / Debit Card</span>
            </label>
          </div>
        </div>

        {/* RIGHT SIDE: ORDER SUMMARY */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>

          {cart.map((product) => (
            <div className="checkout-product" key={product.id}>
              <img src={product.image} alt={product.name} />

              <div>
                <h3>{product.name}</h3>
                <p>Qty: {product.quantity}</p>
              </div>

              <strong>
                ₹
                {(
                  Number(product.price) * Number(product.quantity)
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          <div className="checkout-line" />

          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="checkout-total-row">
            <span>Shipping</span>
            <span className="free">Free</span>
          </div>

          <div className="checkout-line" />

          <div className="checkout-grand-total">
            <span>Total</span>
            <span>₹{total.toLocaleString("en-IN")}</span>
          </div>

          {selectedAddress && (
            <button
              type="button"
              className="place-order-button"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Checkout;
