# 🌐 NexusHub — MERN Social Media Platform

A full-stack mini social media application built with the **MERN stack** (MongoDB, Express.js, React, Node.js) featuring a premium dark glassmorphism UI.
**Live Demo:** [https://code-alpha-task2-theta.vercel.app/](https://nexushub-mauve.vercel.app/)

### 🚀 Demo Credentials
- **Email:** demo@gmail.com
- **Password:** demo@1234
## ✨ Features

- **User Authentication** — Register, login, JWT-based sessions
- **User Profiles** — Avatar, bio, follower/following stats, edit profile
- **Posts & Comments** — Create, edit, delete posts with optional images; comment system
- **Like System** — Like/unlike posts with animated heart
- **Follow System** — Follow/unfollow users, view followers & following lists
- **Feed** — Personalized feed showing posts from followed users
- **Explore** — Discover all posts and find new people
- **Search** — Search users by username with real-time results
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
MONGO_URI=mongodb://localhost:27017/social_media_app
JWT_SECRET=your_secret_key_here
```

### 3. Seed the Database

```bash
cd server
npm run seed
```

This creates 5 demo users with sample posts, comments, likes, and follow relationships.

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

### Demo Accounts

| Email | Password |
|-------|----------|
| alex@example.com | password123 |
| sarah@example.com | password123 |
| mike@example.com | password123 |
| priya@example.com | password123 |
| jordan@example.com | password123 |

## 📡 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new user | No |
| POST | `/login` | Login & get token | No |
| GET | `/profile` | Get current user profile | Yes |

### Users (`/api/users`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/search?q=` | Search users | No |
| GET | `/:id` | Get user profile | No |
| PUT | `/profile` | Update own profile | Yes |
| PUT | `/:id/follow` | Follow/unfollow user | Yes |
| GET | `/:id/followers` | Get followers list | No |
| GET | `/:id/following` | Get following list | No |

### Posts (`/api/posts`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Create post | Yes |
| GET | `/feed` | Feed (followed users' posts) | Yes |
| GET | `/explore` | All posts | No |
| GET | `/:id` | Single post | No |
| PUT | `/:id` | Edit post | Yes |
| DELETE | `/:id` | Delete post | Yes |
| PUT | `/:id/like` | Like/unlike post | Yes |
| POST | `/:id/comment` | Add comment | Yes |
| DELETE | `/:id/comment/:cid` | Delete comment | Yes |
| GET | `/user/:userId` | User's posts | No |

## 📁 Project Structure

```
├── server/
│   ├── config/db.js          # MongoDB connection
│   ├── controllers/          # Route handlers (auth, user, post)
│   ├── middleware/            # Auth & error handling
│   ├── models/               # Mongoose schemas (User, Post)
│   ├── routes/               # API routes
│   ├── seed/seedData.js      # Sample data seeder
│   └── server.js             # Express entry point
├── client/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth context provider
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
