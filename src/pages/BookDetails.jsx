import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Button,
  Card,
  Container,
  Form,
  ListGroup,
  Spinner,
} from 'react-bootstrap';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import ErrorPage from './ErrorPage';
import { describeError, getItem, isCanceled, updateItem } from '../api/client';

/**
 * Details for one record. The same page serves both collections, so `collection`
 * decides which one the id is looked up in.
 */
function BookDetails({ collection = 'books' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBook = async () => {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        setBook(await getItem(collection, id, { signal: controller.signal }));
      } catch (err) {
        if (isCanceled(err)) return;
        // A missing record is a routing outcome, not an API failure to report.
        if (err?.response?.status === 404) setNotFound(true);
        else setError(describeError(err, 'Could not load this book.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchBook();
    return () => controller.abort();
  }, [collection, id]);

  const toggleLike = async () => {
    const likes = book.likes === 1 ? 0 : 1;

    setSaving(true);
    setError('');
    try {
      await updateItem(collection, id, { likes });
      setBook((current) => ({ ...current, likes }));
    } catch (err) {
      setError(describeError(err, 'Could not save the like.'));
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async (event) => {
    event.preventDefault();

    const comment = newComment.trim();
    if (!comment) return;

    // The API stores comments as a plain array, so the whole array is sent back.
    const comments = [...(book.comments ?? []), comment];

    setSaving(true);
    setError('');
    try {
      await updateItem(collection, id, { comments });
      setBook((current) => ({ ...current, comments }));
      setNewComment('');
    } catch (err) {
      setError(describeError(err, 'Could not add the comment.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Container className='text-center mt-5'>
        <Spinner animation='border' variant='primary' />
        <p className='mt-3'>Loading...</p>
      </Container>
    );
  }

  if (notFound || !book) {
    return <ErrorPage />;
  }

  const liked = book.likes === 1;

  return (
    <Container className='mt-5 mb-5'>
      <Card className='text-center'>
        {book.image && (
          <Card.Img
            variant='top'
            src={book.image}
            alt={`Cover of ${book.title}`}
            style={{ height: '300px', objectFit: 'contain' }}
            className='mt-3'
          />
        )}
        <Card.Body>
          <Card.Title className='fs-1'>{book.title}</Card.Title>
          <Card.Subtitle className='mb-3 text-muted fs-5'>
            {book.author}
          </Card.Subtitle>
          <Card.Text className='fs-5'>{book.description}</Card.Text>

          <Button
            variant='link'
            onClick={toggleLike}
            disabled={saving}
            aria-pressed={liked}
            className='mb-3'
          >
            {liked ? (
              <FaHeart color='red' size={28} />
            ) : (
              <FaRegHeart color='grey' size={28} />
            )}
          </Button>

          {error && (
            <Alert variant='warning' dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <hr />

          <h5 className='mb-3'>Comments</h5>
          {book.comments?.length > 0 ? (
            <ListGroup className='mb-3'>
              {book.comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p className='text-muted'>No comments yet.</p>
          )}

          <Form onSubmit={handleAddComment} className='mb-3'>
            <Form.Group controlId='comment' className='mb-3'>
              <Form.Control
                type='text'
                placeholder='Write your comment...'
                value={newComment}
                onChange={(event) => setNewComment(event.target.value)}
                disabled={saving}
              />
            </Form.Group>
            <Button
              variant='primary'
              type='submit'
              disabled={saving || !newComment.trim()}
            >
              {saving ? 'Saving...' : 'Add Comment'}
            </Button>
          </Form>

          <Button variant='outline-secondary' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookDetails;
