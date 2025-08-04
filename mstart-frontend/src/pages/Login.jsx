import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      const data = res.data;

      setMessage(t("login.success"));
      setIsError(false);

      localStorage.setItem("user", JSON.stringify(data));
      console.log("Logged in customerId:", data.customerId);

      localStorage.setItem("customerId", String(data.customerId));
      if (data.role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/products");
      }
    } catch (err) {
      console.log(err);
      setMessage(t("login.error"));
      setIsError(true);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "400px", width: "100%", borderRadius: "10px" }}
      >
        <div className="card-body p-4">
          <h2 className="card-title text-center mb-4 fw-bold text-primary">
            {t("login.title")}
          </h2>
          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                {t("login.email")}
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-semibold">
                {t("login.password")}
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              style={{ letterSpacing: "0.05em" }}
            >
              {t("login.button")}
            </button>

            {message && (
              <div
                className={`mt-3 text-center fw-semibold ${
                  isError ? "text-danger" : "text-success"
                }`}
                role="alert"
              >
                {message}
              </div>
            )}

            <p className="text-center mt-3">
              {t("login.noAccount")}{" "}
              <a
                href="/register"
                className="text-primary text-decoration-none"
              >
                {t("login.register")}
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
