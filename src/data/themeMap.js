// Maps TMDB genre IDs to book search query keywords
export const GENRE_THEME_MAP = {
  28:    'action thriller adventure',          // Action
  12:    'epic adventure quest journey',        // Adventure
  16:    'animated fantasy magical',            // Animation
  35:    'humor comedy witty satire',           // Comedy
  80:    'crime detective mystery murder',      // Crime
  99:    'nonfiction history biography',        // Documentary
  18:    'literary fiction emotional drama',    // Drama
  10751: 'family children heartwarming',       // Family
  14:    'fantasy magic epic world building',   // Fantasy
  36:    'history war biography nonfiction',    // History
  27:    'horror dark psychological thriller',  // Horror
  10402: 'music biography arts culture',        // Music
  9648:  'mystery detective suspense puzzle',   // Mystery
  10749: 'romance love relationships',          // Romance
  878:   'science fiction space technology future', // Sci-Fi
  10770: 'television drama series',             // TV Movie
  53:    'psychological thriller suspense dark', // Thriller
  10752: 'war military history strategy',       // War
  37:    'western frontier america adventure',  // Western
};

// Maps theme keywords from movie metadata to refined book queries
export const THEME_TO_BOOK_QUERY = {
  space:          'space exploration astronomy science',
  survival:       'survival wilderness adventure extreme',
  science:        'popular science physics evolution',
  dreams:         'consciousness psychology surrealism',
  reality:        'philosophy existentialism identity',
  heist:          'heist crime caper thriller',
  psychology:     'psychology mind behavior human',
  crime:          'crime mystery detective noir',
  war:            'war military history memoir',
  love:           'romance love relationships literary fiction',
  magic:          'magic fantasy world building',
  quest:          'epic fantasy quest adventure',
  politics:       'political thriller power intrigue',
  'chosen one':   'chosen hero destiny fantasy',
  espionage:      'spy thriller espionage intelligence',
  time:           'time travel science fiction',
  comedy:         'humor satire witty',
  mystery:        'mystery detective whodunit',
  horror:         'horror dark psychological',
  biography:      'biography memoir autobiography nonfiction',
};
