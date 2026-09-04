import { useEffect, useState } from 'react';

import AsyncState from '../components/AsyncState';
import BookCard from '../components/BookCard';
import BookGrid from '../components/BookGrid';
import Button from '../ui/Button';
import Notice from '../ui/Notice';
import PageHeader from '../ui/PageHeader';
import Toolbar, { ToolbarControl, ToolbarSearch } from '../ui/Toolbar';
import { SearchField, SelectField } from '../ui/Field';
import { describeError, isCanceled, listItems, updateItem } from '../api/client';
import { plural } from '../lib/words';

/** Searching and sorting are done by the API, not in the browser. */
const SORTS = {
  title: { label: 'By title', params: { _sort: 'title', _order: 'asc' } },
  author: { label: 'By author', params: { _sort: 'author', _order: 'asc' } },
  likes: { label: 'Liked first', params: { _sort: 'likes', _order: 'desc' } },
};

function Books() {
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('title');

  const [books, setBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [writeError, setWriteError] = useState('');
  const [busyId, setBusyId] = useState(null);

  // Typing should not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const params = { ...SORTS[sort].params };
        if (query) params.q = query;

        const { items, total } = await listItems('books', params, {
          signal: controller.signal,
        });
        setBooks(items);
        setTotal(total);
      } catch (err) {
        if (isCanceled(err)) return;
        setError(describeError(err, 'Could not load the catalog.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchBooks();
    return () => controller.abort();
  }, [query, sort]);

  const toggleLike = async (book) => {
    const likes = book.likes === 1 ? 0 : 1;

    setBusyId(book.id);
    setWriteError('');
    try {
      await updateItem('books', book.id, { likes });
      setBooks((current) =>
        current.map((item) => (item.id === book.id ? { ...item, likes } : item)),
      );
    } catch (err) {
      setWriteError(describeError(err, 'Could not save the like.'));
    } finally {
      setBusyId(null);
    }
  };

  // While a search is on, the header says how much of the catalog is showing.
  const count = query
    ? `${books.length} of ${total} ${plural(total, 'book')}`
    : `${total} ${plural(total, 'book')}`;

  return (
    <div className='page'>
      <PageHeader title='Catalog' count={loading ? null : count}>
        The books kept in the library itself. Search runs on the server, across
        titles, authors and descriptions.
      </PageHeader>

      <Toolbar>
        <ToolbarSearch>
          <SearchField
            label='Search the catalog'
            placeholder='Search by title, author or description'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </ToolbarSearch>
        <ToolbarControl>
          <SelectField
            label='Order the catalog'
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            {Object.entries(SORTS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </SelectField>
        </ToolbarControl>
      </Toolbar>

      {writeError && (
        <Notice variant='warning' onDismiss={() => setWriteError('')}>
          {writeError}
        </Notice>
      )}

      <AsyncState
        loading={loading}
        error={error}
        isEmpty={books.length === 0}
        emptyText={
          query
            ? `Nothing in the catalog matches “${query}”.`
            : 'The catalog is empty.'
        }
        emptyAction={
          query && (
            <Button onClick={() => setSearch('')}>Clear the search</Button>
          )
        }
      >
        <BookGrid>
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              detailsTo={`/books/${book.id}`}
              onToggleLike={toggleLike}
              busy={busyId === book.id}
            />
          ))}
        </BookGrid>
      </AsyncState>
    </div>
  );
}

export default Books;
