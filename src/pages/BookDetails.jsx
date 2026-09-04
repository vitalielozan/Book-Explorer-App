import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import AsyncState from '../components/AsyncState';
import Cover from '../components/Cover';
import ErrorPage from './ErrorPage';
import Button from '../ui/Button';
import Notice from '../ui/Notice';
import styles from './BookDetails.module.css';
import { TextField } from '../ui/Field';
import { describeError, getItem, isCanceled, updateItem } from '../api/client';
import { spineColor } from '../lib/spine';
import { ArrowLeftIcon, HeartIcon } from '../ui/icons';

/**
 * Details for one record. The same page serves both collections, so `collection`
 * decides which one the id is looked up in.
 */
function BookDetails({ collection = 'books' }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState('');
  // A failed write keeps the page; only a failed load replaces it.
  const [writeError, setWriteError] = useState('');
  const [newNote, setNewNote] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchBook = async () => {
      setLoading(true);
      setError('');
      setNotFound(false);
      try {
        setBook(await getItem(collection, id, { signal: controller.signal }));
      } catch (err) {
        if (isCanceled(err)) return;
        // A missing record is a routing outcome, not an API failure to report.
        if (err?.response?.status === 404) setNotFound(true);
        else setError(describeError(err, 'Could not load this book.'));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchBook();
    return () => controller.abort();
  }, [collection, id]);

  const toggleLike = async () => {
    const likes = book.likes === 1 ? 0 : 1;

    setSaving(true);
    setWriteError('');
    try {
      await updateItem(collection, id, { likes });
      setBook((current) => ({ ...current, likes }));
    } catch (err) {
      setWriteError(describeError(err, 'Could not save the like.'));
    } finally {
      setSaving(false);
    }
  };

  const addNote = async (event) => {
    event.preventDefault();

    const note = newNote.trim();
    if (!note) return;

    // The API stores comments as a plain array, so the whole array is sent back.
    const comments = [...(book.comments ?? []), note];

    setSaving(true);
    setWriteError('');
    try {
      await updateItem(collection, id, { comments });
      setBook((current) => ({ ...current, comments }));
      setNewNote('');
    } catch (err) {
      setWriteError(describeError(err, 'Could not add the note.'));
    } finally {
      setSaving(false);
    }
  };

  if (notFound) return <ErrorPage />;

  const liked = book?.likes === 1;
  const notes = book?.comments ?? [];

  return (
    <div className='page'>
      <button type='button' className={styles.back} onClick={() => navigate(-1)}>
        <ArrowLeftIcon width={16} height={16} />
        Back
      </button>

      <AsyncState loading={loading} error={error} isEmpty={false}>
        {book && (
          <article
            className={styles.layout}
            style={{ '--cloth': spineColor(book.title) }}
          >
            <div className={styles.aside}>
              <div className={styles.coverFrame}>
                <Cover
                  src={book.image}
                  title={book.title}
                  author={book.author}
                  tall
                />
              </div>
              <button
                type='button'
                className={`${styles.like} ${liked ? styles.liked : ''}`}
                onClick={toggleLike}
                disabled={saving}
                aria-pressed={liked}
              >
                <HeartIcon filled={liked} width={18} height={18} />
                {liked ? 'Liked' : 'Like this book'}
              </button>
            </div>

            <div>
              <h1 className={styles.title}>{book.title}</h1>
              <p className={styles.author}>{book.author}</p>
              <div className={styles.rule} />
              <p className={styles.description}>{book.description}</p>

              <section className={styles.notes}>
                <div className={styles.notesHead}>
                  <h2 className={styles.notesTitle}>Your notes</h2>
                  {notes.length > 0 && (
                    <span className={styles.notesCount}>
                      {notes.length} so far
                    </span>
                  )}
                </div>

                {writeError && (
                  <div className={styles.notice}>
                    <Notice variant='warning' onDismiss={() => setWriteError('')}>
                      {writeError}
                    </Notice>
                  </div>
                )}

                {notes.length > 0 ? (
                  <ul className={styles.noteList}>
                    {notes.map((note, index) => (
                      <li key={`${index}-${note}`} className={styles.note}>
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.noNotes}>
                    Nothing written down yet. Anything you note here stays with
                    the book.
                  </p>
                )}

                <form className={styles.form} onSubmit={addNote}>
                  <div className={styles.formField}>
                    <TextField
                      label='Write a note about this book'
                      placeholder='What did you take from it?'
                      value={newNote}
                      onChange={(event) => setNewNote(event.target.value)}
                      disabled={saving}
                    />
                  </div>
                  <Button
                    type='submit'
                    variant='primary'
                    disabled={saving || !newNote.trim()}
                  >
                    {saving ? 'Saving' : 'Add note'}
                  </Button>
                </form>
              </section>
            </div>
          </article>
        )}
      </AsyncState>
    </div>
  );
}

export default BookDetails;
