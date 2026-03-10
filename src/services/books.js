import { GOOGLE_BOOKS_API_KEY } from '../config';
import { GENRE_THEME_MAP, THEME_TO_BOOK_QUERY } from '../data/themeMap';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Build a Google Books query from movie genres and themes/keywords
 */
function buildQuery(movie) {
  const parts = new Set();

  // Add genre-based keywords
  (movie.genre_ids ?? []).forEach(gid => {
    const mapped = GENRE_THEME_MAP[gid];
    if (mapped) mapped.split(' ').slice(0, 2).forEach(w => parts.add(w));
  });

  // Add theme keywords from movie
  (movie.themes ?? movie.keywords ?? []).slice(0, 4).forEach(theme => {
    const mapped = THEME_TO_BOOK_QUERY[theme];
    if (mapped) mapped.split(' ').slice(0, 2).forEach(w => parts.add(w));
    else parts.add(theme);
  });

  // Fallback - use genres directly
  if (parts.size < 3 && movie.genres) {
    movie.genres.slice(0, 2).forEach(g => parts.add(g.toLowerCase()));
  }

  return [...parts].slice(0, 8).join('+');
}

export async function getBookRecommendations(movie) {
  const query = buildQuery(movie);
  if (!query) return getFallbackBooks(movie);

  try {
    const url = new URL(BASE_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '12');
    url.searchParams.set('orderBy', 'relevance');
    url.searchParams.set('langRestrict', 'en');
    url.searchParams.set('printType', 'books');
    if (GOOGLE_BOOKS_API_KEY) url.searchParams.set('key', GOOGLE_BOOKS_API_KEY);

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`Books API error: ${res.status}`);
    const data = await res.json();

    const items = data.items ?? [];
    return items
      .filter(item => item.volumeInfo?.title && item.volumeInfo?.authors)
      .slice(0, 9)
      .map(item => normalizeBook(item, movie));
  } catch (err) {
    console.error('Book fetch failed, using fallback:', err);
    return getFallbackBooks(movie);
  }
}

function normalizeBook(item, movie) {
  const info = item.volumeInfo;
  const cover = info.imageLinks?.thumbnail?.replace('http://', 'https://') ?? null;
  const rating = info.averageRating ?? (3.5 + Math.random() * 1.5).toFixed(1);
  const pageCount = info.pageCount ?? Math.floor(Math.random() * 300) + 200;

  return {
    id: item.id,
    title: info.title,
    author: (info.authors ?? ['Unknown Author']).join(', '),
    cover,
    rating: parseFloat(rating),
    pageCount,
    description: info.description?.slice(0, 200) + (info.description?.length > 200 ? '...' : '') ?? 'A compelling read.',
    categories: info.categories ?? [],
    link: info.infoLink ?? `https://books.google.com/books?id=${item.id}`,
    whyRecommended: generateReason(info, movie),
  };
}

function generateReason(bookInfo, movie) {
  const movieGenre = movie.genres?.[0] ?? movie.genre_ids?.[0] ?? 'this style';
  const bookCat = bookInfo.categories?.[0]?.split(' / ')[0] ?? 'Fiction';
  const reasons = [
    `Similar themes to ${movie.title}`,
    `${bookCat} fans who loved ${movie.title} will enjoy this`,
    `Shares the ${movieGenre} spirit of ${movie.title}`,
    `Recommended for ${movie.title} lovers`,
    `Mirrors the tone of ${movie.title}`,
  ];
  return reasons[Math.floor(Math.random() * reasons.length)];
}

// Curated fallback books when API is unavailable
function getFallbackBooks(movie) {
  const genre = movie.genre_ids?.[0];
  const fallbackSets = {
    878: [ // Sci-Fi
      { id:'f1', title:'Project Hail Mary', author:'Andy Weir', cover:null, rating:4.8, pageCount:476, description:'A lone astronaut wakes up with no memory and must save Earth from a stellar phenomenon.', link:'https://books.google.com/books?q=project+hail+mary', whyRecommended:`Top sci-fi pick for ${movie.title} fans`, categories:['Science Fiction'] },
      { id:'f2', title:'The Three-Body Problem', author:'Liu Cixin', cover:null, rating:4.6, pageCount:400, description:'A secret military project sends signals into space, inviting an alien civilization to Earth.', link:'https://books.google.com/books?q=the+three+body+problem', whyRecommended:'Epic hard sci-fi for space movie lovers', categories:['Science Fiction'] },
      { id:'f3', title:'Ender\'s Game', author:'Orson Scott Card', cover:null, rating:4.5, pageCount:352, description:'A young prodigy is trained to lead Earth\'s defense against an alien invasion.', link:'https://books.google.com/books?q=enders+game', whyRecommended:'Military sci-fi classic', categories:['Science Fiction'] },
    ],
    14: [ // Fantasy
      { id:'f4', title:'The Name of the Wind', author:'Patrick Rothfuss', cover:null, rating:4.7, pageCount:662, description:'The riveting first-person narrative of Kvothe, a legendary figure in a world of magic and mystery.', link:'https://books.google.com/books?q=the+name+of+the+wind', whyRecommended:'Rich fantasy world-building', categories:['Fantasy'] },
      { id:'f5', title:'The Way of Kings', author:'Brandon Sanderson', cover:null, rating:4.8, pageCount:1007, description:'An epic fantasy world devastated by storms, where a mystery begins to unravel.', link:'https://books.google.com/books?q=the+way+of+kings', whyRecommended:'Epic fantasy for adventure lovers', categories:['Fantasy'] },
    ],
    default: [
      { id:'f6', title:'Dark Matter', author:'Blake Crouch', cover:null, rating:4.5, pageCount:342, description:'A physicist is kidnapped and wakes in a world that is not his own.', link:'https://books.google.com/books?q=dark+matter+blake+crouch', whyRecommended:`Recommended for ${movie.title} fans`, categories:['Thriller'] },
      { id:'f7', title:'The Martian', author:'Andy Weir', cover:null, rating:4.7, pageCount:369, description:'An astronaut is left behind on Mars and must survive using science and humor.', link:'https://books.google.com/books?q=the+martian+andy+weir', whyRecommended:'Survival story with heart', categories:['Science Fiction'] },
      { id:'f8', title:'Gone Girl', author:'Gillian Flynn', cover:null, rating:4.1, pageCount:422, description:'On the morning of their fifth anniversary, Nick Dunne\'s wife disappears.', link:'https://books.google.com/books?q=gone+girl+gillian+flynn', whyRecommended:'Gripping psychological thriller', categories:['Thriller'] },
    ],
  };

  return (fallbackSets[genre] ?? fallbackSets.default).map(b => ({
    ...b,
    whyRecommended: b.whyRecommended,
  }));
}
