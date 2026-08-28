# Interview Master

An AI-powered interview preparation tool. Paste a job description, upload your resume (or write a short self-description), and get a personalised plan: a match score, skill gaps, technical and behavioral interview questions with model answers, a multi-day preparation roadmap, and a tailored PDF resume.

## Features

- **AI-generated interview reports** — match score, technical questions, behavioral questions, skill gaps, and a day-by-day preparation plan, all derived from your resume and the target job description.
- **Resume PDF generation** — produces a tailored, downloadable PDF resume (rendered headlessly via Puppeteer) for each report.
- **Authentication** — register / login / logout, JWT in an httpOnly cookie, server-side token blacklist on logout.
- **Per-user report history** — view and reopen any previous report from the home page.
- **Protected routes** — frontend routes are gated by an auth context; backend endpoints use a JWT middleware.

## Tech Stack

**Frontend** — `Frontend/`
- React 19 + React Router 8
- Vite 8 (with `@vitejs/plugin-react` using Oxc)
- Axios for HTTP
- SCSS for styling

**Backend** — `Backend/`
- Node.js + Express 5
- MongoDB via Mongoose 9
- JWT auth (jsonwebtoken) + bcryptjs
- Multer for multipart resume uploads, `pdf-parse` for resume text extraction
- Google GenAI (`@google/genai`) for report generation, with a Zod schema to constrain the model output
- Puppeteer for PDF rendering
- Zod for request/response validation

## Project Structure

```
interview-master/
├── Backend/
│   ├── server.js                # entry point — loads env, connects DB, starts Express
│   └── src/
│       ├── app.js               # Express app: CORS, JSON, cookies, route mounting
│       ├── config/database.js   # Mongoose connection
│       ├── controllers/         # auth + interview report handlers
│       ├── middlewares/         # JWT auth, multer file upload
│       ├── models/              # Mongoose schemas (User, Blacklist, InterviewReport)
│       ├── routes/              # /api/auth, /api/interview
│       └── services/ai.service  # GenAI + Zod schema + Puppeteer PDF generation
└── Frontend/
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx             # React root
        ├── App.jsx              # Provider tree (Auth, Interview) + router
        ├── app.routes.jsx       # route table
        └── features/
            ├── auth/            # login, register, auth context, protected route
            └── interview/       # home (create report), report view, hook, API client
```

## Prerequisites

- Node.js 18+ (the project uses ESM in the frontend and CommonJS in the backend)
- A running MongoDB instance (local or Atlas)
- A Google GenAI API key — get one at https://aistudio.google.com/apikey
- On first run, Puppeteer will download a bundled Chromium; if it fails in your environment, point `PUPPETEER_EXECUTABLE_PATH` at a local Chrome/Chromium.

## Environment Variables

Create `Backend/.env`:

```env
# Mongo connection string
MONGO_URI=mongodb://localhost:27017/interview-master

# Google GenAI
GOOGLE_GENAI_API_KEY=your-key-here

# Auth
JWT_SECRET=replace-with-a-long-random-string

# Optional Puppeteer override
PUPPETEER_EXECUTABLE_PATH=
```

The frontend talks to the backend on `http://localhost:3000` (configured in `src/features/interview/services/interview.api.js`). CORS in `Backend/src/app.js` allows `http://localhost:5173` with credentials.

## Install & Run

Two terminals — one for the API, one for the web app.

```bash
# 1. Backend
cd Backend
npm install
npm run dev          # nodemon server.js — http://localhost:3000

# 2. Frontend
cd Frontend
npm install
npm run dev          # vite — http://localhost:5173
```

Other useful scripts:

```bash
# Frontend
npm run build        # production build
npm run preview      # serve the production build locally
npm run lint         # ESLint
```

## API Reference

All interview routes are private (require a valid JWT cookie). Auth routes are public except `GET /api/auth/get-me`.

| Method | Path                                      | Description                                                       |
| ------ | ----------------------------------------- | ----------------------------------------------------------------- |
| POST   | `/api/auth/register`                      | Create a new user                                                 |
| POST   | `/api/auth/login`                         | Log in, sets JWT cookie                                           |
| GET    | `/api/auth/logout`                        | Clear cookie, blacklist the token                                 |
| GET    | `/api/auth/get-me`                        | Current logged-in user                                            |
| POST   | `/api/interview/`                         | Generate a new report (multipart: `jobDescription`, `selfDescription`, `resume`) |
| GET    | `/api/interview/`                         | List the caller's reports (summary fields)                        |
| GET    | `/api/interview/report/:interviewId`      | Fetch a single report by id                                       |
| POST   | `/api/interview/resume/pdf/:interviewReportId` | Generate and stream a tailored PDF resume                    |

## How a Report Is Built

1. The user submits `jobDescription`, optional `resume` (PDF), and optional `selfDescription`.
2. The backend parses the resume text, then calls Google GenAI with a Zod-constrained prompt describing the desired report shape (match score, technical questions, behavioral questions, skill gaps, preparation plan).
3. The validated response is persisted to `InterviewReport` and returned to the client.
4. The client navigates to `/interview/:interviewId` and renders the three sections (technical / behavioral / roadmap) plus the match score and skill-gap sidebar.

## Notes

- The project is a work in progress; the tracked files in `git status` show a number of uncommitted changes around the interview report flow.
- The Frontend README at `Frontend/README.md` is the default Vite template — it can be removed or replaced.
- The route component for the report view is `Frontend/src/features/interview/pages/Interview.jsx`. Make sure it is imported with a capital `I` — React treats lowercase JSX tags as native HTML, which renders nothing.
