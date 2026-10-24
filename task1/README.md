# 🛍 NovaMart — MERN E-Commerce Store

A full-stack e-commerce application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring a premium dark glassmorphism UI.

## ✨ Features

- **User Authentication** — Register, login, JWT-based sessions
- **Product Catalog** — Browse, search, filter by category
- **Product Details** — Full descriptions, images, ratings, stock status
- **Shopping Cart** — Add/remove items, adjust quantities, persistent via localStorage
- **Checkout Flow** — Shipping address form, order summary, tax & shipping calculation
- **Order Management** — Place orders, view order history, order detail pages
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Dark Glassmorphism UI** — Premium modern design with animations

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Styling** | Vanilla CSS (dark glassmorphism design system) |

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **MongoDB** (local install or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone & Install

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce_store
JWT_SECRET=your_secret_key_here
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This populates 12 sample products across Electronics, Fashion, and Home categories.

### 4. Run the Application

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & get token | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List all products | No |
| GET | `/api/products/:id` | Get product details | No |

Query params: `?search=keyword&category=Electronics`

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/orders` | Create new order | Yes |
| GET | `/api/orders/my-orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |

## 📁 Project Structure

```
├── server/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers
│   ├── middleware/            # Auth & error handling
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── seed/seedData.js      # Sample data seeder
│   └── server.js             # Express entry point
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth & Cart context
│   │   ├── pages/            # Page components
│   │   ├── services/api.js   # Axios instance
│   │   ├── App.jsx           # Router & layout
│   │   ├── App.css           # Component styles
│   │   └── index.css         # Design system
│   └── index.html
└── README.md
```

## 📝 License

This project is part of the CodeAlpha internship program.
