import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from 'react-bootstrap';
import { FaCheck, FaSearch } from 'react-icons/fa';

import AsyncState from '../components/AsyncState';
import { createItem, describeError, isCanceled, listItems } from '../api/client';

const OPEN_LIBRARY = 'https://openlibrary.org/search.json';

/** Asking for named fields keeps the response small; the default is enormous. */
const FIELDS = 'key,title,author_name,cover_i,first_sentence,first_publish_year';

const GENRES = [
  'javascript',
  'react',
  'history',
  'fantasy',
  'romance',
  'science',
  'business',
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
        if (!isCanceled(err)) setNotice({ variant: 'warning', text: describeError(err) });
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
        setError('Could not reach Open Library. Try again in a moment.');
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
      setNotice({ variant: 'success', text: `Saved "${doc.title}" to your favorites.` });
    } catch (err) {
      setNotice({
        variant: 'danger',
        text: describeError(err, 'Could not save the book.'),
      });
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <Container className='mt-5'>
      <h2 className='text-center mb-2'>Discover Books</h2>
      <p className='text-center text-muted mb-4'>
        Search Open Library and save what you like to your favorites
      </p>

      <Form className='mb-3' onSubmit={(event) => event.preventDefault()}>
        <InputGroup>
          <InputGroup.Text>
            <FaSearch />
          </InputGroup.Text>
          <Form.Control
            type='search'
            placeholder='Search by title, author or subject...'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label='Search Open Library'
          />
        </InputGroup>
      </Form>

      <div className='d-flex flex-wrap gap-2 mb-4'>
        {GENRES.map((genre) => (
          <Button
            key={genre}
            size='sm'
            variant={query === genre ? 'primary' : 'outline-primary'}
            onClick={() => setSearch(genre)}
          >
            {genre.charAt(0).toUpperCase() + genre.slice(1)}
          </Button>
        ))}
      </div>

      {notice && (
        <Alert variant={notice.variant} dismissible onClose={() => setNotice(null)}>
          {notice.text}
        </Alert>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={results.length === 0}
        emptyText='No results. Try another search.'
      >
        <Row>
          {results.map((doc) => {
            const alreadySaved = savedKeys.has(doc.key);

            return (
              <Col key={doc.key} md={4} className='d-flex align-items-stretch mb-4'>
                <Card className='w-100'>
                  {doc.cover_i && (
                    <Card.Img
                      variant='top'
                      src={coverUrl(doc.cover_i)}
                      alt={`Cover of ${doc.title}`}
                      style={{ height: '250px', objectFit: 'cover' }}
                    />
                  )}
                  <Card.Body className='d-flex flex-column'>
                    <Card.Title>{doc.title}</Card.Title>
                    <Card.Subtitle className='mb-2 text-muted'>
                      {doc.author_name?.join(', ') || 'Unknown author'}
                    </Card.Subtitle>
                    {doc.first_publish_year && (
                      <Badge bg='light' text='dark' className='align-self-start mb-2'>
                        {doc.first_publish_year}
                      </Badge>
                    )}
                    <Button
                      variant={alreadySaved ? 'outline-success' : 'success'}
                      className='mt-auto'
                      disabled={alreadySaved || savingKey === doc.key}
                      onClick={() => save(doc)}
                    >
                      {alreadySaved ? (
                        <>
                          <FaCheck className='me-2' />
                          Saved
                        </>
                      ) : savingKey === doc.key ? (
                        'Saving...'
                      ) : (
                        'Save this Book'
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </AsyncState>
    </Container>
  );
}

export default DiscoverBook;
