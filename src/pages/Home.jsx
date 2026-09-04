import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import BookCard from '../components/BookCard';
import Button from '../ui/Button';
import Notice from '../ui/Notice';
import styles from './Home.module.css';
import { describeError, isCanceled, listItems } from '../api/client';
import { spineColor, spineHeight, spineWidth } from '../lib/spine';
import { plural, spell } from '../lib/words';

/** How many saved books the home page shows before sending you to the shelf. */
const RECENT = 4;

function Home() {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };

    const fetchShelf = async () => {
      try {
        const [catalog, saved] = await Promise.all([
          listItems('books', { _sort: 'title', _order: 'asc' }, options),
          listItems('favorites', { _sort: 'id', _order: 'desc' }, options),
        ]);
        setBooks(catalog.items);
        setFavorites(saved.items);
      } catch (err) {
        if (isCanceled(err)) return;
        setError(describeError(err, 'Could not reach the library.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchShelf();
    return () => controller.abort();
  }, []);

  const total = books.length;

  return (
    <>
      <section className={`page ${styles.hero}`}>
        <h1 className={styles.headline}>
          {loading || error
            ? 'A shelf you keep by hand.'
            : `${spell(total)} ${plural(total, 'book')} on the shelf.`}
        </h1>
        <p className={styles.lead}>
          Search a catalog you curated yourself, pull in new titles from Open
          Library, and leave a note on anything you finish.
        </p>
        <div className={styles.actions}>
          <Button as={Link} to='/books' variant='primary'>
            Open the catalog
          </Button>
          <Button as={Link} to='/discover'>
            Find a new book
          </Button>
        </div>

        <div className={styles.shelf}>
          {error ? (
            <Notice variant='danger'>{error}</Notice>
          ) : loading ? (
            <p className={styles.waiting}>Pulling the shelf together.</p>
          ) : (
            <>
              <div className={styles.spines}>
                {books.map((book) => (
                  <Link
                    key={book.id}
                    to={`/books/${book.id}`}
                    className={styles.spine}
                    title={`${book.title} — ${book.author}`}
                    style={{
                      '--cloth': spineColor(book.title),
                      width: `${spineWidth(book.title, 22, 52)}px`,
                      height: `${62 + spineHeight(book.title) * 38}%`,
                    }}
                  >
                    <span className={styles.spineTitle}>{book.title}</span>
                  </Link>
                ))}
              </div>
              <div className={styles.board} />
              <p className={styles.shelfCaption}>
                Each band is a book in the catalog. Pick one to open it.
              </p>
            </>
          )}
        </div>
      </section>

      <section className={`page ${styles.section}`}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Saved from Open Library</h2>
          {favorites.length > 0 && (
            <Link to='/favorites' className={styles.sectionLink}>
              See your whole shelf
            </Link>
          )}
        </div>

        {favorites.length > 0 ? (
          <div className={styles.recent}>
            {favorites.slice(0, RECENT).map((book) => (
              <BookCard
                key={book.id}
                book={book}
                detailsTo={`/favorites/${book.id}`}
              />
            ))}
          </div>
        ) : (
          <p className={styles.invite}>
            {loading
              ? 'Checking what you have saved.'
              : 'Nothing saved yet. Search Open Library and anything you keep lands here.'}
          </p>
        )}
      </section>
    </>
  );
}

export default Home;
