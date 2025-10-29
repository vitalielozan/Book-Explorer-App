import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Books from './pages/Books';
import DiscoverBook from './pages/DiscoverBook';
import BookDetails from './pages/BookDetails';
import About from './pages/About';
import ErroPage from './pages/ErrorPage';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <>
      <NavigationBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/books' element={<Books />} />
        <Route path='/books/:id' element={<BookDetails />} />
        <Route path='/add-book' element={<DiscoverBook />} />
        <Route path='/about' element={<About />} />
        <Route path='*' element={<ErroPage />} />
      </Routes>
    </>
  );
}

export default App;
