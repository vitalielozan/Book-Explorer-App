import { Card, Container, ListGroup } from 'react-bootstrap';
import { FaBookOpen, FaCode, FaGithub, FaServer } from 'react-icons/fa';

function About() {
  return (
    <Container className='d-flex justify-content-center mt-5 mb-5'>
      <Card style={{ maxWidth: '800px' }} className='w-100 shadow-sm p-3'>
        <Card.Body>
          <Card.Title className='text-center mb-4'>
            <FaBookOpen className='me-2' />
            About Book Explorer
          </Card.Title>

          <Card.Text>
            <strong>Book Explorer</strong> is a React application for browsing a
            book catalog and saving discoveries from the{' '}
            <a
              href='https://openlibrary.org/developers/api'
              target='_blank'
              rel='noopener noreferrer'
            >
              Open Library API
            </a>
            .
          </Card.Text>

          <Card.Text>
            <FaServer className='me-2' />
            The catalog, likes and comments are served by{' '}
            <a
              href='https://github.com/vitalielozan/My-Json-Server'
              target='_blank'
              rel='noopener noreferrer'
            >
              My JSON Server
            </a>
            , a small multi-project REST API built on json-server and hosted on
            Render. This app uses two of its collections:{' '}
            <code>books</code> for the curated catalog and{' '}
            <code>favorites</code> for imported books. Reads are public; writes
            are authenticated with a key that stays on the server side.
          </Card.Text>

          <hr />

          <h5 className='mt-4 mb-3'>
            <FaCode className='me-2' />
            Technologies used
          </h5>
          <ListGroup variant='flush' className='mb-3'>
            <ListGroup.Item>React &amp; Vite</ListGroup.Item>
            <ListGroup.Item>React Router</ListGroup.Item>
            <ListGroup.Item>React Bootstrap</ListGroup.Item>
            <ListGroup.Item>Axios</ListGroup.Item>
            <ListGroup.Item>My JSON Server (Express + json-server)</ListGroup.Item>
            <ListGroup.Item>Open Library API</ListGroup.Item>
          </ListGroup>

          <p className='mb-0'>
            Developed as a learning project by <strong>Vitalie Lozan</strong>.
            You can find the code on{' '}
            <a
              href='https://github.com/vitalielozan/Book-Explorer-App-ReactJS'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaGithub className='me-1' />
              GitHub
            </a>
            .
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default About;
