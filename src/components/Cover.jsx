import styles from './Cover.module.css';
import { spineColor } from '../lib/spine';

/**
 * The cover of a book, in the proportions a book actually has. Where there is
 * no artwork the book gets a stamped cloth cover in its own colour instead of a
 * placeholder graphic — it still reads as a specific book on the shelf.
 */
function Cover({ src, title, author, tall = false }) {
  if (src) {
    return (
      <div className={styles.cover}>
        <img
          className={styles.image}
          src={src}
          alt={`Cover of ${title}`}
          loading='lazy'
        />
      </div>
    );
  }

  return (
    <div className={`${styles.cover} ${tall ? styles.tall : ''}`}>
      <div
        className={styles.blank}
        style={{ '--cloth': spineColor(title) }}
        role='img'
        aria-label={`${title}, no cover artwork`}
      >
        <span className={styles.rule} />
        <span className={styles.stamped}>{title}</span>
        {author && <span className={styles.stampedAuthor}>{author}</span>}
        <span className={styles.rule} />
      </div>
    </div>
  );
}

export default Cover;
