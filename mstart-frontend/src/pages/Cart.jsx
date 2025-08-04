import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Cart() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateCart = (items) => {
    setCartItems(items);
    localStorage.setItem("cart", JSON.stringify(items));
  };

  const handleRemove = (id) => {
    const filteredItems = cartItems.filter((item) => item.id !== id);
    updateCart(filteredItems);
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    updateCart(updatedItems);
  };

  const API = "https://localhost:7294/api/Order";

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) throw new Error("User not logged in");

      for (const item of cartItems) {
        const orderData = {
          CustomerID: user.customerId,
          ProductID: item.id,
          TotalAmount: item.amount * item.quantity,
          Currency: item.currency,
        };
        await axios.post(API, orderData);
      }

      alert(t("cart.orderSuccess"));
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err) {
      console.error(err);
      setError(t("cart.orderError"));
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mt-5 text-center">
        <h3>{t("cart.emptyCart")}</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center fw-bold text-primary">{t("cart.cartTitle")}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-hover align-middle">
          <thead className="table-dark text-center">
            <tr>
              <th>{t("cart.name")}</th>
              <th>{t("cart.amount")}</th>
              <th>{t("cart.quantity")}</th>
              <th>{t("cart.subtotal")}</th>
              <th>{t("cart.remove")}</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(({ id, name, amount, currency, quantity }) => (
              <tr key={id} className="text-center">
                <td className="fw-semibold">{name}</td>
                <td>
                  {amount.toFixed(2)} {currency}
                </td>
                <td>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                      handleQuantityChange(id, parseInt(e.target.value, 10))
                    }
                    className="form-control form-control-sm text-center"
                    style={{ maxWidth: "70px", margin: "0 auto" }}
                  />
                </td>
                <td className="fw-semibold">
                  {(amount * quantity).toFixed(2)} {currency}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemove(id)}
                    title={t("cart.remove")}
                  >
                    <i className="bi bi-trash"></i> {t("delete")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="table-secondary text-center fw-bold fs-5">
              <td colSpan="3" className="text-end">
                {t("cart.total")}
              </td>
              <td>
                {cartItems
                  .reduce((total, item) => total + item.amount * item.quantity, 0)
                  .toFixed(2)}{" "}
                {cartItems[0]?.currency || ""}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-primary btn-lg px-5"
          onClick={handleCheckout}
          disabled={loading}
        >
          {loading ? t("cart.placingOrder") : t("cart.checkout")}
        </button>
      </div>
    </div>
  );
}

export default Cart;
