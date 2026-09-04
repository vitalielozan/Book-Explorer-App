import { Route, Routes } from 'react-router-dom';

import NavigationBar from './components/NavigationBar';
import Home from './pages/Home';
import Books from './pages/Books';
import Favorites from './pages/Favorites';
import DiscoverBook from './pages/DiscoverBook';
import BookDetails from './pages/BookDetails';
import About from './pages/About';
import ErrorPage from './pages/ErrorPage';

function App() {
  return (
    <>
      <NavigationBar />
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
        <Route path='/add-book' element={<DiscoverBook />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<ErrorPage />} />
      </Routes>
    </>
  );
}

export default App;
