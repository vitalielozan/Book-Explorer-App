import axios from 'axios';

/**
 * Talks to My-JSON-Server (github.com/vitalielozan/My-Json-Server).
 *
 * Requests are sent to this app's own origin under /api and forwarded by the
 * Vite proxy, which attaches the X-API-Key header the API requires for writes.
 * That is why the key never appears in this file, or anywhere else in src/.
 */
const api = axios.create({ baseURL: '/api' });

/**
 * The API is namespaced per project and collection: /api/<project>/<collection>.
 * Both collections below belong to the `books` project.
 */
const COLLECTIONS = {
  books: '/books/books',
  favorites: '/books/favorites',
};

export const COLLECTION_NAMES = Object.keys(COLLECTIONS);

function pathFor(collection) {
  const path = COLLECTIONS[collection];
  if (!path) throw new Error(`Unknown collection: ${collection}`);
  return path;
}

/**
 * json-server reports the unfiltered size of a collection in X-Total-Count, but
 * only sends it for paginated requests; the page length is the honest fallback.
 */
function totalFrom(response) {
  const header = Number(response.headers['x-total-count']);
  return Number.isFinite(header) ? header : response.data.length;
}

export async function listItems(collection, params, options = {}) {
  const response = await api.get(pathFor(collection), { params, ...options });
  return { items: response.data, total: totalFrom(response) };
}

export async function getItem(collection, id, options = {}) {
  const response = await api.get(`${pathFor(collection)}/${id}`, options);
  return response.data;
}

export async function createItem(collection, item) {
  const response = await api.post(pathFor(collection), item);
  return response.data;
}

export async function updateItem(collection, id, patch) {
  const response = await api.patch(`${pathFor(collection)}/${id}`, patch);
  return response.data;
}

export async function deleteItem(collection, id) {
  await api.delete(`${pathFor(collection)}/${id}`);
}

/** True for the cancellations React fires on unmount, which are not failures. */
export const isCanceled = (error) => axios.isCancel(error);

/**
 * The API answers failures with { error: { status, code, message } }. The codes
 * that a developer can actually act on get a message saying what to do about it;
 * everything else falls back to the server's own wording.
 */
const ACTIONABLE = {
  API_KEY_MISSING:
    'No API key reached the server. Set API_KEY in .env and restart the dev server.',
  API_KEY_INVALID:
    'The API key was rejected. Check API_KEY in .env against the Render dashboard.',
  API_KEY_NOT_CONFIGURED:
    'The API has no key configured, so writes are disabled on the server.',
  READ_ONLY: 'The API is in read-only mode, so nothing can be saved right now.',
  RATE_LIMITED: 'Too many requests. Wait a moment and try again.',
  CORS_ORIGIN_NOT_ALLOWED:
    'This origin is not in the API allowlist. Add it to ALLOWED_ORIGINS on Render.',
};

export function describeError(error, fallback = 'Something went wrong.') {
  const payload = error?.response?.data?.error;

  if (payload?.code && ACTIONABLE[payload.code]) return ACTIONABLE[payload.code];
  if (payload?.message) return payload.message;
  // No response at all means the request never landed: the free Render instance
  // sleeps when idle and the first call after that can take ~30s or time out.
  if (error?.request && !error?.response) {
    return 'Could not reach the API. It may be waking up — try again in a moment.';
  }
  return fallback;
}
