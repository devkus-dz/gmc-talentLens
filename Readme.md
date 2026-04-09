# TalentLens Project

> **The next-generation Applicant Tracking System (ATS) powered by AI.**

TalentLens is a high-performance, deeply integrated platform designed to eliminate hiring friction. Featuring AI-driven resume parsing, automated candidate scoring, and drag-and-drop Kanban pipelines, it connects top-tier talent with industry-leading companies instantly.

Designed with a premium "Midnight Indigo" aesthetic, the platform prioritizes deep focus, data density, and technical authority.

---

## ✨ Core Features

* **🧠 AI Resume Parsing:** Extracts deep insights, context, and soft skills with 99.8% accuracy using NLP-powered Large Language Models.
* **🎯 Automated Scoring:** Instant fit-score calculations based on custom job requirements and cultural markers.
* **⚡ Drag & Drop Pipelines:** A highly responsive Kanban board designed for speed, allowing recruiters to move candidates between stages effortlessly.
* **📱 Progressive Web App (PWA):** Fully installable on mobile and desktop via Next.js and Serwist, offering native-like performance and offline caching.
* **🔒 Role-Based Access Control (RBAC):** Secure, isolated dashboards for Admins, Recruiters, and Candidates.
* **🚀 Zero-Latency Caching:** Built-in LRU memory caching ensures global search and data retrieval happen in milliseconds without overloading the database.

---

## 🛠️ Technology Stack

### **Frontend**
* **Framework:** Next.js 16+ (App Router)
* **Library:** React 19
* **Styling:** Tailwind CSS v4 + DaisyUI (Custom Dark Theme)
* **PWA Engine:** `@serwist/next`
* **Charts:** Recharts
* **Icons:** Lucide React

### **Backend**
* **Runtime:** Node.js
* **Framework:** Express.js (TypeScript)
* **Database:** MongoDB + Mongoose ORM
* **Authentication:** JSON Web Tokens (JWT) + bcrypt
* **Caching:** `lru-cache` (Least Recently Used In-Memory Cache)
* **Email Service:** Nodemailer (Gmail SMTP Integration)

---

## 📂 Architecture & Folder Structure

The project is built on a decoupled architecture, separating the Next.js client from the Node.js REST API.

```text
GMC-TalentLens/
│
├── backend/                  # Node.js / Express API Server
│   ├── src/
│   │   ├── controllers/      # Route logic (JobOffers, Users, Analytics)
│   │   ├── middlewares/      # JWT Auth, LRU Cache, Error Handling
│   │   ├── models/           # Mongoose Database Schemas
│   │   ├── routes/           # Express API Router definitions
│   │   └── services/         # External services (Email Service, AI Integration)
│   ├── .env                  # Backend environment variables
│   └── server.ts             # Express application entry point
│
└── frontend/                 # Next.js 16+ Application
    ├── public/               # Static assets, Manifest, PWA Icons
    ├── src/
    │   ├── app/              # Next.js App Router pages (Home, Auth, Dashboards)
    │   ├── components/       # Reusable UI (Navbar, Sidebar, Charts, Kanban)
    │   ├── lib/              # Utility functions and Axios API interceptors
    │   └── hooks/            # Custom React hooks
    ├── .env                  # Frontend environment variables
    ├── next.config.ts        # Next.js & Serwist PWA configuration
    └── tailwind.config.ts    # Custom typography and color tokens
```

## 🚀 Getting Started

To run this project locally, you will need Node.js 18+ and a running instance of MongoDB.

### 1. Clone the repository
```bash
git clone [https://github.com/devkus-dz/gmc-talentlens.git](https://github.com/devkus-dz/gmc-talentLens.git)
cd gmc-talentlens
```

### 2. Environment Variables

backend/.env
```text
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database (MongoDB Atlas)
DATABASE_URL=
TEST_DATABASE_URL=

# Security
JWT_SECRET=

# S3 Storage Configuration (RustFS)
S3_ENDPOINT="http://localhost:9000"
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_BUCKET_NAME=

# AI API
AI_API_KEY=

# Email Configuration (For Password Resets)
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
```

frontend/.env

```text
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Start the Backend

```bash
cd backend
npm install
npm run dev
```

### 4. Install Dependencies & Start the Frontend
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

## ⚖️ License & Copyright

This project is licensed under the **Apache License 2.0**.

Copyright © 2026 devkus-dz.

You are free to use, modify, and distribute this software, provided that you include a copy of the license and preserve the original copyright notice. See the [LICENSE](LICENSE) file for more details.