# 🗺️ TalentLens API Routes Documentation

**Base URL:** `http://localhost:5000` (or your configured `PORT`)
**Authentication:** All routes below require a valid JWT via an `HttpOnly` Cookie (`jwt`) OR an `Authorization: Bearer <token>` header.

---

## 👤 Users (`/api/users`)
Handles profile updates, account settings, and administrative user management.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/users/profile` | Any Logged In | Get current user's profile data (includes S3 URLs). |
| **PUT** | `/api/users/profile-picture` | Any Logged In | Upload profile picture/logo (Multipart Form). |
| **PATCH** | `/api/users/status` | `CANDIDATE` | Toggle "Open to Work" status (JSON body: `isLookingForJob`). |
| **PATCH** | `/api/users/saved-jobs/:jobId` | `CANDIDATE` | Toggle saving/unsaving a specific job. |
| **GET** | `/api/users/saved-jobs` | `CANDIDATE` | Get fully populated details of all saved jobs. |
| **GET** | `/api/users` | `ADMIN` | Get all users, paginated. Accepts `?page`, `?limit`, `?role`. |

---

## 📄 Resumes (`/api/resumes`)
Handles CV parsing and S3 storage.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/resumes/upload` | `CANDIDATE` | Uploads PDF, parses via AI, and saves to S3 (Multipart Form: `pdfFile`). |

---

## 💼 Job Offers & Applications (`/api/jobs`)
Handles the core job board, Kanban tracking, and AI matching.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/jobs` | `RECRUITER` | Create a new job offer. |
| **GET** | `/api/jobs` | Any Logged In | Browse active jobs. Accepts `?page`, `?limit`, `?search`, `?skills`, `?maxExperience`. |
| **GET** | `/api/jobs/:id/matches` | `RECRUITER` | Run the Hybrid AI Matching Algorithm for a job. |
| **POST** | `/api/jobs/:id/apply` | `CANDIDATE` | "One-Click Apply" to a job using existing profile. |
| **GET** | `/api/jobs/applied` | `CANDIDATE` | Get all jobs the candidate has applied to (Dashboard view). |
| **GET** | `/api/jobs/:id/applicants` | `RECRUITER`, `ADMIN` | Get all applicants + parsed AI resumes for the Kanban board. |
| **PATCH** | `/api/jobs/:id/applicants/:candidateId/status`| `RECRUITER`, `ADMIN` | Update applicant Kanban status (JSON body: `status`). |

---

## 📊 Dashboard & Analytics (`/api/dashboard`)
Serves aggregated, chart-ready data for user dashboards.

| Method | Endpoint | Access Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/dashboard/candidate` | `CANDIDATE` | Returns saved jobs count, total apps, and status breakdown chart data. |
| **GET** | `/api/dashboard/recruiter` | `RECRUITER` | Returns active/inactive jobs, total pipeline, and applicant status breakdown. |
| **GET** | `/api/dashboard/admin` | `ADMIN` | Returns platform-wide user growth, job volume, and total applications. |

---

*Note: Replace `:id`, `:jobId`, and `:candidateId` in the URLs with the actual MongoDB `ObjectId` strings when making requests.*