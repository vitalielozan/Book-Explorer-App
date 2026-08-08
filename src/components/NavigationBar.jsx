import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar bg='light' expand='lg' sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/books'>
              My Books
            </Nav.Link>
            <Nav.Link as={Link} to='/add-book'>
              Discover Books
            </Nav.Link>
            <Nav.Link as={Link} to='/about'>
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
