# Legal Olympiad Platform

Legal Olympiad Platform is a full-stack web application for law students, colleges, and organizers to manage competitions, rankings, courses, webinars, podcasts, content, notifications, and user accounts in one place.

The repository is split into two apps:

- `backend/` - Node.js, Express, MongoDB, Redis, JWT auth, Brevo email, and Cloudinary uploads.
- `frontend/` - React, Vite, React Router, TanStack Query, Zustand, Tailwind CSS, and Radix UI components.

## What The Platform Does

The application is designed around a legal education and competition workflow:

- Users can register as students or college admins.
- Students can explore competitions, enroll in courses, watch webinars, read content, listen to podcasts, and check rankings.
- Colleges can participate in rankings and manage their presence on the platform.
- Admin-style routes support creating and managing competitions, webinars, courses, podcasts, and content.
- Auth-related email flows support verification and password reset.
- The homepage aggregates featured content, upcoming events, rankings, and platform stats.

## Tech Stack

### Backend

- Express API with route-based module structure
- MongoDB with Mongoose models
- Redis caching for repeated leaderboard and homepage queries
- JWT access and refresh tokens
- Brevo transactional email integration
- Cloudinary for uploads
- `express-validator` and centralized error handling
- Rate limiting, security headers, and request sanitization

### Frontend

- React 18 + Vite 5
- React Router for navigation
- TanStack Query for server state
- Zustand for client state
- Axios for API calls
- Tailwind CSS v3 for styling
- Radix UI primitives for accessible controls
- React Hook Form + Zod for form handling and validation

## Project Structure

```text
backend/
  server.js
  src/
    app.js
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/

frontend/
  src/
    api/
    components/
    hooks/
    pages/
    router/
    store/
    utils/
```

## Backend Overview

The backend exposes a REST API under `/api`.

Important route groups include:

- `/api/auth` - register, login, logout, current user, password reset, email verification
- `/api/users` - user management
- `/api/colleges` - college data and administration
- `/api/competitions` - competitions and registrations
- `/api/rankings` - student rankings, college rankings, and current-user ranking
- `/api/courses` - course listing and enrollment
- `/api/webinars` - webinar listing and attendance
- `/api/podcasts` - podcast listing and interactions
- `/api/content` - blog/article style content
- `/api/notifications` - user notifications
- `/api/homepage` - homepage feed and platform stats

The server entry point is `backend/server.js`. It loads environment variables, connects to MongoDB, and starts the Express app defined in `backend/src/app.js`.

## Frontend Overview

The frontend is a Vite React app with a component and page structure organized around the platform's features.

Key areas include:

- `src/pages/auth/` - login, register, and password recovery
- `src/pages/dashboard/` - user dashboard and profile screens
- `src/pages/competitions/` - competitions and rankings pages
- `src/pages/colleges/` - college listings and details
- `src/pages/courses/` - course catalog and detail pages
- `src/pages/webinars/` - webinar catalog and detail pages
- `src/pages/podcasts/` - podcast browsing
- `src/pages/content/` - blogs and article detail pages

The app uses a shared HTTP client in `src/api/http.js` so authenticated requests automatically include the stored bearer token.

## Environment Variables

### Backend `.env`

The backend requires the following variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

MONGO_URI=your_mongodb_connection_string

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@your-domain.com

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

JWT_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/v1/auth/google/callback

GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/v1/auth/github/callback
```

### Frontend `.env`

The frontend can optionally define:

```env
VITE_API_URL=http://localhost:5000/api
```

If `VITE_API_URL` is not set, the app defaults to `http://localhost:5000/api`.

## Installation

Install dependencies separately in each app directory.

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

## Running Locally

### Start the backend

```bash
cd backend
npm run dev
```

This starts the API server on port `5000` by default.

### Start the frontend

```bash
cd frontend
npm run dev
```

This starts the Vite dev server, usually on port `5173`.

## Available Scripts

### Backend

- `npm run dev` - start the server with Nodemon
- `npm start` - start the production server
- `npm run seed` - run the database seeder

### Frontend

- `npm run dev` - start the Vite development server
- `npm run build` - build the production bundle
- `npm run preview` - preview the production build locally

## Authentication Flow

The application uses a mixed auth strategy:

- The backend returns an access token and sets a refresh token cookie.
- The frontend stores the access token in local storage and attaches it to API requests.
- Protected pages hydrate the current user from `/api/auth/me` when a token exists.

Registration supports two roles:

- `student`
- `college_admin`

College admins must choose a college during registration.

## Rankings And Leaderboards

The rankings subsystem supports:

- Student leaderboards
- College leaderboards
- Current-user ranking lookup
- Ranking recomputation for admins

Rankings are cached on the backend to reduce repeated database work.

## Content And Learning Modules

The platform includes multiple content types that can be consumed independently:

- Competitions
- Courses
- Webinars
- Podcasts
- Blogs and articles

The homepage combines these into a curated feed so users can discover active and featured content quickly.

## Error Handling And Validation

The backend uses centralized API error handling and request validation. Most API failures return structured JSON with:

- `success`
- `message`
- `errors`

This makes it easier for the frontend to show meaningful form and API errors.

## Development Notes

- The frontend uses the `@` alias for imports from `frontend/src`.
- The backend is intentionally modular: controllers handle HTTP details, services handle business logic, and models define data shape.
- Redis, MongoDB, Brevo, and Cloudinary credentials must all be present before the backend can start.
- If the auth or rankings requests behave unexpectedly, check the browser network tab first; most state is driven by API responses rather than local mock data.

## Troubleshooting

- If the frontend cannot reach the API, confirm `VITE_API_URL` and `CLIENT_URL` are aligned with the ports you are using.
- If login or registration fails, verify that the backend `.env` file includes JWT, MongoDB, Redis, Brevo, and Cloudinary values.
- If you want Google or GitHub sign-in, add the OAuth client ID, secret, and callback URL values shown above. The callback URLs must match the provider console exactly.
- If rankings or dashboard data are empty, it may simply mean the current user does not yet have a ranking document.
- If a port is already in use, stop the process currently bound to that port or change the `PORT` value in the backend `.env` file.

## Suggested First Run

1. Configure the backend `.env` file.
2. Start MongoDB and Redis.
3. Run `npm install` in both `backend/` and `frontend/`.
4. Start the backend with `npm run dev` in `backend/`.
5. Start the frontend with `npm run dev` in `frontend/`.
6. Open the frontend URL in the browser and register a new account.

## License

No license file is included in the repository. Add one if you plan to publish or distribute the project.