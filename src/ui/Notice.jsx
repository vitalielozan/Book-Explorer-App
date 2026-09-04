import styles from './Notice.module.css';
import { CloseIcon } from './icons';

/**
 * Every message the app shows a reader: a failed write, a saved book, an empty
 * shelf. `onDismiss` turns it into something they can put away.
 */
function Notice({ variant = 'info', onDismiss, children }) {
  return (
    <div className={`${styles.notice} ${styles[variant]}`} role='status'>
      <div className={styles.text}>{children}</div>
      {onDismiss && (
        <button
          type='button'
          className={styles.dismiss}
          onClick={onDismiss}
          aria-label='Dismiss this message'
        >
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </div>
  );
}

export default Notice;
