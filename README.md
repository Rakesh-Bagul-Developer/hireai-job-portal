# 🤖 HireAI – AI-Powered Job Portal

![HireAI Banner](https://img.shields.io/badge/HireAI-Job%20Portal-blue?style=for-the-badge&logo=briefcase)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Django](https://img.shields.io/badge/Django-5.1-092E20?style=for-the-badge&logo=django)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql)
![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)

> A full-stack AI-Powered Smart Recruitment System built with React.js, Python Django, Django REST Framework, and MySQL.

---

## 🌟 Live Demo

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| ⚙️ Backend API | http://localhost:8000 |
| 🔧 Admin Panel | http://localhost:8000/admin |

---

## ✨ Features

### 👤 Job Seeker
- ✅ Register and login securely
- ✅ Browse and search jobs with advanced filters
- ✅ Apply for jobs with cover letter
- ✅ Track application status in real-time
- ✅ Save favourite jobs
- ✅ Get notifications on status updates
- ✅ Manage professional profile

### 🏢 Employer
- ✅ Post and manage job listings
- ✅ View all applications per job
- ✅ Update application statuses
- ✅ Hiring analytics dashboard
- ✅ Manage company profile
- ✅ Feature job listings

### 🔧 Admin
- ✅ Full Django admin panel
- ✅ Manage users, jobs, categories
- ✅ View all applications and notifications
- ✅ Verify employers

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Styling | Custom CSS with CSS Variables |
| Backend | Python Django 5.1, DRF 3.14 |
| Database | MySQL 8.0 |
| Authentication | Token Authentication (DRF) |
| CORS | django-cors-headers |
| Image Handling | Pillow |

---

## 📁 Project Structure

```
hireai-job-portal/
├── backend/
│   ├── job_portal/          # Project settings & URLs
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/            # User auth & profiles
│   │   ├── models.py        # User, JobSeekerProfile, EmployerProfile
│   │   ├── views.py         # Register, Login, Profile APIs
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── jobs/                # Job listings & categories
│   │   ├── models.py        # Job, Category, SavedJob
│   │   ├── views.py         # Job CRUD, Search, Filter APIs
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── applications/        # Applications & notifications
│   │   ├── models.py        # Application, Interview, Notification
│   │   ├── views.py         # Apply, Track, Notify APIs
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Home.js
│   │   │   ├── Auth.js
│   │   │   ├── Jobs.js
│   │   │   ├── JobDetail.js
│   │   │   ├── Dashboard.js
│   │   │   ├── PostJob.js
│   │   │   └── Profile.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
├── database_setup.sql
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 16+
- MySQL 8.0+
- Git

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Rakesh-Bagul-Developer/hireai-job-portal.git
cd hireai-job-portal
```

---

### 2️⃣ Database Setup

```bash
mysql -u root -p
```

```sql
CREATE DATABASE job_portal_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
exit;
```

---

### 3️⃣ Backend Setup

```bash
cd backend

# Install dependencies
py -3.11 -m pip install -r requirements.txt

# Run migrations
py -3.11 manage.py makemigrations accounts
py -3.11 manage.py makemigrations jobs
py -3.11 manage.py makemigrations applications
py -3.11 manage.py migrate

# Create superuser
py -3.11 manage.py createsuperuser

# Add categories
py -3.11 manage.py shell
```

In Django shell:
```python
from jobs.models import Category
cats = [('Technology','technology'),('Design','design'),('Marketing','marketing'),('Finance','finance'),('Healthcare','healthcare'),('Education','education'),('Sales','sales'),('Operations','operations')]
for name, slug in cats:
    Category.objects.get_or_create(name=name, slug=slug)
exit()
```

Start backend server:
```bash
py -3.11 manage.py runserver
```

---

### 4️⃣ Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

### 5️⃣ Open in Browser

```
http://localhost:3000
```

---

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Register new user |
| POST | `/api/auth/login/` | Login user |
| POST | `/api/auth/logout/` | Logout user |
| GET/PATCH | `/api/auth/profile/` | Get or update profile |
| GET/PATCH | `/api/auth/seeker-profile/` | Job seeker profile |
| GET/PATCH | `/api/auth/employer-profile/` | Employer profile |

### 💼 Jobs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs/` | List all jobs with filters |
| GET | `/api/jobs/featured/` | Get featured jobs |
| GET | `/api/jobs/categories/` | Get all categories |
| POST | `/api/jobs/create/` | Post a new job |
| GET | `/api/jobs/{id}/` | Get job details |
| PATCH | `/api/jobs/{id}/edit/` | Update job |
| DELETE | `/api/jobs/{id}/edit/` | Delete job |
| POST | `/api/jobs/{id}/save/` | Save or unsave job |
| GET | `/api/jobs/saved/` | Get saved jobs |
| GET | `/api/jobs/my-jobs/` | Employer posted jobs |

### 📝 Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/applications/apply/` | Apply for a job |
| GET | `/api/applications/my/` | My applications |
| GET | `/api/applications/job/{id}/` | Job applications |
| PATCH | `/api/applications/{id}/status/` | Update status |
| GET | `/api/applications/dashboard/` | Dashboard stats |
| GET | `/api/applications/notifications/` | Notifications |
| PATCH | `/api/applications/notifications/read-all/` | Mark all read |

### 🔍 Search & Filter
```
GET /api/jobs/?q=python&job_type=full_time&experience=mid&location=hyderabad&is_remote=true
```

---

## 🗄️ Database Schema

```
accounts_user          → Custom user with role field
accounts_jobseekerprofile → Skills, experience, resume
accounts_employerprofile  → Company info, logo
jobs_category          → Job categories
jobs_job               → Job listings
jobs_savedjob          → Saved jobs by seekers
applications_application → Job applications
applications_interview   → Interview schedules
applications_notification → User notifications
auth_token_token        → Authentication tokens
```

---

## 👤 User Roles

### Job Seeker
- Browse and search jobs
- Apply with cover letter
- Track application status
- Save favourite jobs
- Receive notifications
- Manage profile and resume

### Employer
- Post and manage jobs
- View applicants
- Update application status
- View analytics dashboard
- Manage company profile

### Admin
- Full admin panel access
- Manage all users and jobs
- View all applications
- Add job categories

---

## 🔐 Authentication

All protected routes require Token Authentication:

```
Authorization: Token <your_token_here>
```

---

## 📊 Project Stats

| Metric | Count |
|--------|-------|
| API Endpoints | 15+ |
| Database Tables | 10+ |
| Django Apps | 3 |
| React Pages | 7 |
| User Roles | 3 |
| Technologies | 6 |

---

## 🚀 Running the Project

### Every time you start:

**Terminal 1 — Backend:**
```bash
cd backend
py -3.11 manage.py runserver
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
```

---

## 👨‍💻 Developer

**Rakesh Bagul**
- 🌐 GitHub: [github.com/Rakesh-Bagul-Developer](https://github.com/Rakesh-Bagul-Developer)
- 💼 LinkedIn: [linkedin.com/in/rakesh-bagul-developer](https://linkedin.com/in/rakesh-bagul-developer)
- 📧 Email: rakeshbagul794@gmail.com

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

⭐ **If you found this project helpful, please give it a star!** ⭐
