# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


# Mini Project Management Tool

A full-stack project management app with Projects → Tasks → Subtasks, and role-based access control (Admin / Member).

## Tech Stack
- Frontend: React (Vite), React Router, Axios, Tailwind CSS v4
- Backend: Node.js, Express.js
- Database: MongoDB (Mongoose)
- Auth: JWT, bcrypt for password hashing

## Features
- JWT auth with Register/Login
- Role-based access (Admin / Member), enforced on the backend via middleware
- Admin: full CRUD on Projects, Tasks, Subtasks; assign work to Members
- Member: view only assigned Projects/Tasks/Subtasks; update status only
- Project detail page with expandable Tasks → Subtasks
- Filter tasks by status, sort by due date
- Dashboard with To Do / In Progress / Done counts

## Project Structure
├── backend/ # Express API, MongoDB models, routes, middleware
├── frontend/ # React app
└── README.md

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- A MongoDB connection string (MongoDB Atlas free tier recommended)

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in MONGO_URI, JWT_SECRET, PORT in .env
npm run dev
```
Backend runs on `http://localhost:5000` by default.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` by default.

## Environment Variables
See `backend/.env.example`:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/projects | Authenticated (role-filtered) |
| POST | /api/projects | Admin only |
| PUT | /api/projects/:id | Admin only |
| DELETE | /api/projects/:id | Admin only |
| POST | /api/projects/:id/tasks | Admin only |
| GET | /api/projects/:id/tasks | Authenticated (role-filtered) |
| PUT | /api/tasks/:id | Admin: full edit / Member: status only (own tasks) |
| DELETE | /api/tasks/:id | Admin only |
| POST | /api/tasks/:id/subtasks | Admin only |
| GET | /api/tasks/:id/subtasks | Authenticated (role-filtered) |
| PUT | /api/subtasks/:id | Admin: full edit / Member: status only (own subtasks) |
| DELETE | /api/subtasks/:id | Admin only |

## Known Limitations
- Role can be set at registration for demo/testing simplicity; in production, only an existing Admin should be able to promote users.
- No email verification or password reset flow.
- Assigning members currently requires pasting their user ID manually (no user search/picker UI).

## Demo
See `/demo` folder for screenshots — or [link to demo video if you record one].