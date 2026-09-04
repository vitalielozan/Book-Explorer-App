import { useEffect, useState } from 'react';
import axios from 'axios';

import AsyncState from '../components/AsyncState';
import BookGrid from '../components/BookGrid';
import Cover from '../components/Cover';
import Button from '../ui/Button';
import Notice from '../ui/Notice';
import PageHeader from '../ui/PageHeader';
import Toolbar, { ToolbarSearch } from '../ui/Toolbar';
import { SearchField } from '../ui/Field';
import styles from './DiscoverBook.module.css';
import { createItem, describeError, isCanceled, listItems } from '../api/client';
import { spineColor } from '../lib/spine';
import { CheckIcon } from '../ui/icons';

const OPEN_LIBRARY = 'https://openlibrary.org/search.json';

/** Asking for named fields keeps the response small; the default is enormous. */
const FIELDS = 'key,title,author_name,cover_i,first_sentence,first_publish_year';

const SUBJECTS = [
  { query: 'javascript', label: 'JavaScript' },
  { query: 'react', label: 'React' },
  { query: 'history', label: 'History' },
  { query: 'fantasy', label: 'Fantasy' },
  { query: 'romance', label: 'Romance' },
  { query: 'science', label: 'Science' },
  { query: 'business', label: 'Business' },
];

const coverUrl = (coverId) =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : '';

const firstSentence = (value) => {
  if (!value) return '';
  return Array.isArray(value) ? value.join(' ') : value;
};

/** Maps an Open Library result onto the shape the API's collections use. */
function toFavorite(doc) {
  return {
    // Open Library's work key is stable, which makes it a better duplicate
    // check than comparing titles and author strings.
    sourceKey: doc.key,
    title: doc.title || 'No title',
    author: doc.author_name?.join(', ') || 'Unknown author',
    shortDesc: doc.first_publish_year
      ? `First published in ${doc.first_publish_year}`
      : 'Imported from Open Library',
    description:
      firstSentence(doc.first_sentence) || 'No description available.',
    image: coverUrl(doc.cover_i),
    likes: 0,
    comments: [],
  };
}

function DiscoverBook() {
  const [search, setSearch] = useState('javascript');
  const [query, setQuery] = useState('javascript');

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [savedKeys, setSavedKeys] = useState(new Set());
  const [notice, setNotice] = useState(null);
  const [savingKey, setSavingKey] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Which books are already saved, so the button can say so instead of the API
  // rejecting a duplicate after the click.
  useEffect(() => {
    const controller = new AbortController();

    listItems('favorites', undefined, { signal: controller.signal })
      .then(({ items }) => {
        setSavedKeys(new Set(items.map((item) => item.sourceKey).filter(Boolean)));
      })
      .catch((err) => {
        if (!isCanceled(err)) {
          setNotice({ variant: 'warning', text: describeError(err) });
        }
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const searchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(OPEN_LIBRARY, {
          params: { q: query, limit: 12, fields: FIELDS },
          signal: controller.signal,
        });
        setResults(response.data.docs ?? []);
      } catch (err) {
        if (isCanceled(err)) return;
        setError('Open Library did not answer. Try the search again in a moment.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    searchBooks();
    return () => controller.abort();
  }, [query]);

  const save = async (doc) => {
    setSavingKey(doc.key);
    setNotice(null);
    try {
      await createItem('favorites', toFavorite(doc));
      setSavedKeys((current) => new Set(current).add(doc.key));
      setNotice({ variant: 'success', text: `${doc.title} is on your shelf.` });
    } catch (err) {
      setNotice({
        variant: 'danger',
        text: describeError(err, 'Could not put the book on your shelf.'),
      });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className='page'>
      <PageHeader
        title='Discover'
        count={loading || error ? null : `${results.length} results`}
      >
        Search the whole of Open Library. Anything you keep is copied onto your
        own shelf, so the catalog stays exactly as you curated it.
      </PageHeader>

      <Toolbar>
        <ToolbarSearch>
          <SearchField
            label='Search Open Library'
            placeholder='Search by title, author or subject'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </ToolbarSearch>
      </Toolbar>

      <div className={styles.subjects}>
        {SUBJECTS.map(({ query: subject, label }) => (
          <Button
            key={subject}
            size='sm'
            variant={query === subject ? 'primary' : 'secondary'}
            onClick={() => setSearch(subject)}
            aria-pressed={query === subject}
          >
            {label}
          </Button>
        ))}
      </div>

      {notice && (
        <Notice variant={notice.variant} onDismiss={() => setNotice(null)}>
          {notice.text}
        </Notice>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={results.length === 0}
        emptyText={
          query
            ? `Open Library has nothing for “${query}”.`
            : 'Type a title, an author or a subject to start.'
        }
      >
        <BookGrid>
          {results.map((doc) => {
            const author = doc.author_name?.join(', ') || 'Unknown author';
            const alreadySaved = savedKeys.has(doc.key);

            return (
              <article
                key={doc.key}
                className={styles.card}
                style={{ '--cloth': spineColor(doc.title || '') }}
              >
                <Cover
                  src={coverUrl(doc.cover_i)}
                  title={doc.title}
                  author={author}
                />
                <div className={styles.body}>
                  <h3 className={styles.title}>{doc.title}</h3>
                  <p className={styles.author}>{author}</p>
                  {doc.first_publish_year && (
                    <span className={styles.year}>{doc.first_publish_year}</span>
                  )}

                  <div className={styles.save}>
                    {alreadySaved ? (
                      <p className={styles.saved}>
                        <CheckIcon width={16} height={16} />
                        On your shelf
                      </p>
                    ) : (
                      <Button
                        variant='primary'
                        block
                        disabled={savingKey === doc.key}
                        onClick={() => save(doc)}
                      >
                        {savingKey === doc.key ? 'Saving' : 'Keep this book'}
                      </Button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </BookGrid>
      </AsyncState>
    </div>
  );
}

export default DiscoverBook;
