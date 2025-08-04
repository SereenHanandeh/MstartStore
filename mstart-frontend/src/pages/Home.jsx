import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function Home() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.role.toLowerCase() === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/products");
      }
    }
  }, []);

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-dark px-3">
      <div
        className="text-center p-5 bg-white rounded shadow-lg"
        style={{ maxWidth: "600px" }}
      >
        <h1 className="display-4 mb-4">{t("welcome")}</h1>
        <p className="lead mb-5">{t("description")}</p>
        <button
          className="btn btn-primary btn-lg px-5 py-3 shadow-sm"
          onClick={() => navigate("/login")}
        >
          {t("shopNow")}
        </button>
      </div>
    </div>
  );
}

export default Home;
