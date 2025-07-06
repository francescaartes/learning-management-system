# Learning Management System (LMS)

A full-stack Learning Management System built with **Django REST Framework** for the backend and **React.js** for the frontend.

This platform enables instructors to create and manage courses, students to enroll, access course materials, submit assignments, and take quizzes.

---

## Features

**User Authentication**

- JWT-based login & registration
- Role-based permissions (Instructor / Student)

**Instructor Capabilities**

- Create and publish courses
- Manage announcements, resources, assignments, and quizzes
- Review and grade submissions

**Student Capabilities**

- Enroll in courses
- View and submit assignments
- Attempt quizzes
- Leave course reviews

**RESTful API**

- Secure endpoints with JWT authentication
- Django Filters for querying

**Responsive Frontend**

- Built with React and React Router
- Protected routes for authenticated users
- Modern, clean interface

---

## Tech Stack

- **Backend:** Django 5.2, Django REST Framework, Simple JWT
- **Frontend:** React.js (React Router v6)
- **Database:** MySQL
- **Media Handling:** Django Media Storage
- **Authentication:** JWT Tokens

---

## Prerequisites

Make sure you have installed:

- **Python** 3.12.2
- **Node.js** 20+
- **npm** 10+

To confirm, run:

```bash
python --version
node --version
npm --version
```

---

## Backend Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/francescaartes/learning-management-system.git
   cd learning-management-system
   ```

2. **Create a virtual environment**

   ```bash
   python -m venv env
   ```

3. **Activate the environment**

   - Windows:
     ```bash
     env\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source env/bin/activate
     ```

4. **Install dependencies**

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

5. **Configure environment variables**

   Create a `.env` file in the project root:

   ```
   NAME=your_db_name
   USER=your_db_user
   PASSWORD=your_db_password
   HOST=localhost
   PORT=3306
   ```

6. **Apply migrations**

   ```bash
   python manage.py migrate
   ```

7. **Create superuser**

   ```bash
   python manage.py createsuperuser
   ```

8. **Run backend server**

   ```bash
   python manage.py runserver
   ```

   The API will be available at:

   ```
   http://127.0.0.1:8000/
   ```

---

## Frontend Setup

1. **Navigate to frontend directory**

   If your React app is in the same repo root:

   ```bash
   cd frontend
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**

   Create a .env file in frontend/:

   ```bash
   VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Run React development server**

```bash
npm run dev
```

The app will be served at:

```
http://localhost:5173/
```

---

## API Endpoints

Some key endpoints:

| Endpoint          | Method   | Description           |
| ----------------- | -------- | --------------------- |
| `/register/`      | POST     | User registration     |
| `/me/`            | GET      | Get current user info |
| `/courses/`       | GET      | List courses          |
| `/create_course/` | POST     | Create new course     |
| `/courses/{id}/`  | GET      | Course detail         |
| `/enrollments/`   | POST     | Enroll in a course    |
| `/posts/`         | GET/POST | Course posts          |
| `/quiz-attempts/` | POST     | Submit quiz answers   |
| `/submissions/`   | POST     | Submit assignment     |

Full API reference available in `lms_app/urls.py`.

---

## Project Structure Overview

```
learning-management-system/
├── backend/
│   ├── lms_backend/
|       ├── settings.py
|       └── urls.py
│   └── lms_app/
│       ├── models.py
│       ├── serializers.py
│       ├── views.py
│       ├── urls.py
|       └── ...
|   ├── media/
|   ├── .env
|   └── requirements.txt
├── frontend/
|   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── route/
│   │   └── App.jsx
|   ├── .env
│   └── package.json
└── README.md
```

---

## Author

[Francesca Artes](https://github.com/francescaartes)
