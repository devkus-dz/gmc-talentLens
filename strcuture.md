```text
talent-lens-workspace/
├── backend/ (Node.js + Express API)
│ ├── controllers/
│ ├── middlewares/ (Validation JWT, Upload file)
│ ├── models/ (Mongoose)
│ ├── routes/
│ └── services/ (Gemini AI, S3/RustFS)
│
├── frontend/ (Next.js 16)
│ ├── app/ (Pages, SSR, Layouts)
│ ├── components/ (Shadcn UI, Tables)
│ └── lib/ (API client axios/fetch)
│
└── docker-compose.yml (Orchestration globale)
```
