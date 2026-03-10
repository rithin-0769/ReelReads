import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE } from '../config';

const hasApiKey = TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY_HERE';

const headers = hasApiKey
  ? { Authorization: `Bearer ${TMDB_API_KEY}`, 'Content-Type': 'application/json' }
  : {};

async function tmdbFetch(endpoint, params = {}) {
  if (!hasApiKey) return null;

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), { headers });
  if (!res.ok) throw new Error(`TMDB error: ${res.status}`);
  return res.json();
}

export async function searchMovies(query) {
  if (!query.trim()) return [];
  const data = await tmdbFetch('/search/movie', { query, include_adult: false, language: 'en-US', page: 1 });
  if (!data) return [];
  return data.results.slice(0, 8).map(normalizeMovie);
}

export async function getMovieDetails(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}`, {
    language: 'en-US',
    append_to_response: 'keywords',
  });
  if (!data) return null;

  const keywords = data.keywords?.keywords?.map(k => k.name) ?? [];
  return {
    ...normalizeMovie(data),
    genres: data.genres?.map(g => g.name) ?? [],
    genre_ids: data.genres?.map(g => g.id) ?? [],
    keywords,
    runtime: data.runtime,
    tagline: data.tagline,
  };
}

export async function getTrending() {
  const data = await tmdbFetch('/trending/movie/week', { language: 'en-US' });
  if (!data) return [];
  return data.results.slice(0, 8).map(normalizeMovie);
}

export function getPosterUrl(posterPath) {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}${posterPath}`;
}

function normalizeMovie(m) {
  return {
    id: m.id,
    title: m.title,
    year: m.release_date ? new Date(m.release_date).getFullYear() : null,
    overview: m.overview,
    poster_path: m.poster_path,
    backdrop_path: m.backdrop_path,
    genre_ids: m.genre_ids ?? (m.genres?.map(g => g.id) ?? []),
    rating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
    posterUrl: m.poster_path ? `${TMDB_IMAGE_BASE}${m.poster_path}` : null,
  };
}

export { hasApiKey };
