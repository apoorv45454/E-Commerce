# 🛍️ E-Commerce Order Tracking System

A full-stack E-Commerce web application that allows users to browse products, manage cart, place orders, track delivery status, and enables admin to manage products and orders efficiently.

---

## 🚀 Features

### 👤 User Side

* User Registration & Login
* Browse Products
* Add to Cart
* Manage Cart (Increase/Decrease Quantity)
* Add & Manage Address
* Place Order (Online / Cash on Delivery)
* Track Order with Status Timeline
* Cancel Order (Before Shipping)

### 🛠️ Admin Side

* Add / Update / Delete Products
* Manage Inventory (Stock)
* View All Orders
* Update Order Status
* Restrict updates for Cancelled Orders

---

## 🏗️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas

### Payment Integration

* Razorpay

### Deployment

* AWS (Docker for Backend)

---

## 📁 Project Structure

```
E-Commerce/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx
│   └── package.json
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/E-Commerce-Order-Tracking.git
cd E-Commerce-Order-Tracking
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_key
RAZORPAY_KEY_SECRET=your_secret
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 API Endpoints

### User

* POST `/api/users/register`
* POST `/api/users/login`

### Products

* GET `/api/products`
* POST `/api/products/add`
* PUT `/api/products/update/:id`
* DELETE `/api/products/delete/:id`

### Orders

* POST `/api/orders/create`
* GET `/api/orders`
* PUT `/api/orders/update/:id`
* PUT `/api/orders/cancel/:id`

### Address

* POST `/api/address/add`
* GET `/api/address/:userId`
* PUT `/api/address/update/:id`
* DELETE `/api/address/delete/:id`

---

## 🗄️ Database Schema (Basic)

* Users
* Products
* Orders
* Addresses

---

## 📦 Order Flow

```
Placed → Confirmed → Packed → Shipped → Out for Delivery → Delivered
```

* Users can cancel order only before **Shipped**

---

## 🧪 Testing

* Manual testing for all modules
* API testing using Postman

---

## 🔮 Future Enhancements

* Wishlist Feature
* Product Reviews & Ratings
* AI-based Recommendations
* Real-time Tracking
* Mobile Application

---
