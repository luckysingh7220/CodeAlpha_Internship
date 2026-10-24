# TaskFlow - MERN Project Management Tool

A collaborative, full-stack project management application similar to Trello or Asana, built with the MERN stack (MongoDB, Express, React, Node.js). 

## 🚀 Features

- **User Authentication**: Secure signup and login using JWT (JSON Web Tokens).
- **Group Projects**: Create and manage multiple projects from your personal dashboard.
- **Kanban Boards**: Visualize your workflow with customizable project boards.
- **Drag-and-Drop Tasks**: Fluidly move tasks between columns (To Do, In Progress, Done) using `@hello-pangea/dnd`.
- **Task Management**: Create tasks, add detailed descriptions, and assign them to columns.
- **Real-Time Collaboration Feel**: Comment and communicate directly within task cards.
- **Modern UI/UX**: Built with a sleek, vibrant dark mode aesthetic featuring glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

**Frontend:**
- React (Vite)
- React Router DOM
- `@hello-pangea/dnd` (for Drag and Drop)
- Lucide React (Icons)
- Vanilla CSS (Custom modern design system)
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Bcryptjs for Password Hashing

## ⚙️ Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- Local [MongoDB](https://www.mongodb.com/) instance running (default port `27017`)

### 1. Clone & Install Dependencies

Open your terminal and navigate to the project directory:

```bash
# Install backend dependencies
cd server
npm install

# In a new terminal, install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables

The backend requires environment variables to run. The `.env` file is already created in the `server` directory with default values:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/project_management
JWT_SECRET=supersecretjwtkey_123
```

### 3. Start the Development Servers

You will need to run the backend and frontend concurrently in two separate terminal windows.

**Start the Backend Server:**
```bash
cd server
npm run start 
# or node server.js
```
*(The backend runs on http://localhost:5000)*

**Start the Frontend Server:**
```bash
cd client
npm run dev
```
*(The frontend runs on http://localhost:5173)*

## 📖 Usage Guide

1. Navigate to `http://localhost:5173` in your browser.
2. **Sign Up** for a new account.
3. Once logged in, click **New Project** on your dashboard to create a board.
4. Click on the project card to enter the board view.
5. Click **Add a card** in any column to create a task.
6. **Drag and drop** task cards across columns.
7. Click on any task card to open the **Task Modal**, where you can update the description or leave comments.

## 🖼️ UI Highlights

The frontend was designed with a focus on visual excellence:
- **Glassmorphism**: Translucent panels with background blur effects.
- **Sleek Dark Theme**: Deep slate backgrounds contrasting with vibrant blue accents.
- **Interactive Elements**: Hover states, smooth transitions, and glowing shadows on buttons.

---
*Developed for CodeAlpha Task 3*
