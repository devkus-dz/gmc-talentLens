# AI-Powered Applicant Tracking System (ATS) - TalentLens Backend API

This repository contains the backend infrastructure for a next-generation Applicant Tracking System (ATS). It leverages Node.js, TypeScript, MongoDB, and Google's Gemini 2.5 Flash AI to automate resume parsing, data structuring, and candidate-to-job matching.

## 🚀 Core Architecture: How It Works

This system is built on a **"Smart Router"** architecture designed for maximum reliability, speed, and cost-efficiency.

### 1. The Resume Parsing Pipeline
When a candidate uploads a CV, the system does not blindly send the file to an AI. Instead, it routes the file through a multi-step pipeline:
* **Local Text Extraction (Fast & Free):** The system first attempts to extract raw text locally using `pdf-parse`. This handles 95% of standard digital PDFs in milliseconds without using any AI API quota.
* **Vision OCR Fallback (Reliable):** If the PDF is a scanned image (returning < 50 characters of text) or if the user uploads a direct image (JPG/PNG), the Smart Router instantly detects the failure and pivots. It sends the raw binary file to Gemini 2.5 Flash's Multimodal Vision API to visually "read" the document.
* **Structured JSON Formatting:** Regardless of how the text is extracted, it is passed into a strict schema prompt. The AI acts as a data extractor, pulling out standard fields (Experience, Education, Skills) and generating contextual metadata (a 2-sentence summary, detected language locale, and professional tags).

---

## 🧠 The Hybrid Job Matching Algorithm

The crown jewel of this backend is the **Hybrid Matching Engine**. When a recruiter wants to find candidates for a specific Job Offer, we do not simply search for keywords, nor do we send our entire database to the AI. We use a two-phase hybrid approach.

### Why We Chose the Hybrid Approach
Sending thousands of resumes to an LLM for evaluation is too slow (high latency) and too expensive (high token usage). Conversely, relying purely on a traditional database query misses the nuance of human experience (e.g., failing to realize that a "Frontend Engineer" is a great fit for a "React Developer" role). 

The Hybrid approach gives us the speed of a database with the semantic reasoning of an AI.

### Phase 1: The Fast Filter (MongoDB)
Before the AI is even engaged, MongoDB executes a lightweight query to eliminate obvious mismatches. 
* It filters out candidates who lack the absolute minimum years of experience (giving a 1-year grace period).
* It requires the candidate to share at least **one** overlapping "Tag" or "Skill" with the Job Offer.
* **Result:** A database of 10,000 resumes is instantly reduced to the top 20 most viable candidates for free.

### Phase 2: The Deep AI Semantic Read (Gemini)
Those top 20 candidates are formatted into a lightweight JSON payload and sent to Gemini alongside the Job Description. The AI acts as an expert HR Recruiter, reading between the lines to score the candidates.
* **Result:** The system returns a strict, sorted JSON response featuring a detailed score breakdown (Skills Match, Experience Match, Culture/Title Fit) and a 1-to-2 sentence written explanation justifying the score.

---

## 🛠 Tech Stack
* **Runtime:** Node.js
* **Language:** TypeScript
* **Framework:** Express.js
* **Database:** MongoDB (Mongoose)
* **File Storage:** AWS S3 / RustFS
* **AI Provider:** Google Generative AI (Gemini 2.5 Flash)
* **Document Parsing:** Multer (Memory Storage), `pdf-parse`

## 📂 Project Structure (AI Services)
To maintain clean code and Separation of Concerns, the AI logic is split:
* `/services/geminiService.ts`: The main executor and Smart Router.
* `/services/ai/resumeConfig.ts`: The schemas and prompts for CV extraction.
* `/services/ai/jobMatchConfig.ts`: The schemas and prompts for candidate scoring.