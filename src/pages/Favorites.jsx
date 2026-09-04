import { useEffect, useState } from 'react';
import { Link } from 'react-router';

import AsyncState from '../components/AsyncState';
import BookCard from '../components/BookCard';
import BookGrid from '../components/BookGrid';
import Button from '../ui/Button';
import Notice from '../ui/Notice';
import PageHeader from '../ui/PageHeader';
import {
  deleteItem,
  describeError,
  isCanceled,
  listItems,
  updateItem,
} from '../api/client';
import { plural } from '../lib/words';

/**
 * Books imported from Open Library. They live in the API's `favorites`
 * collection, which keeps the curated `books` catalog untouched.
 */
function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writeError, setWriteError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchFavorites = async () => {
      try {
        const { items } = await listItems(
          'favorites',
          { _sort: 'title', _order: 'asc' },
          { signal: controller.signal },
        );
        setFavorites(items);
      } catch (err) {
        if (isCanceled(err)) return;
        setError(describeError(err, 'Could not load your shelf.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchFavorites();
    return () => controller.abort();
  }, []);

  const toggleLike = async (book) => {
    const likes = book.likes === 1 ? 0 : 1;

    setBusyId(book.id);
    setWriteError('');
    try {
      await updateItem('favorites', book.id, { likes });
      setFavorites((current) =>
        current.map((item) => (item.id === book.id ? { ...item, likes } : item)),
      );
    } catch (err) {
      setWriteError(describeError(err, 'Could not save the like.'));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (book) => {
    setBusyId(book.id);
    setWriteError('');
    try {
      await deleteItem('favorites', book.id);
      setFavorites((current) => current.filter((item) => item.id !== book.id));
    } catch (err) {
      setWriteError(describeError(err, 'Could not take the book off the shelf.'));
    } finally {
      setBusyId(null);
    }
  };

  const count = `${favorites.length} ${plural(favorites.length, 'book')}`;

  return (
    <div className='page'>
      <PageHeader title='Your shelf' count={loading ? null : count}>
        Everything you kept from Open Library. Removing a book takes it off the
        shelf for good.
      </PageHeader>

      {writeError && (
        <Notice variant='warning' onDismiss={() => setWriteError('')}>
          {writeError}
        </Notice>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={favorites.length === 0}
        emptyText='Your shelf is empty.'
        emptyAction={
          <Button as={Link} to='/discover' variant='primary'>
            Find a book to keep
          </Button>
        }
      >
        <BookGrid>
          {favorites.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              detailsTo={`/favorites/${book.id}`}
              onToggleLike={toggleLike}
              onRemove={remove}
              busy={busyId === book.id}
            />
          ))}
        </BookGrid>
      </AsyncState>
    </div>
  );
}

export default Favorites;
