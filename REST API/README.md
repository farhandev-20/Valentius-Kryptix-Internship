# Task Management REST API (CRUD + User Authentication)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-DRF-green.svg)](https://www.djangoproject.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT_SimpleJWT-orange.svg)](https://jwt.io/)
[![Tests](https://img.shields.io/badge/Tests-19%20Passed-brightgreen.svg)]()

A robust, production-ready **REST API with User Authentication and Full CRUD operations** built with **Django REST Framework (DRF)**, **SimpleJWT**, and **SQLite**.

Built for the **Valentius Kryptix Internship Program**.

---

## 🚀 Key Features

- 🔐 **User Authentication**: User registration with secure cryptographic password hashing (PBKDF2 SHA256) and JWT-based login (`access` & `refresh` tokens).
- 🛡️ **Protected Routes**: Protected CRUD endpoints requiring `Bearer <token>` authentication with automatic `401 Unauthorized` enforcement.
- 👥 **User Isolation**: Users can only create, view, update, and delete their own tasks. Cross-user access is strictly prevented.
- ⚡ **Full CRUD Resource**: Complete endpoints for creating, reading, updating (full `PUT` & partial `PATCH`), and deleting tasks (`DELETE` with `204 No Content`).
- 🔍 **Filtering & Search**: Filter tasks by `status` (TODO, IN_PROGRESS, COMPLETED), `priority` (LOW, MEDIUM, HIGH), ordering, and search keywords in titles and descriptions.
- 🚦 **Consistent HTTP Status Codes & Error Formats**: Standardized JSON responses for `200`, `201`, `204`, `400`, `401`, `403`, and `404`.
- 🧪 **100% Test Coverage**: 19 automated unit & integration tests covering all requirement pillars.
- 📦 **Postman Collection Included**: Complete `postman_collection.json` ready for 1-click import with automatic token variable extraction.

---

## 🛠️ Tech Stack

- **Backend Framework**: Django 6.1+ & Django REST Framework (DRF)
- **Authentication**: `djangorestframework-simplejwt` (JSON Web Tokens)
- **Database**: SQLite (built-in, zero-configuration)
- **CORS Support**: `django-cors-headers`

---

## 📁 Project Structure

```text
REST API/
│
├── core_api/               # Project Configuration & Settings
│   ├── settings.py         # App settings, JWT config, DRF settings, CORS
│   ├── urls.py             # Root URL routing & API overview endpoint
│   ├── exceptions.py       # Custom exception handler for uniform error JSON
│   ├── wsgi.py
│   └── asgi.py
│
├── accounts/               # Authentication App
│   ├── models.py           # Standard Django User model
│   ├── serializers.py      # Registration, Login, Profile serializers
│   ├── views.py            # RegisterView, LoginView, UserProfileView
│   ├── urls.py             # /api/auth/ endpoints
│   └── tests.py            # Automated tests for authentication
│
├── tasks/                  # Tasks Core Resource App
│   ├── models.py           # Task model (title, description, status, priority, due_date, owner)
│   ├── serializers.py      # TaskSerializer with input validation
│   ├── views.py            # TaskViewSet for full CRUD & filtering
│   ├── urls.py             # /api/tasks/ endpoints
│   └── tests.py            # Automated tests for CRUD, isolation & validation
│
├── postman_collection.json # Complete Postman Collection for instant testing
├── requirements.txt        # Project dependencies
├── manage.py               # Django CLI management script
└── README.md               # API Documentation
```

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
- Python 3.10+ installed on your system.
- Git (optional, for repository management).

### 2. Setup Virtual Environment
Open your terminal in the project directory:

```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Development Server
```bash
python manage.py runserver
```

The API will now be running live at `http://127.0.0.1:8000/`.

---

## 🧪 Running Automated Tests

Run the full automated test suite (19 tests covering registration, login, auth protection, validation, and CRUD operations):

```bash
python manage.py test
```

Expected output:
```text
Ran 19 tests in 1.2s

OK
```

---

## 📮 Postman Quick Start

1. Open **Postman**.
2. Click **Import** (top left) and select the `postman_collection.json` file from this project folder.
3. The collection is pre-configured with the variable `baseUrl = http://127.0.0.1:8000`.
4. Run the **"Register User"** or **"Login User"** request:
   - The test script will **automatically save the returned JWT token** into the collection variable `{{accessToken}}`!
5. You can now execute any of the **Tasks CRUD** requests immediately without manually copying tokens.

---

## 📖 Complete API Reference

### 🌐 Summary of Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` or `/api/` | API Overview & Sitemaps | No |
| `POST` | `/api/auth/register/` | Register a new user | No |
| `POST` | `/api/auth/login/` | Log in and obtain JWT tokens | No |
| `POST` | `/api/auth/refresh/` | Refresh access token | No |
| `GET` | `/api/auth/me/` | Get current user profile | Yes (`Bearer <token>`) |
| `GET` | `/api/tasks/` | List all tasks of authenticated user | Yes (`Bearer <token>`) |
| `POST` | `/api/tasks/` | Create a new task | Yes (`Bearer <token>`) |
| `GET` | `/api/tasks/<id>/` | Retrieve a specific task by ID | Yes (`Bearer <token>`) |
| `PUT` | `/api/tasks/<id>/` | Full update on task | Yes (`Bearer <token>`) |
| `PATCH` | `/api/tasks/<id>/` | Partial update on task | Yes (`Bearer <token>`) |
| `DELETE` | `/api/tasks/<id>/` | Delete a task | Yes (`Bearer <token>`) |

---

## 📑 Detailed Endpoint Documentation

### 1. User Registration

- **Endpoint**: `POST /api/auth/register/`
- **Auth**: None
- **Headers**: `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "farhandev",
  "email": "farhan@example.com",
  "password": "SecurePassword123!",
  "password_confirm": "SecurePassword123!",
  "first_name": "Farhan",
  "last_name": "Dev"
}
```

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "user": {
    "id": 1,
    "username": "farhandev",
    "email": "farhan@example.com",
    "first_name": "Farhan",
    "last_name": "Dev",
    "date_joined": "2026-09-21T13:10:00Z"
  },
  "tokens": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2. User Login

- **Endpoint**: `POST /api/auth/login/`
- **Auth**: None
- **Headers**: `Content-Type: application/json`

**Request Body:**
```json
{
  "username": "farhandev",
  "password": "SecurePassword123!"
}
```

*(Note: You can also pass your registered `email` in the `username` field)*

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": 1,
    "username": "farhandev",
    "email": "farhan@example.com",
    "first_name": "Farhan",
    "last_name": "Dev",
    "date_joined": "2026-09-21T13:10:00Z"
  },
  "tokens": {
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 3. User Profile

- **Endpoint**: `GET /api/auth/me/`
- **Auth**: Bearer Token
- **Headers**: `Authorization: Bearer <access_token>`

**Response (`200 OK`):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "farhandev",
    "email": "farhan@example.com",
    "first_name": "Farhan",
    "last_name": "Dev",
    "date_joined": "2026-09-21T13:10:00Z"
  }
}
```

---

### 4. Create Task

- **Endpoint**: `POST /api/tasks/`
- **Auth**: Bearer Token
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Build REST API documentation",
  "description": "Write a comprehensive README with example payloads and status codes.",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "due_date": "2026-10-01"
}
```

**Field Specifications:**
- `title` (*string, required*): Maximum 200 characters. Cannot be empty.
- `description` (*string, optional*): Detailed task description.
- `status` (*string, optional*): Choices: `TODO`, `IN_PROGRESS`, `COMPLETED`. Default: `TODO`.
- `priority` (*string, optional*): Choices: `LOW`, `MEDIUM`, `HIGH`. Default: `MEDIUM`.
- `due_date` (*string, optional*): Date in format `YYYY-MM-DD`.

**Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully.",
  "data": {
    "id": 1,
    "title": "Build REST API documentation",
    "description": "Write a comprehensive README with example payloads and status codes.",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "due_date": "2026-10-01",
    "owner": 1,
    "owner_username": "farhandev",
    "created_at": "2026-09-21T13:15:00Z",
    "updated_at": "2026-09-21T13:15:00Z"
  }
}
```

---

### 5. List Tasks

- **Endpoint**: `GET /api/tasks/`
- **Auth**: Bearer Token
- **Headers**: `Authorization: Bearer <access_token>`
- **Optional Query Parameters**:
  - `status`: e.g. `?status=TODO`, `?status=IN_PROGRESS`, `?status=COMPLETED`
  - `priority`: e.g. `?priority=HIGH`, `?priority=MEDIUM`, `?priority=LOW`
  - `search`: e.g. `?search=documentation` (matches title or description)
  - `ordering`: e.g. `?ordering=-created_at`, `?ordering=due_date`

**Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "Build REST API documentation",
      "description": "Write a comprehensive README with example payloads and status codes.",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "due_date": "2026-10-01",
      "owner": 1,
      "owner_username": "farhandev",
      "created_at": "2026-09-21T13:15:00Z",
      "updated_at": "2026-09-21T13:15:00Z"
    }
  ]
}
```

---

### 6. Retrieve Task by ID

- **Endpoint**: `GET /api/tasks/<id>/`
- **Auth**: Bearer Token
- **Headers**: `Authorization: Bearer <access_token>`

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Build REST API documentation",
    "description": "Write a comprehensive README with example payloads and status codes.",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "due_date": "2026-10-01",
    "owner": 1,
    "owner_username": "farhandev",
    "created_at": "2026-09-21T13:15:00Z",
    "updated_at": "2026-09-21T13:15:00Z"
  }
}
```

---

### 7. Full Update Task (`PUT`)

- **Endpoint**: `PUT /api/tasks/<id>/`
- **Auth**: Bearer Token
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "Build REST API documentation (Finished)",
  "description": "Finalized all endpoint docs and tested with Postman.",
  "status": "COMPLETED",
  "priority": "HIGH",
  "due_date": "2026-10-01"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "id": 1,
    "title": "Build REST API documentation (Finished)",
    "description": "Finalized all endpoint docs and tested with Postman.",
    "status": "COMPLETED",
    "priority": "HIGH",
    "due_date": "2026-10-01",
    "owner": 1,
    "owner_username": "farhandev",
    "created_at": "2026-09-21T13:15:00Z",
    "updated_at": "2026-09-21T13:20:00Z"
  }
}
```

---

### 8. Partial Update Task (`PATCH`)

- **Endpoint**: `PATCH /api/tasks/<id>/`
- **Auth**: Bearer Token
- **Headers**:
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`

**Request Body:**
```json
{
  "status": "COMPLETED"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Task updated successfully.",
  "data": {
    "id": 1,
    "title": "Build REST API documentation (Finished)",
    "description": "Finalized all endpoint docs and tested with Postman.",
    "status": "COMPLETED",
    "priority": "HIGH",
    "due_date": "2026-10-01",
    "owner": 1,
    "owner_username": "farhandev",
    "created_at": "2026-09-21T13:15:00Z",
    "updated_at": "2026-09-21T13:22:00Z"
  }
}
```

---

### 9. Delete Task (`DELETE`)

- **Endpoint**: `DELETE /api/tasks/<id>/`
- **Auth**: Bearer Token
- **Headers**: `Authorization: Bearer <access_token>`

**Response (`204 No Content`):**
*(Empty body as per HTTP standard)*

---

## ⚠️ Error Responses

All error responses return clean, standardized JSON with clear explanations and HTTP status codes:

### 1. `401 Unauthorized` (Missing or invalid token)
```json
{
  "success": false,
  "status_code": 401,
  "message": "Authentication credentials were not provided or are invalid.",
  "errors": {
    "detail": ["Authentication credentials were not provided."]
  }
}
```

### 2. `400 Bad Request` (Validation error)
```json
{
  "success": false,
  "status_code": 400,
  "message": "Input validation failed. Please check the submitted fields.",
  "errors": {
    "title": ["Task title cannot be empty."],
    "status": ["Invalid status 'INVALID'. Valid options are: TODO, IN_PROGRESS, COMPLETED."]
  }
}
```

### 3. `404 Not Found` (Resource does not exist)
```json
{
  "success": false,
  "status_code": 404,
  "message": "The requested resource was not found.",
  "errors": {
    "detail": ["No Task matches the given query."]
  }
}
```

---

## 📜 License
Developed for the Valentius Kryptix Internship Program. Free to use and distribute.
