import { Link, useNavigate } from 'react-router';

import Button from '../ui/Button';
import styles from './ErrorPage.module.css';

function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className='page'>
      <div className={styles.wrap}>
        <div className={styles.gap} aria-hidden='true'>
          <span />
          <span />
          <span />
          <span />
        </div>

        <h1 className={styles.title}>That book is not on the shelf.</h1>
        <p className={styles.text}>
          The address you followed does not match anything in the catalog or on
          your shelf. It may have been removed, or the link may be wrong.
        </p>

        <div className={styles.actions}>
          <Button as={Link} to='/books' variant='primary'>
            Open the catalog
          </Button>
          <Button onClick={() => navigate(-1)}>Go back</Button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
