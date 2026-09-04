import { useEffect, useState } from 'react';

import Notice from '../ui/Notice';
import styles from './AsyncState.module.css';

/** How long a request runs before the wait is worth explaining. */
const SLOW_AFTER = 4000;

/**
 * The loading / failed / empty states every page that fetches shares. Children
 * render only once there is something to show.
 */
function AsyncState({
  loading,
  error,
  isEmpty,
  emptyText = 'Nothing here yet.',
  emptyAction,
  children,
}) {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!loading) {
      setSlow(false);
      return;
    }
    const timer = setTimeout(() => setSlow(true), SLOW_AFTER);
    return () => clearTimeout(timer);
  }, [loading]);

  if (loading) {
    return (
      <div className={styles.state}>
        <span className={styles.track} />
        <p className={styles.line}>
          {/* The free Render instance sleeps when idle, and the reader should
              know that rather than watch an unexplained spinner. */}
          {slow
            ? 'The library is waking up. A first request after an idle spell takes about half a minute.'
            : 'Fetching books.'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.state}>
        <Notice variant='danger'>{error}</Notice>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyText}>{emptyText}</p>
        {emptyAction}
      </div>
    );
  }

  return children;
}

export default AsyncState;
