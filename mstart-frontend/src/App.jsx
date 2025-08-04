import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Customers from "./pages/Customers";
import "./App.css";

import { Navigate } from "react-router-dom";
import Products from "./pages/Products";
import Dashboard from "./pages/Dashboard";

import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import CustomerOrder from "./pages/CustomerOrder";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import "./i18n";

function App() {
  

  
  return (
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<CustomerOrder />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
 
  );
}

export default App;
