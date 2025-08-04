import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function CustomerOrder() {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const storedID = localStorage.getItem("customerId");
  const customerID =
    storedID && storedID.trim() !== "" ? parseInt(storedID) : null;

  useEffect(() => {
    
    if (!customerID || isNaN(customerID)) {
      setError(t("orders.invalidCustomerID"));
      setOrders([]);
      return;
    } else {
      setError("");
    }

    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          `https://localhost:7294/api/Order/by-customer/${customerID}`
        );
        console.log("Fetched orders:", res.data,customerID);

        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching customer orders:", err);
        setError(t("orders.fetchError"));
        setOrders([]);
      }
    };

    fetchOrders();
  }, [customerID, t]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://localhost:7294/api/Order/${id}`);

      if (customerID && !isNaN(customerID)) {
        const res = await axios.get(
          `https://localhost:7294/api/Order/by-customer/${customerID}`
        );
        setOrders(res.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  // حساب المجموع الكلي للمبلغ
  const totalAmount = orders.reduce(
    (sum, order) => sum + parseFloat(order.totalAmount || 0),
    0
  );

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{t("orders.title")}</h4>
        </div>
        <div className="card-body">
          {/* عرض ملخص الطلبات */}
          <div className="mb-3">
            <strong>{t("orders.totalOrders")}:</strong> {orders.length} <br />
            <strong>{t("orders.totalAmount")}:</strong> {totalAmount.toFixed(2)}{" "}
            {t("orders.currency")}
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>{t("table.index")}</th>
                  <th>{t("table.product")}</th>
                  <th>{t("table.quantity")}</th>
                  <th>{t("table.totalPrice")}</th>
                  <th>{t("table.date")}</th>
                  <th>{t("table.action")}</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-muted">
                      {t("orders.noOrders")}
                    </td>
                  </tr>
                ) : (
                  orders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>
                      <td>{o.product?.name || "N/A"}</td>
                      <td>{o.quantity ?? "1"}</td>
                      <td>
                        {parseFloat(o.totalAmount).toFixed(2)} {o.currency}
                      </td>
                      <td>
                        {o.serverDateTime
                          ? new Date(o.serverDateTime).toLocaleDateString(
                              "en-GB"
                            )
                          : new Date(o.dateTimeUTC).toLocaleDateString("en-GB")}
                        <br />
                        <small className="text-muted">
                          {o.serverDateTime
                            ? new Date(o.serverDateTime).toLocaleTimeString()
                            : new Date(o.dateTimeUTC).toLocaleTimeString()}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(o.id)}
                          title={t("table.delete")}
                        >
                          <i className="bi bi-trash"></i> {t("table.delete")}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerOrder;
