import { useEffect, useState } from 'react';
import { Alert, Col, Container, Row } from 'react-bootstrap';

import AsyncState from '../components/AsyncState';
import BookCard from '../components/BookCard';
import {
  deleteItem,
  describeError,
  isCanceled,
  listItems,
  updateItem,
} from '../api/client';

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
        setError(describeError(err, 'Could not load your favorites.'));
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
      setWriteError(describeError(err, 'Could not remove the book.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Container className='mt-5'>
      <h1 className='text-center fs-1 mb-2'>Favorites</h1>
      <p className='text-center fs-4 text-muted mb-4'>
        Books you saved from Open Library
      </p>

      {writeError && (
        <Alert variant='warning' dismissible onClose={() => setWriteError('')}>
          {writeError}
        </Alert>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={favorites.length === 0}
        emptyText='No favorites yet. Head to Discover Books to save one.'
      >
        <Row>
          {favorites.map((book) => (
            <Col md={4} className='d-flex align-items-stretch mb-4' key={book.id}>
              <BookCard
                book={book}
                detailsTo={`/favorites/${book.id}`}
                onToggleLike={toggleLike}
                onRemove={remove}
                busy={busyId === book.id}
              />
            </Col>
          ))}
        </Row>
      </AsyncState>
    </Container>
  );
}

export default Favorites;
