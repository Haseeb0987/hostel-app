import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Building2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    general: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "", general: "" });

    // Validation
    let hasError = false;
    const newErrors = { email: "", password: "", general: "" };

    if (!credentials.email) {
      newErrors.email = "Email is required";
      hasError = true;
    } else if (!validateEmail(credentials.email)) {
      newErrors.email = "Please enter a valid email address";
      hasError = true;
    }

    if (!credentials.password) {
      newErrors.password = "Password is required";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await login(credentials);
      // Navigation is handled by AuthContext
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setErrors({
          email: "",
          password: "",
          general: error.message || "Login failed. Please try again.",
        });
      } else {
        setErrors({
          email: "",
          password: "",
          general: "An unexpected error occurred. Please try again.",
        });
      }
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card shadow-lg border-0" style={{ borderRadius: "12px" }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div
                    className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(13, 110, 253, 0.1) 0%, rgba(13, 110, 253, 0.2) 100%)",
                    }}
                  >
                    <Building2 size={40} className="text-primary" />
                  </div>
                  <h4 className="fw-bold mb-1">Hostel Management</h4>
                  <p className="text-muted small mb-0">
                    Sign in to your account
                  </p>
                </div>

                {errors.general && (
                  <div
                    className="alert alert-danger py-2 small d-flex align-items-center"
                    role="alert"
                  >
                    <AlertCircle size={16} className="me-2" />
                    {errors.general}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label small fw-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? "is-invalid" : ""}`}
                      placeholder="Enter your email"
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          email: e.target.value,
                        })
                      }
                      disabled={isLoading}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.password ? "is-invalid" : ""}`}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) =>
                          setCredentials({
                            ...credentials,
                            password: e.target.value,
                          })
                        }
                        disabled={isLoading}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="remember"
                        disabled={isLoading}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="remember"
                      >
                        Remember me
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <small className="text-muted">
                    Demo: admin@hostel.com / Haseeb@0987
                  </small>
                </div>
              </div>
            </div>

            <div className="text-center mt-3">
              <small className="text-white">
                Al-Noor Boys Hostel Management System
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
