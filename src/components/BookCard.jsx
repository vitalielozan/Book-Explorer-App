import { Link } from 'react-router';

import Cover from './Cover';
import styles from './BookCard.module.css';
import { spineColor } from '../lib/spine';
import { HeartIcon, TrashIcon } from '../ui/icons';

/**
 * One book, in either collection. `onToggleLike` and `onRemove` are optional:
 * the catalog can be liked, favorites can also be removed.
 */
function BookCard({ book, detailsTo, onToggleLike, onRemove, busy = false }) {
  const liked = book.likes === 1;

  return (
    <article className={styles.card} style={{ '--cloth': spineColor(book.title) }}>
      <Cover src={book.image} title={book.title} author={book.author} />

      <div className={styles.body}>
        <div className={styles.head}>
          <h3 className={styles.title}>
            {detailsTo ? (
              <Link to={detailsTo} className={styles.link}>
                {book.title}
              </Link>
            ) : (
              book.title
            )}
          </h3>
        </div>

        <p className={styles.author}>{book.author}</p>
        <p className={styles.desc}>{book.shortDesc}</p>

        <div className={styles.actions}>
          {onToggleLike && (
            <button
              type='button'
              className={`${styles.like} ${liked ? styles.liked : ''}`}
              onClick={() => onToggleLike(book)}
              disabled={busy}
              aria-pressed={liked}
              aria-label={liked ? `Unlike ${book.title}` : `Like ${book.title}`}
            >
              <HeartIcon filled={liked} />
            </button>
          )}
          {onRemove && (
            <button
              type='button'
              className={styles.remove}
              onClick={() => onRemove(book)}
              disabled={busy}
              aria-label={`Remove ${book.title} from your shelf`}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default BookCard;
