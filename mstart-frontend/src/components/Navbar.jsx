import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Navbar() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return null;
    return {
      ...storedUser,
      photoUrl: `https://localhost:7294/api/customer/${
        storedUser.customerId
      }/photo?${Date.now()}`,
    };
  });

  const [cartCount, setCartCount] = useState(0);

  // تحديث عدد المنتجات في السلة من localStorage
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(totalCount);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        ...storedUser,
        photoUrl: `https://localhost:7294/api/customer/${
          storedUser.customerId
        }/photo?${Date.now()}`,
      });
    } else {
      setUser(null);
    }
    updateCartCount();
  }, [location]);

  useEffect(() => {
    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const isLoggedIn = !!user;
  const userRole = user?.role;

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.customerId) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await fetch(
        `https://localhost:7294/api/customer/${user.customerId}/upload-photo`,
        {
          method: "POST",
          body: formData,
        }
      );
      alert(t("navbar.photoUploadSuccess"));
      setUser((prev) => ({
        ...prev,
        photoUrl: `https://localhost:7294/api/customer/${
          user.customerId
        }/photo?${Date.now()}`,
      }));
    } catch (error) {
      console.error(error);
      alert(t("navbar.photoUploadError"));
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark shadow fixed-top"
        style={{
          background:
            "linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #1e3c72 100%)",
        }}
      >
        <div className="container">
          <Link className="navbar-brand fw-bold fs-3" to="/">
            🛍️ {t("navbar.brandName")}
          </Link>

          {/* زر القائمة في الهاتف */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* روابط التنقل */}
          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div className="navbar-nav ms-auto align-items-center gap-3">
              {/* تغيير اللغة */}
              <div className="nav-item dropdown">
                <button
                  className="btn btn-outline-light dropdown-toggle px-3 py-1"
                  id="languageDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ minWidth: "90px" }}
                >
                  {/* عرض اللغة الحالية بشكل مختصر */}
                  {i18n.language === "ar" ? "العربية 🇸🇦" : "English 🇺🇸"}
                </button>
                <ul
                  className={`dropdown-menu ${
                    document.documentElement.dir === "rtl"
                      ? "dropdown-menu-start"
                      : "dropdown-menu-end"
                  }`}
                  aria-labelledby="languageDropdown"
                >
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={() => changeLanguage("ar")}
                      disabled={i18n.language === "ar"}
                    >
                      <span>🇸🇦</span> العربية
                    </button>
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center gap-2"
                      onClick={() => changeLanguage("en")}
                      disabled={i18n.language === "en"}
                    >
                      <span>🇺🇸</span> English
                    </button>
                  </li>
                </ul>
              </div>

              {/* روابط حسب تسجيل الدخول */}
              {!isLoggedIn ? (
                <>
                  <Link
                    className="btn btn-outline-light rounded-pill px-4"
                    to="/"
                  >
                    {t("navbar.home")}
                  </Link>
                  <Link
                    className="btn btn-outline-info rounded-pill px-4"
                    to="/login"
                  >
                    {t("navbar.login")}
                  </Link>
                  <Link
                    className="btn btn-warning rounded-pill px-4 fw-semibold"
                    to="/register"
                  >
                    {t("navbar.register")}
                  </Link>
                </>
              ) : (
                <>
                  {userRole === "admin" && (
                    <>
                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/admin-dashboard"
                      >
                        {t("navbar.statistics")}
                      </Link>
                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/customers"
                      >
                        {t("navbar.customers")}
                      </Link>
                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/products"
                      >
                        {t("navbar.products")}
                      </Link>
                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/orders"
                      >
                        {t("navbar.orders")}
                      </Link>
                    </>
                  )}

                  {userRole === "customer" && (
                    <>
                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/products"
                      >
                        {t("navbar.products")}
                      </Link>

                      <Link
                        className="nav-link text-light fw-semibold"
                        to="/order"
                      >
                        {t("navbar.myOrders")}
                      </Link>

                      {/* أيقونة السلة مع العدد */}
                      <Link
                        to="/cart"
                        className="nav-link position-relative text-light fw-semibold"
                        style={{ fontSize: "1.3rem" }}
                        title={t("navbar.cart")}
                      >
                        🛒
                        {cartCount > 0 && (
                          <span
                            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                            style={{ fontSize: "0.75rem" }}
                          >
                            {cartCount}
                            <span className="visually-hidden">
                              {t("navbar.cartItems")}
                            </span>
                          </span>
                        )}
                      </Link>
                    </>
                  )}

                  {/* معلومات المستخدم وصورته */}
                  <div className="nav-item dropdown d-flex align-items-center ms-3">
                    <img
                      src={user.photoUrl}
                      alt="User"
                      onError={(e) => (e.target.src = "/user.png")}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        border: "2px solid #f9d342",
                        objectFit: "cover",
                        cursor: "pointer",
                        marginRight: "8px",
                        transition: "transform 0.3s",
                      }}
                      onClick={() =>
                        document.getElementById("photoInput").click()
                      }
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                    <span
                      className="nav-link text-light dropdown-toggle"
                      role="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ cursor: "pointer", fontWeight: "600" }}
                    >
                      👋 {t("navbar.hello", { name: user.name })}
                    </span>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="userDropdown"
                    >
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          {t("navbar.logout")}
                        </button>
                      </li>
                    </ul>
                    <input
                      type="file"
                      id="photoInput"
                      style={{ display: "none" }}
                      accept="image/*"
                      onChange={handlePhotoChange}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ paddingTop: "75px" }}></div>
    </>
  );
}

export default Navbar;
