import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
const BASE_URL = '/api';

function Books() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/books`);
        setBooks(response.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, []);

  const toogleLike = (book) => {
    const updatedLike = book.likes === 1 ? 0 : 1;
    axios
      .patch(`${BASE_URL}/books/${book.id}`, { likes: updatedLike })
      .then(() => {
        setBooks(
          books.map((b) =>
            b.id === book.id ? { ...b, likes: updatedLike } : b,
          ),
        );
      })
      .catch((error) => {
        console.error('Error updating like status:', error);
      });
  };

  return (
    <>
      <Container className='mt-5'>
        <h1 className='text-center fs-1 mb-4'>My Books</h1>
        <p className='text-center fs-3 mb-4'>Explore my collection of books</p>
        <Row>
          {books.map((book) => (
            <Col
              md={4}
              className='d-flex align-items-stretch mb-4'
              key={book.id}
            >
              <Card style={{ width: '18rem' }} className='w-100'>
                {book.image && (
                  <Card.Img
                    variant='top'
                    src={book.image}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                )}
                <Card.Body className='d-flex flex-column'>
                  <div className='d-flex justify-content-between align-items-center mb-2'>
                    <Card.Title>{book.title}</Card.Title>
                    <Button
                      variant='link'
                      onClick={() => toogleLike(book)}
                      className='p-0'
                    >
                      {book.likes === 1 ? (
                        <FaHeart color='red' size={24} />
                      ) : (
                        <FaRegHeart color='grey' size={24} />
                      )}
                    </Button>
                  </div>
                  <Card.Subtitle className='mb-2 text-muted'>
                    {book.author}
                  </Card.Subtitle>

                  <Card.Text className='flex-grow-1'>
                    {book.shortDesc}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/books/${book.id}`}
                    variant='primary'
                    className='mt-auto'
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Books;
