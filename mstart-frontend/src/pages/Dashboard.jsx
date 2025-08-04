import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

function Dashboard() {
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    totalSales: 0,
  });

  const fetchStats = async () => {
    try {
      const [customers, products, orders] = await Promise.all([
        axios.get('https://localhost:7294/api/customer'),
        axios.get('https://localhost:7294/api/product'),
        axios.get('https://localhost:7294/api/order'),
      ]);

      const totalSales = orders.data.reduce(
        (sum, o) => sum + (parseFloat(o.totalAmount) || 0),
        0
      );

      setStats({
        customers: customers.data.length,
        products: products.data.length,
        orders: orders.data.length,
        totalSales: totalSales.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center mt-5">
      <h2 className="mb-4 text-center">📊 {t('dashboard.title')}</h2>
      <div className="row w-100 justify-content-center">
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-primary shadow">
            <div className="card-body text-center">
              <h5 className="card-title">{t('dashboard.customers')}</h5>
              <p className="card-text fs-4">{stats.customers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-success shadow">
            <div className="card-body text-center">
              <h5 className="card-title">{t('dashboard.products')}</h5>
              <p className="card-text fs-4">{stats.products}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-warning shadow">
            <div className="card-body text-center">
              <h5 className="card-title">{t('dashboard.orders')}</h5>
              <p className="card-text fs-4">{stats.orders}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card text-white bg-danger shadow">
            <div className="card-body text-center">
              <h5 className="card-title">{t('dashboard.totalSales')}</h5>
              <p className="card-text fs-4">{stats.totalSales} JOD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
