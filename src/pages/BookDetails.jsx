import React from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Button,
  Spinner,
  Form,
  ListGroup,
} from 'react-bootstrap';
import ErrorPage from './ErrorPage';
const BASE_URL = '/api';

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment) return;

    try {
      const updatedComments = [...(book.comments || []), newComment];
      await axios.patch(`${BASE_URL}/books/${id}`, {
        comments: updatedComments,
      });

      setBook({ ...book, comments: updatedComments });
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
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

  if (!book) {
    return <ErrorPage />;
  }

  return (
    <Container className='mt-5'>
      <Card className='text-center'>
        {book.coverImage && (
          <Card.Img
            variant='top'
            src={book.image}
            style={{ height: '300px', objectFit: 'cover' }}
          />
        )}
        <Card.Body>
          <Card.Title className='fs-1'>{book.title}</Card.Title>
          <Card.Text className='fs-4'>{book.description}</Card.Text>

          <hr />

          <h5 className='mb-3'>Comments</h5>
          {book.comments && book.comments.length > 0 ? (
            <ListGroup className='mb-3'>
              {book.comments.map((comment, index) => (
                <ListGroup.Item key={index}>{comment}</ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <p>No comments yet.</p>
          )}
          <Form onSubmit={handleAddComment} className='mb-3'>
            <Form.Group controlId='comment' className='mb-3'>
              <Form.Control
                type='text'
                placeholder='write your comment...'
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Add Comment
            </Button>
          </Form>
          <Button variant='primary' onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default BookDetails;
