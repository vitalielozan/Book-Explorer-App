import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
} from 'react-bootstrap';
const BASE_URL = '/api';

function DiscoverBook() {
  const [query, setQuery] = useState('javascript');
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const genres = [
    'javascript',
    'react',
    'history',
    'fantasy',
    'romance',
    'science',
    'business',
  ];

  const fetchSavedBooks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/books`);
      setSavedBooks(response.data);
    } catch (error) {
      console.error('Error fetching saved books', error);
    }
  };

  useEffect(() => {
    const searchBooks = async () => {
      setLoading(true);
      setTimeout(async () => {
        try {
          const response = await axios.get(
            `https://openlibrary.org/search.json?q=${query}`,
          );
          setBooks(response.data.docs.slice(0, 12));
        } catch (error) {
          console.error('Error fetching external books', error);
        } finally {
          setLoading(false);
        }
      }, 500);
    };

    fetchSavedBooks();
    searchBooks();
  }, [query]);

  const saveBook = async (book) => {
    const alreadySaved = savedBooks.some(
      (saved) =>
        saved.title === book.title &&
        saved.author.includes(book.author_name ? book.author_name[0] : ''),
    );

    if (alreadySaved) {
      alert('This book is already saved');
      return;
    }
    const newBook = {
      title: book.title || 'No Title',
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      shortDesc: book.ia_collection_s || 'Imported from Open Library',
      description: book.first_sentence
        ? typeof book.first_sentence === 'string'
          ? book.first_sentence
          : book.first_sentence.join(' ')
        : 'No description available',
      image: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
        : '',
      likes: 0,
      comments: [],
    };

    try {
      await axios.post(`${BASE_URL}/books`, newBook);
      alert('Book saved successfully!');
      fetchSavedBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      alert('Failed to save the book');
    }
  };

  return (
    <Container className='mt-5'>
      <h2 className='text-center mb-4'>Discover Books</h2>

      <Form className='mb-4'>
        <Form.Group className='d-flex'>
          <Form.Select
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='me-2'
          >
            {genres.map((genre, index) => (
              <option key={index} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Form>

      {loading ? (
        <div className='text-center'>
          <Spinner animation='border' variant='primary' />
        </div>
      ) : (
        <Row>
          {books.map((book, index) => (
            <Col key={index} md={4} className='d-flex align-items-stretch mb-4'>
              <Card className='w-100'>
                {book.cover_i && (
                  <Card.Img
                    variant='top'
                    src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className='d-flex flex-column'>
                  <Card.Title>{book.title}</Card.Title>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {book.author_name
                      ? book.author_name.join(', ')
                      : 'Unknown Author'}
                  </Card.Subtitle>
                  <Button
                    variant='success'
                    className='mt-auto'
                    onClick={() => saveBook(book)}
                  >
                    Save this Book
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default DiscoverBook;
