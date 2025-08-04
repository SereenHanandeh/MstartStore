-- 🧱 إنشاء جدول العملاء
CREATE TABLE Customers (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    Email VARCHAR(150) UNIQUE,
    Phone VARCHAR(20),
    Gender VARCHAR(10),
    DateOfBirth DATE,
    PasswordHash TEXT,
    Status VARCHAR(20),
    ServerDateTime TIMESTAMP,
    DateTimeUTC TIMESTAMP,
    LastLoginDateTimeUTC TIMESTAMP,
    CustomerImage BYTEA
);

-- 🧱 جدول المنتجات
CREATE TABLE Products (
    ID SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    Description TEXT,
    Price DECIMAL(10,2),
    Quantity INT,
    Status VARCHAR(20),
    ServerDateTime TIMESTAMP,
    DateTimeUTC TIMESTAMP
);

-- 🧱 جدول الطلبات
CREATE TABLE Orders (
    ID SERIAL PRIMARY KEY,
    CustomerID INT REFERENCES Customers(ID) ON DELETE CASCADE,
    TotalAmount DECIMAL(10,2),
    Status VARCHAR(20),
    ServerDateTime TIMESTAMP,
    DateTimeUTC TIMESTAMP
);
