import { Link } from 'react-router';

import styles from './SiteFooter.module.css';
import { GithubIcon } from '../ui/icons';

function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`page ${styles.inner}`}>
        <p className={styles.about}>
          <span className={styles.name}>Book Explorer</span>
          A reading catalog you can search, add to from Open Library, and mark up
          with your own notes.
        </p>

        <div>
          <h2 className={styles.heading}>Sections</h2>
          <ul className={styles.list}>
            <li>
              <Link to='/books'>Catalog</Link>
            </li>
            <li>
              <Link to='/favorites'>Your shelf</Link>
            </li>
            <li>
              <Link to='/discover'>Discover</Link>
            </li>
            <li>
              <Link to='/about'>About</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className={styles.heading}>Built with</h2>
          <ul className={styles.list}>
            <li>
              <a
                href='https://openlibrary.org/developers/api'
                target='_blank'
                rel='noopener noreferrer'
              >
                Open Library
              </a>
            </li>
            <li>
              <a
                href='https://github.com/vitalielozan/My-Json-Server'
                target='_blank'
                rel='noopener noreferrer'
              >
                My JSON Server
              </a>
            </li>
            <li>
              <a
                className={styles.github}
                href='https://github.com/vitalielozan/Book-Explorer-App-ReactJS'
                target='_blank'
                rel='noopener noreferrer'
              >
                <GithubIcon width={16} height={16} />
                Source on GitHub
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
