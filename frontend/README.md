### Frontend structure

```text
src/
├── app/
│   ├── (auth)/                # Route Group (no sidebars here)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── candidate/             # Candidate Dashboard
│   │   ├── layout.tsx         # Candidate Sidebar & Bottom Nav
│   │   ├── dashboard/page.tsx # Stats & Applications
│   │   ├── profile/page.tsx   # Resume AI Upload Form
│   │   └── jobs/page.tsx      # Job Board
│   ├── recruiter/             # Recruiter Dashboard
│   │   ├── layout.tsx         # Recruiter Sidebar
│   │   ├── dashboard/page.tsx # Pipeline Stats
│   │   └── jobs/page.tsx      # Kanban Board & AI Matcher
│   ├── admin/                 # Admin Dashboard
│   │   ├── layout.tsx         # Admin Sidebar
│   │   ├── dashboard/page.tsx # Macro Stats
│   │   └── users/page.tsx     # The User Table with Toggles
│   ├── globals.css
│   ├── layout.tsx             # Root layout (Fonts, Meta tags)
│   └── page.tsx               # Landing Page (The one we just edited)
├── components/
│   ├── layout/                # Global shells
│   │   ├── Navbar.tsx         # Top bar (Logo, Search, Bell, Theme)
│   │   └── MobileBottomNav.tsx# PWA specific bottom bar
│   └── ui/                    # Reusable pieces (Cards, Badges)
│       ├── JobCard.tsx
│       └── MatchRing.tsx
└── lib/
    └── api.ts                 # Axios/Fetch setup for backend calls
```