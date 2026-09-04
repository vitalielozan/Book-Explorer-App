# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev      # Vite dev server on port 3000, with the /api proxy
npm run build    # production build to dist/
npm run preview  # serves dist/ on port 3000, same proxy as dev
npm run lint     # eslint over the repo
```

There is no test framework, test script, or test file in this project. Don't claim tests pass; there are none to run.

## The backend

Data comes from **My JSON Server** (`github.com/vitalielozan/My-Json-Server`, also checked out
at `../../JavaScript Projects/My-Json-Server`), a multi-project Express + json-server API
deployed on Render. Read that repo's `CLAUDE.md` before changing anything about how this app
talks to it.

Two collections of its `books` project are used:

| Collection | Path | Contents |
| --- | --- | --- |
| `books` | `/api/books/books` | Curated catalog, versioned in the API's repo |
| `favorites` | `/api/books/favorites` | Books imported from Open Library |

Three things about it shape this codebase:

1. **Reads are public; writes require a shared key.** Every `POST`/`PATCH`/`DELETE` needs an
   `X-API-Key` header or the API answers `401 API_KEY_MISSING`. The key lives in `.env` as
   `API_KEY` — deliberately *without* a `VITE_` prefix — and only `vite.config.js` reads it,
   attaching it to proxied requests in the `proxyReq` hook. Never move it to
   `import.meta.env`: that publishes the key in the bundle. Any deployment other than the
   local dev/preview server therefore needs its own proxy to add the header.
2. **The proxy does not rewrite the path.** The API namespaces its own projects under `/api`,
   so `/api/books/books` is forwarded verbatim. An earlier version of the API served
   collections at the root and the config stripped `/api`; those root paths still work as
   deprecated aliases, but new code should use the namespaced form.
3. **Failures have a shape**: `{ error: { status, code, message } }`. `describeError` in
   `src/api/client.js` maps the codes worth acting on (missing/invalid key, read-only,
   rate limited) to messages that say what to do, and falls back to the server's own wording.

The free Render instance sleeps when idle, so a first request can take ~30s, and writes are
lost on redeploy — the data resets to what is committed in the API repo.

## Architecture

React 19 + Vite SPA. No state library and no data-fetching library: pages own their
`useState`/`useEffect` and call the functions in `src/api/client.js`.

- **`src/api/client.js` is the only module that knows API paths.** It exposes
  `listItems`/`getItem`/`createItem`/`updateItem`/`deleteItem`, each taking a collection name
  (`'books'` or `'favorites'`) that it resolves through a `COLLECTIONS` map. Adding a
  collection means adding an entry there, not a new axios call in a page.
- **Fetches are abortable.** Every fetching effect creates an `AbortController`, passes
  `signal` through, and ignores the resulting cancellation via `isCanceled`. Search inputs
  debounce into a separate state value (`search` → `query`) so the effect does not fire per
  keystroke.
- **`BookDetails` serves both collections** through a `collection` prop set by the route, so
  `/books/:id` and `/favorites/:id` share one page.
- **`AsyncState`** renders the loading/error/empty branches; **`BookCard`** renders a record
  from either collection, with optional like and remove handlers.
- Records have the shape `{ id, title, author, shortDesc, description, image, likes, comments }`.
  `likes` is a 0/1 flag, not a count. `comments` is an array of strings with no per-comment
  endpoint, so adding one PATCHes the whole array back. Favorites additionally carry
  `sourceKey` — Open Library's work key — which is what duplicate detection compares.
- Open Library is called directly from `DiscoverBook.jsx`, not through the proxy, with an
  explicit `fields` parameter because the default response is enormous.

## Conventions

- ESLint flat config: `no-unused-vars` is an **error** with `varsIgnorePattern: '^[A-Z_]'`;
  `vite.config.js` and `eslint.config.js` get Node globals. React 19's JSX transform means
  components do not import React.
- Single quotes, including in JSX attributes.
- User-visible failures go through `describeError` into an `Alert`, never `alert()` or a bare
  `console.error`.
