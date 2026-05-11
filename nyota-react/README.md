# Nyota React Frontend

This folder contains the Nyota frontend built with React and Vite.

## Local Setup

1. Open a terminal in `nyota-react/`
2. Run `npm install`
3. Copy `.env.example` to `.env`
4. Set `VITE_API_URL` to your backend URL
5. Run `npm run dev`

Example:

```env
VITE_API_URL=http://localhost:4000
```

## Build

- `npm run build` - Create a production build in `dist/`
- `npm run preview` - Preview the production build locally

## Vercel Deployment

This app is prepared for Vercel with `vercel.json`.

Recommended Vercel settings:

1. Import the repository into Vercel.
2. Set the project Root Directory to `nyota-react`.
3. Confirm the framework preset is `Vite`.
4. Add `VITE_API_URL` as an environment variable and point it to your deployed Render backend, for example `https://your-backend.onrender.com`.
5. Deploy.

## Backend Connection

The frontend reads the backend base URL from `VITE_API_URL`.

- Local example: `http://localhost:4000`
- Production example: `https://your-backend.onrender.com`

Because the app uses `HashRouter`, client-side routes work on Vercel without extra rewrite rules.
