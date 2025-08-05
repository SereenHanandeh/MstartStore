# 🧾 MSTART Hiring Task - Customer Orders Management System

This project is a full-stack web application built to fulfill the MSTART hiring task requirements. It includes a RESTful API and a responsive admin/customer web interface. The system manages customers, products, and orders, with admin functionalities and multi-language support (English & Arabic).

## 🚀 Features

### 👤 Customer Management
- ✅ Add new customer
- ✅ Edit customer details
- ✅ Delete individual or multiple customers (Admin only)
- ✅ Change customer status: `Active`, `Inactive`, `Deleted`, `Expired`
- ✅ Upload and store customer photo in database

### 📦 Product Management
- ✅ Add new product
- ✅ Edit product details
- ✅ Delete product
- ✅ Change product status: `Active`, `Inactive`, `Deleted`, `Expired`

### 🔐 Customer Authentication
- ✅ Login functionality for registered customers
- ✅ View available products after login
- ✅ Place new orders
- ✅ Cancel orders

### 📊 Orders & Statistics
- ✅ Admin can view all orders in a paginated table (10 per page)
- ✅ Admin can filter/search orders by Customer ID
- ✅ Each customer profile displays:
  - Total number of orders
  - Total amount spent

### 🧾 Admin Dashboard
- ✅ Paginated view of all customers (10 per page)
- ✅ Paginated view of all products (10 per page)
- ✅ Paginated view of all orders with filtering

### 🌐 Multi-language Support
- ✅ English & Arabic languages
- ✅ Ability to toggle between languages
- ✅ RTL (Right-to-Left) layout support when Arabic is selected

### 📱 Responsive UI
- ✅ Bootstrap-based UI
- ✅ Supports both desktop and mobile screens

### ⚠️ Error Handling
- ✅ Graceful error messages for failed operations
- ✅ Server-side and client-side validations
- ✅ Logging for critical errors (optional)

---

## 🧑‍💻 Technologies Used

- **Frontend:** React.js, Bootstrap 5, i18next (for translation)
- **Backend:**  ASP.NET Core 
- **Database:** PostgreSQL 
- **Styling:** Bootstrap 5 + Custom CSS
- **Multi-language:** i18next (English / Arabic) with dynamic direction change

---

## ⚙️ How to Run

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SereenHanandeh/MstartStore.git

### 📦 Backend (ASP.NET Core)

1. Navigate to the `server` directory
2. Open in Visual Studio 2022 
3. Configure your `appsettings.json`:
   ```json
   {
     "ConnectionStrings": {
  "DefaultConnection": "Host=ep-little-butterfly-ad3i5py4-pooler.c-2.us-east-1.aws.neon.tech;Database=neondb;Username=neondb_owner;Password=npg_cq1GigMyE3AR;SslMode=Require;Trust Server Certificate=true;"
}
   }
4.Run database migrations
   dotnet ef database update
5.Run the backend
 dotnet run
 By default, it runs on https://localhost:7294

 ### 📦 Frontend (React JS)

 1.Navigate to the client directory ----> cd mstart-frontend
 2.Run the React app ----> nom run dev

 ---------------------------------------------------------------------------------

## 📁 Project Folder Structure

<pre>
```bash
📦 project-root/
├── 📁 node_modules/
├── 📁 public/
├── 📁 src/
│   ├── 📁 assets/
│   ├── 📁 components/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── 📁 locales/
│   │   ├── 📁 ar/
│   │   │   └── translation.json
│   │   └── 📁 en/
│   │       └── translation.json
│   ├── 📁 pages/
│   │   ├── Cart.jsx
│   │   ├── CustomerOrder.jsx
│   │   ├── Customers.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Home.jsx
│   │   ├── LanguageDropdown.jsx
│   │   ├── Login.jsx
│   │   ├── Orders.jsx
│   │   ├── Products.jsx
│   │   └── Register.jsx
│   ├── 📁 services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   └── i18n.js
```
</pre>



 ------------------------------------------------------------------

## 🖼️ Screenshots


 🏠 Home Page
 <img width="1583" height="899" alt="image" src="https://github.com/user-attachments/assets/edafde79-2b3e-48e1-bd42-63892034a27e" />

 🔐 Login Page
 <img width="1575" height="898" alt="image" src="https://github.com/user-attachments/assets/7fb7e661-b8f3-4362-a3b1-12efb088525a" />

 🔐 Register Page
 <img width="1583" height="899" alt="image" src="https://github.com/user-attachments/assets/8582f16e-476b-4cd1-b4c9-7e61dc513a49" />
 
 📊Admin Dashboard
 <img width="1598" height="725" alt="image" src="https://github.com/user-attachments/assets/d7f3ab4a-ddb2-46b9-8d29-8bf9030d965c" />

 


 -------------------------------------------------------------------
login for admin : email --> admin@example.com
                  password--> 1234
 Made with ❤️ by Sereen Hanandeh as part of the MSTART Hiring Task.






      
      
