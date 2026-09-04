# 📚 Book Explorer

A React app for browsing a book catalog and saving discoveries from the Open Library API.

## 🚀 Features

- Browse the catalog with server-side search and sorting
- Search Open Library and save books to your favorites
- Like books and leave comments
- Responsive UI with React Bootstrap

## 🧰 Tech stack

- React 19 + Vite
- React Router
- React Bootstrap
- Axios
- [My JSON Server](https://github.com/vitalielozan/My-Json-Server) — the REST API backing this app
- [Open Library API](https://openlibrary.org/developers/api)

## 🔧 How to run

```bash
npm install
cp .env.example .env    # then fill in API_KEY
npm run dev             # http://localhost:3000
```

Reads work without any configuration. **Writes — likes, comments, saving a book —
need `API_KEY`** in `.env`; take it from the Render dashboard of the
`my-json-server` service (Environment tab). Without it the app still runs, and
every write shows a message saying the key is missing.

The key has no `VITE_` prefix on purpose: `vite.config.js` reads it in Node and
the dev proxy attaches it as the `X-API-Key` header, so it never ends up in the
browser bundle. Renaming it to `VITE_API_KEY` would publish it to anyone who
opens DevTools.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 3000, with the `/api` proxy |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serves `dist/` on port 3000, with the same proxy |
| `npm run lint` | ESLint over the repo |

## 🔌 The API

Requests go to `/api/...` on this app's own origin and the Vite proxy forwards
them to the deployed service. Two collections of the API's `books` project are
used:

| Collection | Path | Contents |
| --- | --- | --- |
| `books` | `/api/books/books` | The curated catalog, versioned in the API's git repo |
| `favorites` | `/api/books/favorites` | Books imported from Open Library |

Search and sorting are query parameters handled by the API (`?q=`, `?_sort=`,
`?_order=`), not filtering done in the browser.

Note that the API is hosted on Render's free tier: the instance sleeps when
idle, so the first request after a pause can take around 30 seconds, and writes
are reset on every deploy.
