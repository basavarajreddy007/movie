# MOVIEMAX

MOVIEMAX is a full-stack movie discovery and bookmarking application built with a React + Vite frontend and a Node.js / Express + MongoDB backend.

## Project Structure

```
movie/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── package-lock.json
│   ├── index.html
│   ├── vite.config.js
│   ├── tsconfig.json
│   └── eslint.config.js
│
├── backend/
│   ├── src/
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── .env.example
│
├── .gitignore
├── .env.example
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm / yarn / pnpm
- MongoDB instance (local or MongoDB Atlas)

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will run at `http://localhost:5000`.

---

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env` (or `frontend/.env`):
   ```env
   VITE_TMDB_TOKEN=your_tmdb_bearer_token_here
   VITE_API_BASE_URL=
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The Vite dev server will run at `http://localhost:5173` with `/api` proxying requests to `http://localhost:5000`.

---

### Scripts

#### Frontend (`frontend/`)
- `npm run dev` - Start Vite development server
- `npm run build` - Build production bundle with TypeScript check
- `npm run lint` - Run ESLint checks
- `npm run preview` - Locally preview production build

#### Backend (`backend/`)
- `npm run dev` - Start Express server in watch mode (`node --watch server.js`)
- `npm start` - Start Express server (`node server.js`)

