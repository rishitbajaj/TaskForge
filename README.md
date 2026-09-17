# TaskForge

TaskForge is a full-stack MERN kanban application with JWT authentication, user-scoped tasks, and a dark cyber-grid UI built with React, Redux Toolkit, Tailwind CSS, Express, and MongoDB.

## Features

- User registration and login with JWT
- Protected API routes and per-user task isolation
- Kanban board with drag-and-drop status updates
- Task filtering by search and priority
- Input validation and structured error responses
- Backend and frontend test suites

## Architecture

```mermaid
flowchart TB
  subgraph client [Frontend - React :3001]
    UI[Components]
    Redux[Redux Store]
    APIClient[Axios Client]
    UI --> Redux
    Redux --> APIClient
  end

  subgraph server [Backend - Express :5001]
    AuthRoutes[/api/auth]
    TaskRoutes[/api/tasks]
    AuthMW[JWT Auth Middleware]
    ValidateMW[express-validator]
    TaskRoutes --> AuthMW
    TaskRoutes --> ValidateMW
  end

  subgraph data [Database]
    MongoDB[(MongoDB :27017)]
  end

  APIClient -->|Bearer JWT| AuthRoutes
  APIClient -->|Bearer JWT| TaskRoutes
  AuthRoutes --> MongoDB
  TaskRoutes --> MongoDB
```

## Tech Stack

- **Frontend:** React 18, Redux Toolkit, React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, express-validator
- **Database:** MongoDB
- **Testing:** node:test + Supertest + mongodb-memory-server, React Testing Library

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for production deployment to a VPS (Docker + nginx).

```bash
cp .env.production.example .env.production
# edit .env.production with your domain and JWT secret
./scripts/deploy.sh
```

## Quick Start (Docker — local dev)

```bash
docker compose up --build
```

| Service  | URL |
|----------|-----|
| Frontend | http://localhost:3001 |
| Backend  | http://localhost:5001 |
| Health   | http://localhost:5001/api/health |

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Backend runs on port **5000** locally (Docker maps it to **5001**).

### Frontend

```bash
cd frontend
npm install
npm start
```

Set `REACT_APP_API_URL=http://localhost:5001` when the backend is exposed on port 5001.

## Environment Variables

### Backend (`.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | API port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/TaskForge` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:3001` |
| `JWT_SECRET` | Secret for signing JWTs | `your-secret-key-here` |

### Frontend

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend base URL | `http://localhost:5001` |

## API Endpoints

### Auth

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login and receive JWT |
| GET | `/api/auth/me` | Yes | Get current user profile |

### Tasks (all require JWT)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks` | List current user's tasks |
| POST | `/api/tasks` | Create a task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Health

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Service health check |

## Testing

### Backend

```bash
cd backend
npm install
npm test
```

### Frontend

```bash
cd frontend
npm install
npm test -- --watchAll=false
```

## Project Structure

```
TaskForge/
├── backend/
│   ├── middleware/     # auth, validation, error handling
│   ├── models/         # User, Task
│   ├── routes/         # authRoutes, taskRoutes
│   ├── tests/          # API integration tests
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/        # Axios client
│       ├── components/ # Auth, layout, tasks, common
│       └── store/      # Redux slices
└── docker-compose.yml
```
