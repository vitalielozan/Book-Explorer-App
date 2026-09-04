import styles from './Field.module.css';
import { SearchIcon } from './icons';

export function SearchField({ label, ...props }) {
  return (
    <div className={styles.field}>
      <span className={styles.adornment}>
        <SearchIcon />
      </span>
      <input type='search' className={styles.input} aria-label={label} {...props} />
    </div>
  );
}

export function SelectField({ label, children, ...props }) {
  return (
    <div className={styles.field}>
      <select className={styles.select} aria-label={label} {...props}>
        {children}
      </select>
      <span className={styles.chevron} />
    </div>
  );
}

export function TextField({ label, ...props }) {
  return (
    <div className={styles.field}>
      <input className={styles.input} aria-label={label} {...props} />
    </div>
  );
}
