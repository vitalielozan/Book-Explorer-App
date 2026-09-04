import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';

import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import Home from './pages/Home';
import Books from './pages/Books';
import Favorites from './pages/Favorites';
import DiscoverBook from './pages/DiscoverBook';
import BookDetails from './pages/BookDetails';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';

/** A client-side navigation keeps the scroll position; a new page should not. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <div className='shell'>
      <a className='skip-link' href='#main'>
        Skip to the books
      </a>
      <ScrollToTop />
      <SiteHeader />

      <main id='main'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/books' element={<Books />} />
          {/* Both collections share the details page; the prop picks which one. */}
          <Route path='/books/:id' element={<BookDetails collection='books' />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route
            path='/favorites/:id'
            element={<BookDetails collection='favorites' />}
          />
          <Route path='/discover' element={<DiscoverBook />} />
          {/* The page was called add-book before it became a search. */}
          <Route path='/add-book' element={<Navigate to='/discover' replace />} />
          <Route path='/about' element={<About />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}

export default App;
