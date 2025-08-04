import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const API_URL = "https://localhost:7294/api/customer";

function Customers() {
  const { t } = useTranslation();

  const [customers, setCustomers] = useState([]);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    status: "Active",
    gender: "",
    password: "",
  });
  const [editing, setEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get(API_URL);
        setCustomers(res.data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(API_URL);
      setCustomers(res.data);
    } catch (error) {
      console.error(t("customers.errorSave"), error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setErrorMessage("");

    const localDate = new Date(form.dateOfBirth);
    const utcDate = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      )
    );

    const formatStatus = (str) => {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    const payload = {
      ID: form.id,  
      Name: form.name,
      Email: form.email,
      Phone: form.phone,
      DateOfBirth: utcDate.toISOString(),
      Status: formatStatus(form.status),
      Gender: form.gender,
      Password: form.password,
    };

    console.log("Payload sent to server:", payload);

    if (editing) {
      await axios.put(`${API_URL}/${form.id}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }

    setForm({
      id: 0,
      name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      status: "Active",
      gender: "",
      password: "",
    });
    setEditing(false);
    fetchCustomers();
  } catch (error) {
    if (error.response?.status === 409) {
      setErrorMessage(t("customers.errorEmailConflict"));
    } else {
      setErrorMessage(
        t("customers.errorSave", {
          message: error.response?.data?.message || error.message,
        })
      );
    }
  }
};


  const handleEdit = (customer) => {
    const date = new Date(customer.dateOfBirth);
    const formattedDate = date.toISOString().split("T")[0];

    setForm({
      ...customer,
      dateOfBirth: formattedDate,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting customer:", error);
      }
    }
  };

  const handleSelect = (id) => {
    setSelectedCustomers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (
      selectedCustomers.length > 0 &&
      window.confirm("Are you sure you want to delete the selected customers?")
    ) {
      try {
        await Promise.all(
          selectedCustomers.map((id) => axios.delete(`${API_URL}/${id}`))
        );
        setSelectedCustomers([]);
        fetchCustomers();
      } catch (error) {
        console.error("Error deleting selected customers:", error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{t("customers.title")}</h2>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <div className="card shadow-sm mb-4">
        <div className="card-header bg-primary text-white">
          {editing ? t("customers.editCustomer") : t("customers.addNew")}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t("customers.form.name")}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t("customers.form.email")}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("customers.form.phone")}
                  className="form-control"
                />
              </div>
              <div className="col-md-4">
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="col-md-4">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="active">
                    {t("customers.form.statusOptions.active")}
                  </option>
                  <option value="inactive">
                    {t("customers.form.statusOptions.inactive")}
                  </option>
                  <option value="deleted">
                    {t("customers.form.statusOptions.deleted")}
                  </option>
                  <option value="expired">
                    {t("customers.form.statusOptions.expired")}
                  </option>
                </select>
              </div>
              <div className="col-md-4">
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="">{t("customers.form.selectGender")}</option>
                  <option value="male">
                    {t("customers.form.genderOptions.male")}
                  </option>
                  <option value="female">
                    {t("customers.form.genderOptions.female")}
                  </option>
                </select>
              </div>

              <div className="col-md-4 d-grid">
                <button type="submit" className="btn btn-success">
                  {editing ? t("customers.update") : t("customers.add")}
                </button>
              </div>
              {editing && (
                <div className="col-md-4 d-grid">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setForm({
                        id: 0,
                        name: "",
                        email: "",
                        phone: "",
                        dateOfBirth: "",
                        status: "active",
                        gender: "",
                        password: "",
                      });
                      setEditing(false);
                    }}
                  >
                    {t("customers.clear")}
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

      {selectedCustomers.length > 0 && (
        <button className="btn btn-danger mb-3" onClick={handleBulkDelete}>
          {t("customers.deleteSelected", { count: selectedCustomers.length })}
        </button>
      )}

      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  selectedCustomers.length === customers.length &&
                  customers.length > 0
                }
                onChange={() => {
                  if (selectedCustomers.length === customers.length) {
                    setSelectedCustomers([]);
                  } else {
                    setSelectedCustomers(customers.map((c) => c.id));
                  }
                }}
              />
            </th>
            <th>{t("customers.table.id")}</th>
            <th>{t("customers.table.name")}</th>
            <th>{t("customers.table.email")}</th>
            <th>{t("customers.table.phone")}</th>
            <th>{t("customers.table.dob")}</th>
            <th>{t("customers.table.status")}</th>
            <th>{t("customers.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedCustomers.includes(c.id)}
                  onChange={() => handleSelect(c.id)}
                />
              </td>
              <td>{c.id}</td>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{new Date(c.dateOfBirth).toLocaleDateString()}</td>
              <td>
                {t(`customers.form.statusOptions.${c.status.toLowerCase()}`) ||
                  c.status}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(c)}
                >
                  {t("customers.edit")}
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(c.id)}
                >
                  {t("customers.delete")}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customers;
