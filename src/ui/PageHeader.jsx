import styles from './PageHeader.module.css';

/**
 * The heading band every page opens with: title left, a count or status on the
 * same baseline at the right, the sentence that explains the page underneath.
 */
function PageHeader({ title, count, children }) {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <h1 className={styles.title}>{title}</h1>
        {count && <span className={styles.count}>{count}</span>}
      </div>
      {children && <p className={styles.lead}>{children}</p>}
    </header>
  );
}

export default PageHeader;
