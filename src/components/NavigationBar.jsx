import { Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';

function NavigationBar() {
  return (
    <Navbar bg='light' expand='lg' sticky='top'>
      <Container>
        <Navbar.Brand as={Link} to='/'>
          Book Explorer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          {/* NavLink so the current section is marked active by the router. */}
          <Nav className='me-auto'>
            <Nav.Link as={NavLink} to='/books'>
              My Books
            </Nav.Link>
            <Nav.Link as={NavLink} to='/favorites'>
              Favorites
            </Nav.Link>
            <Nav.Link as={NavLink} to='/add-book'>
              Discover Books
            </Nav.Link>
            <Nav.Link as={NavLink} to='/about'>
              About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
