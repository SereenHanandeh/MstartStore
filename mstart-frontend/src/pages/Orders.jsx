import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Orders() {
  const { t } = useTranslation();

  const [orders, setOrders] = useState([]);
  const [searchCustomerID, setSearchCustomerID] = useState("");

  const API = "https://localhost:7294/api/Order";

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) =>
    searchCustomerID === ""
      ? true
      : o.customerID === parseInt(searchCustomerID)
  );

  return (
    <div className="container my-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">{t("ordersManagement.title")}</h4>
        </div>
        <div className="card-body">
          {/* حقل البحث */}
          <div className="mb-4">
            <input
              type="number"
              placeholder={t("ordersManagement.searchPlaceholder")}
              className="form-control form-control-lg"
              value={searchCustomerID}
              onChange={(e) => setSearchCustomerID(e.target.value)}
            />
          </div>

          {/* جدول الطلبات */}
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle text-center">
              <thead className="table-dark">
                <tr>
                  <th>{t("tables.index")}</th>
                  <th>{t("tables.customer")}</th>
                  <th>{t("tables.product")}</th>
                  <th>{t("tables.quantity")}</th>
                  <th>{t("tables.totalPrice")}</th>
                  <th>{t("tables.date")}</th>
                  <th>{t("tables.actions")}</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-muted">
                      {t("ordersManagement.noOrdersFound")}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((o, i) => (
                    <tr key={o.id}>
                      <td>{i + 1}</td>
                      <td>{o.customer?.name || t("common.na")}</td>
                      <td>{o.product?.name || t("common.na")}</td>
                      <td>{o.quantity ?? "1"}</td>
                      <td>
                        {parseFloat(o.totalAmount).toFixed(2)} {o.currency}
                      </td>
                      <td>
                        {o.serverDateTime
                          ? new Date(o.serverDateTime).toLocaleDateString("en-GB")
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
                          title={t("tables.delete")}
                        >
                          <i className="bi bi-trash"></i> {t("tables.delete")}
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

export default Orders;
