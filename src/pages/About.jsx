import PageHeader from '../ui/PageHeader';
import styles from './About.module.css';

const STACK = [
  'React 19',
  'Vite',
  'React Router',
  'Axios',
  'CSS Modules',
  'Express',
  'json-server',
  'Render',
];

function About() {
  return (
    <div className='page'>
      <PageHeader title='About'>
        What this app is, where its books come from, and how the writes are kept
        off the client.
      </PageHeader>

      <article className={styles.article}>
        <div className={styles.prose}>
          <p>
            Book Explorer keeps two shelves. The catalog is a small set of books
            held in the API itself and versioned alongside it. The second shelf
            is yours: titles pulled in from Open Library, kept separately so the
            catalog stays exactly as it was curated.
          </p>
          <p>
            Both shelves take likes and notes. Searching and sorting run on the
            server rather than in the browser, so the page only ever holds the
            records it is showing.
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.heading}>Where the books come from</h2>
          <div className={styles.sources}>
            <div className={styles.source}>
              <span className={styles.sourceName}>
                <a
                  href='https://github.com/vitalielozan/My-Json-Server'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  My JSON Server
                </a>
              </span>
              <p className={styles.sourceText}>
                A multi-project REST API on Express and json-server, running on
                Render. It holds the <code className={styles.code}>books</code>{' '}
                catalog, the <code className={styles.code}>favorites</code>{' '}
                shelf, and every like and note written against them.
              </p>
            </div>
            <div className={styles.source}>
              <span className={styles.sourceName}>
                <a
                  href='https://openlibrary.org/developers/api'
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Open Library
                </a>
              </span>
              <p className={styles.sourceText}>
                The Internet Archive&apos;s open catalog, queried directly from
                the browser for the Discover page. Saving a result copies its
                work key, which is what stops the same book being kept twice.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Reads are public, writes are not</h2>
          <div className={styles.prose}>
            <p>
              Anyone can read the collections. Creating, updating or deleting a
              record needs a shared key, and a key shipped in a front-end bundle
              is a key anyone can read. So it never reaches the bundle: it lives
              in <code className={styles.code}>.env</code> without a{' '}
              <code className={styles.code}>VITE_</code> prefix, which keeps it
              out of <code className={styles.code}>import.meta.env</code>{' '}
              entirely.
            </p>
            <p>
              Only the Vite config reads it, on the Node side, and attaches it to
              requests as they pass through the dev and preview proxy. Any other
              deployment needs its own proxy doing the same thing.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.heading}>Built with</h2>
          <div className={styles.stack}>
            {STACK.map((item) => (
              <span key={item} className={styles.chip}>
                {item}
              </span>
            ))}
          </div>
        </section>

        <p className={styles.signoff}>
          Designed and built by Vitalie Lozan. The source is on{' '}
          <a
            href='https://github.com/vitalielozan/Book-Explorer-App-ReactJS'
            target='_blank'
            rel='noopener noreferrer'
          >
            GitHub
          </a>
          .
        </p>
      </article>
    </div>
  );
}

export default About;
