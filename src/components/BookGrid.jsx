import styles from './BookGrid.module.css';

/** The shelf layout shared by the catalog, the favorites and the search results. */
function BookGrid({ children }) {
  return <div className={styles.grid}>{children}</div>;
}

export default BookGrid;
