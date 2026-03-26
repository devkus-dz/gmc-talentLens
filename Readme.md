# 🎯 TalentLens: AI-Powered Recruitment Platform

> TalentLens is a next-generation Applicant Tracking System (ATS) powered by Artificial Intelligence. It transforms the tedious manual screening process into an automated, data-driven workflow.

## 📖 About The Project

In today's competitive job market, HR departments are overwhelmed by the volume of applications. TalentLens addresses this by utilizing Large Language Models (LLMs) to automate resume parsing, generate job descriptions, and semantically match candidates to open positions.

Developed as a Master's degree final project (PFE), this SaaS platform is built using a **Modular Monolith architecture** on the MERN stack (MongoDB, Express/Next.js, React, Node) to ensure enterprise-grade scalability, security, and data sovereignty.

## ✨ Key Features

### 🤖 Core AI Capabilities

- **Smart Resume Parsing:** Upload a PDF CV, and the AI instantly extracts personal info, skills, education, and experience into a structured JSON format.
- **Semantic Matching Engine:** Calculates a compatibility score (0-100%) between a candidate's profile and specific job requirements.
- **AI Job Description Generator:** Recruiters can input brief notes, and the AI generates a professional, ready-to-publish job listing.

### 👥 User Modules

- **For Candidates:** "One-Click Apply" by uploading a CV. The system auto-fills the profile and recommends relevant job openings.
- **For Recruiters:** A visual Kanban pipeline to track applications, smart candidate filtering, and AI-driven insights on applicant strengths and weaknesses.
- **For Admins:** Role-Based Access Control (RBAC) and platform analytics.

## 🛠️ Technology Stack

**Frontend:**

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- Radix UI / Shadcn (Accessible Headless UI components)

**Backend & Data:**

- Server Actions & API Routes (Next.js)
- [MongoDB](https://www.mongodb.com/) (with Mongoose ORM)
- [RUSTFS](https://rustfs.com/) / AWS SDK v3 (S3-compatible secure object storage for CVs)
- [JWT](https://jwt.dev/) (JWT http-only for secure authentication)

**AI & Infrastructure:**

- Google Gemini API (`@google/generative-ai`)
- Docker & Docker Compose (Containerization)
