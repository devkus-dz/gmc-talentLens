# 🚀 TalentLens API Routes Documentation

**Base URL:** `http://localhost:5000` (or your configured `PORT`)  
**Authentication:** All protected routes require a valid JWT via an `HttpOnly` Cookie (`jwt`) OR an `Authorization: Bearer <token>` header.

---

## 🔐 Authentication (`/api/auth`)
Handles user registration, login, session validation, and password recovery.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Registers a new Candidate, Recruiter, or Admin. |
| **POST** | `/api/auth/login` | Public | Authenticates a user and sets an HttpOnly JWT cookie. |
| **POST** | `/api/auth/logout` | Public | Clears the JWT cookie. |
| **GET** | `/api/auth/me` | Any Logged In | Verifies the token and returns the current user's profile. |
| **POST** | `/api/auth/forgot-password` | Public | Generates a secure reset token and sends an email. |
| **PATCH** | `/api/auth/reset-password/:token` | Public | Validates the token and updates the user's password. |

---

## 👤 Users (`/api/users`)
Handles profile updates, account settings, and administrative user management.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users` | `ADMIN` | Get all users, paginated. Accepts `?page`, `?limit`, `?role`. |
| **GET** | `/api/users/saved-jobs` | `CANDIDATE` | Get fully populated details of all saved jobs. |
| **PUT** | `/api/users/profile-picture` | Any Logged In | Upload profile picture/logo (Multipart Form) to S3. |
| **PATCH** | `/api/users/status` | `CANDIDATE` | Toggle "Open to Work" status (JSON body: `isLookingForJob`). |
| **PATCH** | `/api/users/saved-jobs/:jobId` | `CANDIDATE` | Toggle saving/unsaving a specific job. |
| **GET** | `/api/users/:id` | `ADMIN` | Get a specific user by ID. |
| **PATCH** | `/api/users/:id` | `ADMIN` | Update a specific user's basic data. |
| **DELETE** | `/api/users/:id` | `ADMIN` | Permanently delete a user from the database. |
| **PATCH** | `/api/users/:id/toggle-active` | `ADMIN` | Activate or deactivate a user account (blocks login). |

---

## 📄 Resumes (`/api/resumes`)
Handles CV parsing, AI extraction, and candidate profile data updates.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/resumes/me` | `CANDIDATE` | Fetch the candidate's latest parsed resume data. |
| **POST** | `/api/resumes/upload` | `CANDIDATE` | Uploads PDF, parses via AI, and saves to S3 (Multipart Form: `pdfFile`). |
| **PATCH** | `/api/resumes/:id` | `CANDIDATE`, `ADMIN` | Update the parsed JSON structure (add experiences, skills, etc.). |

---

## 💼 Job Offers & Applications (`/api/jobs`)
Handles the core job board, Kanban tracking, and AI matching.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/jobs` | `RECRUITER` | Create a new job offer. |
| **GET** | `/api/jobs` | Any Logged In | Browse active jobs. Accepts `?page`, `?limit`, `?search`, `?skills`, `?maxExperience`. |
| **GET** | `/api/jobs/applied` | `CANDIDATE` | Get all jobs the candidate has applied to (Dashboard view). |
| **GET** | `/api/jobs/:id/matches` | `RECRUITER` | Run the Hybrid AI Matching Algorithm for a specific job. |
| **POST** | `/api/jobs/:id/apply` | `CANDIDATE` | "One-Click Apply" to a job using the existing profile/resume. |
| **GET** | `/api/jobs/:id/applicants` | `RECRUITER`, `ADMIN` | Get all applicants + parsed AI resumes for the Kanban board. |
| **PATCH** | `/api/jobs/:id/applicants/:candidateId/status`| `RECRUITER`, `ADMIN` | Update applicant Kanban status (JSON body: `status`). |

---

## 🔔 Notifications (`/api/notifications`)
Handles system alerts for new job matches and application status updates.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/notifications` | Any Logged In | Get paginated notifications and unread count. Accepts `?page`, `?limit`. |
| **PATCH** | `/api/notifications/:id/read` | Any Logged In | Mark a specific notification as read. |
| **PATCH** | `/api/notifications/read-all` | Any Logged In | Mark all unread notifications for the user as read. |

---

## 📊 Dashboard & Analytics (`/api/dashboard`)
Serves aggregated, chart-ready data for user dashboards using MongoDB pipelines.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/dashboard/candidate` | `CANDIDATE` | Returns saved jobs count, total apps, and status breakdown chart data. |
| **GET** | `/api/dashboard/recruiter` | `RECRUITER` | Returns active/inactive jobs, total pipeline, and applicant status breakdown. |
| **GET** | `/api/dashboard/admin` | `ADMIN` | Returns platform-wide user growth, job volume, and total applications. |