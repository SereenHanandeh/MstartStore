import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    status: "",
    amount: "",
    currency: "",
    image: null, // ملف الصورة
  });
  const [statusFilter, setStatusFilter] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = "https://localhost:7294/api/product";

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(API);
        setProducts(res.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(API);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setError(t("products.alerts.addFail"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdate = async () => {
    try {
      if (editId) {
        // تحديث المنتج (بدون الصورة أولاً)
        await axios.put(`${API}/${editId}`, {
          id: editId,
          name: newProduct.name,
          description: newProduct.description,
          status: newProduct.status,
          amount: newProduct.amount,
          currency: newProduct.currency,
        });

        // رفع الصورة منفصلاً إذا تم اختيار صورة جديدة
        if (newProduct.image) {
          const formData = new FormData();
          formData.append("file", newProduct.image);
          await axios.post(`${API}/${editId}/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        alert(t("products.alerts.updateSuccess"));
      } else {
        // إضافة المنتج بدون الصورة أولاً
        const res = await axios.post(API, {
          name: newProduct.name,
          description: newProduct.description,
          status: newProduct.status,
          amount: newProduct.amount,
          currency: newProduct.currency,
        });

        // رفع الصورة بعد إنشاء المنتج إذا تم تحديدها
        if (newProduct.image) {
          const formData = new FormData();
          formData.append("file", newProduct.image);
          await axios.post(`${API}/${res.data.id}/upload-image`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        alert(t("products.alerts.addSuccess"));
      }

      // تنظيف النموذج
      setNewProduct({
        name: "",
        description: "",
        status: "",
        amount: "",
        currency: "",
        image: null,
      });
      setEditId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(t("products.alerts.addFail"));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t("products.alerts.confirmDelete"))) return;

    try {
      await axios.delete(`${API}/${id}`);
      alert(t("products.alerts.deleteSuccess"));
      fetchProducts();
    } catch (err) {
      console.error(err);
      setError(t("products.alerts.deleteFail"));
    }
  };

  const startEdit = (product) => {
    setNewProduct({
      name: product.name,
      description: product.description,
      status: product.status,
      amount: product.amount,
      currency: product.currency,
      image: null,
    });
    setEditId(product.id);
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const index = cart.findIndex((item) => item.id === product.id);
    if (index >= 0) {
      cart[index].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(t("products.alerts.addedToCart"));
  };

  const statusOptions = ["active", "inactive", "deleted", "expired"];

  return (
    <div className="container py-5">
      <h2 className="text-center text-primary fw-bold mb-5">
        {t("products.title")}
      </h2>

      {error && <div className="alert alert-danger">{error}</div>}

      {isAdmin && (
        <div className="card shadow-lg mb-5 border-primary">
          <div className="card-header bg-primary text-white fw-bold fs-5">
            {editId ? t("products.editProduct") : t("products.addNew")}
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("products.namePlaceholder")}
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("products.descriptionPlaceholder")}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-md-2">
                <select
                  className="form-select"
                  value={newProduct.status}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, status: e.target.value })
                  }
                >
                  <option value="">{t("products.statusPlaceholder")}</option>
                  {statusOptions.map((key) => (
                    <option key={key} value={key}>
                      {t(`products.statusOptions.${key}`)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-1">
                <input
                  type="number"
                  className="form-control"
                  placeholder={t("products.amountPlaceholder")}
                  value={newProduct.amount}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, amount: e.target.value })
                  }
                />
              </div>
              <div className="col-md-1">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t("products.currencyPlaceholder")}
                  value={newProduct.currency}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, currency: e.target.value })
                  }
                />
              </div>

              {/* حقل رفع الصورة */}
              <div className="col-md-2">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.files[0] })
                  }
                />
              </div>

              <div className="col-md-1 d-grid">
                <button
                  className={`btn ${editId ? "btn-warning" : "btn-success"}`}
                  onClick={handleAddOrUpdate}
                >
                  {editId
                    ? t("products.buttons.update")
                    : t("products.buttons.add")}
                </button>
              </div>
              <div className="col-md-1 d-grid">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setNewProduct({
                      name: "",
                      description: "",
                      status: "",
                      amount: "",
                      currency: "",
                      image: null,
                    });
                    setEditId(null);
                  }}
                >
                  {t("products.buttons.clear")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* فلتر الحالة */}
      <div className="mb-4 d-flex align-items-center gap-3 justify-content-between flex-wrap">
        <label className="form-label mb-0 fw-semibold">
          {t("products.labels.filterByStatus")}
        </label>
        <select
          className="form-select w-auto"
          style={{ minWidth: "150px" }}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{t("products.statusPlaceholder")}</option>
          {statusOptions.map((key) => (
            <option key={key} value={key}>
              {t(`products.statusOptions.${key}`)}
            </option>
          ))}
        </select>
      </div>

      {/* شبكة المنتجات */}
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {products.filter(
          (p) =>
            !statusFilter ||
            p.status.toLowerCase() === statusFilter.toLowerCase()
        ).length === 0 && !loading ? (
          <div className="col text-center">
            <div className="alert alert-info w-100" role="alert">
              {t("products.alerts.noProductsByStatus")}
            </div>
          </div>
        ) : (
          products
            .filter(
              (p) =>
                !statusFilter ||
                p.status.toLowerCase() === statusFilter.toLowerCase()
            )
            .map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 shadow border-primary">
                  <div className="ratio ratio-16x9 rounded-top overflow-hidden">
                    <img
                      src={
                        p.image
                          ? `https://localhost:7294/api/product/${p.id}/image`
                          : `https://via.placeholder.com/400x225?text=${encodeURIComponent(
                              p.name
                            )}`
                      }
                      alt={p.name}
                      className="card-img-top img-fluid object-fit-cover"
                      style={{ transition: "transform 0.3s ease" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = "scale(1)")
                      }
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-primary fw-bold">
                      {p.name}
                    </h5>
                    <p className="card-text text-muted small mb-2">
                      {p.description}
                    </p>
                    <p className="mb-1 fw-semibold">
                      {t("products.labels.price")} {p.amount} {p.currency}
                    </p>
                    <p className="mb-3">
                      {t("products.labels.status")}{" "}
                      <span
                        className={`badge ${
                          p.status === "active"
                            ? "bg-success"
                            : p.status === "inactive"
                            ? "bg-secondary"
                            : p.status === "deleted"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {t(`products.statusOptions.${p.status.toLowerCase()}`)}
                      </span>
                    </p>

                    {isAdmin ? (
                      <div className="mt-auto d-flex gap-2">
                        <button
                          className="btn btn-warning w-50"
                          onClick={() => startEdit(p)}
                        >
                          {t("products.buttons.edit")}
                        </button>
                        <button
                          className="btn btn-danger w-50"
                          onClick={() => handleDelete(p.id)}
                        >
                          {t("products.buttons.delete")}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline-primary mt-auto"
                        onClick={() => addToCart(p)}
                      >
                        {t("products.buttons.addToCart")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {!loading && products.length === 0 && (
        <p className="text-center mt-4 text-muted">
          {t("products.alerts.noProducts")}
        </p>
      )}
    </div>
  );
}

export default Products;
