# 🎓 Learnopia — Full-Stack EdTech LMS Platform

A learning management system supporting course creation, student enrollment, and
progress tracking, built with a React frontend and a Python/Flask REST API backed
by MySQL (SQLite for local development).

## Features

- 🔐 JWT-based authentication (register / login)
- 👥 Role-Based Access Control — separate **Student** and **Instructor** roles
- 📚 Course CRUD (instructors create, edit, and delete their own courses)
- ✅ Enrollment workflow for students
- 📈 Per-course progress tracking with a live progress bar
- 🗄️ Normalized relational schema: `users`, `courses`, `enrollments`, `progress`

## Tech Stack

| Layer     | Tech                                                        |
|-----------|--------------------------------------------------------------|
| Frontend  | React.js, React Router, Tailwind CSS, Vite                   |
| Backend   | Python, Flask, Flask-JWT-Extended, SQLAlchemy                |
| Database  | MySQL (production) / SQLite (local dev, zero setup)          |
| Auth      | JWT access tokens + role claims for RBAC                     |

## Project Structure

```
learnopia/
├── backend/
│   ├── app.py              # Flask app factory & entrypoint
│   ├── config.py           # App configuration
│   ├── models.py           # SQLAlchemy models
│   ├── auth_utils.py       # RBAC decorator
│   ├── schema.sql          # MySQL schema (optional, for production)
│   ├── requirements.txt
│   └── routes/
│       ├── auth.py         # /api/auth/*
│       ├── courses.py      # /api/courses/*
│       └── enrollments.py  # /api/enrollments/*
└── frontend/
    ├── src/
    │   ├── pages/           # Home, Login, Register, Courses, CourseDetail, Dashboard
    │   ├── components/      # Navbar, PrivateRoute
    │   ├── context/         # AuthContext (JWT session state)
    │   └── api.js           # Fetch wrapper
    └── package.json
```

## Getting Started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # edit if using MySQL, otherwise leave DATABASE_URL blank
python app.py                 # runs on http://localhost:5000
```

By default the app uses SQLite and creates tables automatically on first run —
no database setup required. To use MySQL instead, create a database and run
`schema.sql`, then set `DATABASE_URL` in `.env`.

### Frontend

```bash
cd frontend
npm install
npm run dev                   # runs on http://localhost:5173
```

The Vite dev server proxies `/api` requests to the Flask backend on port 5000
(see `vite.config.js`), so make sure the backend is running first.

## API Overview

| Method | Endpoint                              | Auth              | Description                  |
|--------|----------------------------------------|-------------------|-------------------------------|
| POST   | `/api/auth/register`                  | —                 | Create account                |
| POST   | `/api/auth/login`                     | —                 | Log in, receive JWT           |
| GET    | `/api/auth/me`                        | Required          | Current user profile          |
| GET    | `/api/courses`                        | —                 | List courses (paginated)      |
| GET    | `/api/courses/<id>`                   | —                 | Course detail                 |
| POST   | `/api/courses`                        | Instructor only   | Create course                 |
| PUT    | `/api/courses/<id>`                   | Instructor (owner)| Update course                 |
| DELETE | `/api/courses/<id>`                   | Instructor (owner)| Delete course                 |
| POST   | `/api/enrollments`                    | Student only      | Enroll in a course             |
| GET    | `/api/enrollments/me`                 | Student only      | List my enrollments           |
| PATCH  | `/api/enrollments/<id>/progress`      | Student (owner)   | Update progress %             |

## Roadmap Ideas

- Course content/lessons (not just metadata)
- Instructor analytics dashboard
- File uploads for course materials
- Email verification on signup

## License

MIT
