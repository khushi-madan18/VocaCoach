# VocaCoach: AI Voice Agent for Education

## 1. Project Title
**VocaCoach: AI Voice Agent for Education**

## 2. Problem Statement
Verbal skill mastery (fluency, public speaking, interview prep) is limited by slow, expensive, and inconsistent human feedback. "VocaCoach" solves this with a scalable, low-latency AI conversation partner that provides instant, personalized coaching anytime.

## 3. System Architecture
The system follows a standard client-server architecture optimized for real-time audio processing:
`Speech` ➔ `Web Audio` ➔ `AssemblyAI (STT)` ➔ `Transcript` ➔ `Convex (AI Logic)` ➔ `TTS Text` ➔ `Response`

- **Frontend:** Next.js/React for the user interface and audio capture.
- **Backend:** Node.js + Express.js acting as the central API layer.
- **Database:** Convex (Non-Relational Document DB) for persisting user sessions and history.
- **Authentication:** JWT-based login/signup.
- **AI Services:** AssemblyAI for Speech-to-Text and LLM integration for logic.

## 4. Key Features

### Authentication & Authorization
- **JWT Authentication:** Secure user registration and login (`/auth/login`) issuing JSON Web Tokens.
- **Role-based access:** Ensures users can only access their own data.

### Frontend Routing (Multiple Pages)
1.  **Landing Page:** Public home page with project overview.
2.  **Auth Pages:** Login and Signup forms.
3.  **Dashboard:** Main user hub to view stats and start sessions.
4.  **Practice Room:** The active interface for recording and AI interaction.
5.  **Profile/History:** Page to manage account settings and view past reports.

### CRUD Operations
**Create:**
1.  **Create Session:** Initialize a new coaching conversation/role-play scenario.
2.  **Create Note:** Save a specific learning note or "flashcard" from a transcript error.

**Read:**
1.  **Read History:** View a list of past practice sessions.
2.  **Read Dashboard:** View aggregated statistics (e.g., average fluency score).

**Update:**
1.  **Update Profile:** Edit user preferences or difficulty settings.
2.  **Update Note:** Edit the content of a previously saved note.

**Delete:**
1.  **Delete Session:** Remove a specific conversation from history.
2.  **Delete Note:** Remove a saved note that is no longer needed.

### SSFP (Search, Sort, Filter, Pagination)
Users can **Search** transcripts, **Filter** by topic, and **Sort** sessions by date or score for effective progress review and **Pagination**.

### Core Practice
- **Live Role-Play:** Enables high-stakes practice (interviews, pitches) with performance tracking.

## 5. Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js, React, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | Convex (Non-Relational Document DB) |
| **Authentication** | JSON Web Token (JWT) |
| **Speech Services** | AssemblyAI (Universal Streaming) |
| **Hosting** | Vercel (Frontend), Render/Railway (Backend) |

## 6. API Overview

| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/api/auth/login` | POST | Authenticates user and issues a JWT token. | Public |
| `/api/sessions` | POST | Create: Starts a new session/process turn. | Authenticated |
| `/api/notes` | POST | Create: Adds a new note to a session. | Authenticated |
| `/api/sessions` | GET | Read: Retrieves history list. | Authenticated |
| `/api/notes/:id` | PUT | Update: Updates a specific note content. | Authenticated |
| `/api/sessions/:id` | DELETE | Delete: Removes a session from the database. | Authenticated |

## Hosted URL
[voca-coach.vercel.app](https://voca-coach.vercel.app)
