import { useEffect, useState } from 'react';
import { Alert, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

import AsyncState from '../components/AsyncState';
import BookCard from '../components/BookCard';
import { describeError, isCanceled, listItems, updateItem } from '../api/client';

/** Searching and sorting are done by the API, not in the browser. */
const SORTS = {
  title: { label: 'Title (A-Z)', params: { _sort: 'title', _order: 'asc' } },
  author: { label: 'Author (A-Z)', params: { _sort: 'author', _order: 'asc' } },
  likes: { label: 'Most liked', params: { _sort: 'likes', _order: 'desc' } },
};

function Books() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('title');

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writeError, setWriteError] = useState('');
  const [busyId, setBusyId] = useState(null);

  // Typing should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { ...SORTS[sort].params };
        if (query) params.q = query;

        const { items, total } = await listItems('books', params, {
          signal: controller.signal,
        });
        setBooks(items);
        setTotal(total);
      } catch (err) {
        if (isCanceled(err)) return;
        setError(describeError(err, 'Could not load the books.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchBooks();
    return () => controller.abort();
  }, [query, sort]);

  const toggleLike = async (book) => {
    const likes = book.likes === 1 ? 0 : 1;

    setBusyId(book.id);
    setWriteError('');
    try {
      await updateItem('books', book.id, { likes });
      setBooks((current) =>
        current.map((item) => (item.id === book.id ? { ...item, likes } : item)),
      );
    } catch (err) {
      setWriteError(describeError(err, 'Could not save the like.'));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <Container className='mt-5'>
      <h1 className='text-center fs-1 mb-2'>My Books</h1>
      <p className='text-center fs-4 text-muted mb-4'>
        {total} {total === 1 ? 'book' : 'books'} in the catalog
      </p>

      <Row className='mb-4 g-2'>
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type='search'
              placeholder='Search by title, author or description...'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label='Search books'
            />
          </InputGroup>
        </Col>
        <Col md={4}>
          <Form.Select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
            aria-label='Sort books'
          >
            {Object.entries(SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {writeError && (
        <Alert variant='warning' dismissible onClose={() => setWriteError('')}>
          {writeError}
        </Alert>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={books.length === 0}
        emptyText={query ? 'No book matches that search.' : 'The catalog is empty.'}
      >
        <Row>
          {books.map((book) => (
            <Col md={4} className='d-flex align-items-stretch mb-4' key={book.id}>
              <BookCard
                book={book}
                detailsTo={`/books/${book.id}`}
                onToggleLike={toggleLike}
                busy={busyId === book.id}
              />
            </Col>
          ))}
        </Row>
      </AsyncState>
    </Container>
  );
}

export default Books;
