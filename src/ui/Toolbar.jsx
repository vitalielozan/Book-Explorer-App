import styles from './Toolbar.module.css';

/** The filter row a listing page sits under: search first, controls after. */
function Toolbar({ children }) {
  return <div className={styles.toolbar}>{children}</div>;
}

export function ToolbarSearch({ children }) {
  return <div className={styles.search}>{children}</div>;
}

export function ToolbarControl({ children }) {
  return <div className={styles.trailing}>{children}</div>;
}

export default Toolbar;
