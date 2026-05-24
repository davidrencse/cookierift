# CookieRift Frontend

React, Vite, TypeScript, and Tailwind CSS frontend for the CookieRift authorized session-handling assessment workspace.

## Setup

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_BASE_URL` when the backend is not running on `http://localhost:3000`.

```bash
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

## Build

```bash
npm run build
```

The Vite base path is configured for GitHub Pages at `/cookierift/`.
