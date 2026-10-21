import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setSuccess("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSuccess("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response.success) {
        setSuccess(response.message || "Login successful!");

        // JWT token save karo
        if (response.token) {
          localStorage.setItem("token", response.token);

          window.dispatchEvent(new Event("authChange"));
        }

        // User details available hon to save karo
        if (response.user) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.user)
          );
        }

        setFormData({
          email: "",
          password: "",
        });

        // Login ke baad home page par bhejo
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setErrors({
          general: response.message || "Login failed",
        });
      }
    } catch (error) {
      setErrors({
        general: error.message || "Unable to login. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to continue to MyStore</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />

            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={
                  errors.password ? "input-error" : ""
                }
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {errors.password && (
              <p className="error-message">
                {errors.password}
              </p>
            )}
          </div>

          {/* API Error */}
          {errors.general && (
            <p className="error-message">{errors.general}</p>
          )}

          {/* Success */}
          {success && (
            <div className="success-message">{success}</div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
