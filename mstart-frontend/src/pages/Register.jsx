import React, { useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSuccess(false);
      setMessage(t("register.passwordMismatch"));
      return;
    }

    const dataToSend = {
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
    };

    try {
      const res = await API.post("/auth/register", dataToSend);
      console.log(res.data.message);
      setSuccess(true);
      setMessage(t("register.success"));
      setFormData({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
      setSuccess(false);
      setMessage(t("register.failure"));
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 px-3">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "600px", width: "100%", borderRadius: "12px" }}
      >
        <h2 className="text-center mb-4 fw-bold text-primary">
          {t("register.title")}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label fw-semibold">
                {t("register.fullName")}
              </label>
              <input
                id="name"
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("register.fullNamePlaceholder")}
                required
                autoFocus
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="email" className="form-label fw-semibold">
                {t("register.email")}
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("register.emailPlaceholder")}
                required
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="phone" className="form-label fw-semibold">
                {t("register.phone")}
              </label>
              <input
                id="phone"
                type="tel"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t("register.phonePlaceholder")}
                required
                pattern="[0-9]{10}"
                title={t("register.phonePatternTitle")}
                maxLength={10}
                inputMode="numeric"
              />
              <small className="text-muted">{t("register.phoneNote")}</small>
            </div>

            <div className="col-md-6">
              <label htmlFor="gender" className="form-label fw-semibold">
                {t("register.gender")}
              </label>
              <select
                id="gender"
                className="form-select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">{t("register.select")}</option>
                <option value="female">{t("register.female")}</option>
                <option value="male">{t("register.male")}</option>
                <option value="other">{t("register.other")}</option>
              </select>
            </div>

            <div className="col-md-6">
              <label htmlFor="password" className="form-label fw-semibold">
                {t("register.password")}
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("register.passwordPlaceholder")}
                required
                minLength={6}
              />
              <small className="text-muted">{t("register.passwordNote")}</small>
            </div>

            <div className="col-md-6">
              <label
                htmlFor="confirmPassword"
                className="form-label fw-semibold"
              >
                {t("register.confirmPassword")}
              </label>
              <input
                id="confirmPassword"
                type="password"
                className="form-control"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("register.confirmPasswordPlaceholder")}
                required
                minLength={6}
              />
            </div>

            <div className="col-md-6">
              <label htmlFor="dateOfBirth" className="form-label fw-semibold">
                {t("register.dateOfBirth")}
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className="form-control"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div className="col-12 mt-3">
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
              >
                {t("register.submit")}
              </button>
            </div>
          </div>
        </form>
        <p className="text-center mt-3">
          {t("register.alreadyHaveAccount")}{" "}
          <Link to="/login" className="text-primary fw-semibold">
            {t("register.loginHere")}
          </Link>
          .
        </p>
        {message && (
          <p
            className={`mt-3 text-center fw-semibold ${
              success ? "text-primary" : "text-danger"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default Register;
