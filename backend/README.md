# MOVIEMAX Backend API

Node.js + Express + MongoDB Atlas Authentication Service.

## Features
- **User Registration** (`POST /api/auth/register`) with unique email enforcement and bcrypt password hashing.
- **User Login** (`POST /api/auth/login`) with credential validation and JWT token generation.
- **Protected Profile** (`GET /api/auth/me`) using JWT Bearer authentication.
- **Bookmark Synchronization** (`POST /api/bookmarks/toggle`, `GET /api/bookmarks`).
- **Health Check** (`GET /api/health`).

## Setup MongoDB Atlas

1. Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Go to **Network Access** and add your IP address (or `0.0.0.0/0` to allow access from anywhere during development).
3. Go to **Database Access** and create a database user with password.
4. Go to **Clusters** -> **Connect** -> **Drivers** (Node.js) and copy your connection string.
5. In `backend/.env`, set your connection string:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/movie_db?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_moviemax_2026_auth_token_secret
   CLIENT_URL=http://localhost:5173
   ```

## Running the Backend

```bash
cd backend
npm install
npm run dev
```

Server runs at `http://localhost:5000`.
