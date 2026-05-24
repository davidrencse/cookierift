# CookieRift Backend

Node.js, Express, and TypeScript REST API for local authorized session assessment records and bounded target checks.

## Setup

```bash
npm install
npm run build
npm run dev
```

The API listens on port 4000 by default. Set `PORT` to override it.

## Persistence

Assessment data is stored in `backend/data/store.json`. This file-backed JSON store is suitable for the local MVP and can be replaced by a database later.

## Required workflow

1. Call `POST /api/authorized-use/acknowledge` with an authorization reference.
2. Create an assessment with target metadata and scope notes.
3. Configure the assessment.
4. Start a run with `confirmAuthorized: true`.

Runs are bounded to configured in-scope URLs, use GET requests, cap sequential requests, support stop requests, redact sensitive headers, and store cookie values as SHA-256 hashes.
