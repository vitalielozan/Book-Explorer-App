import { Alert, Spinner } from 'react-bootstrap';

/**
 * The loading / failed / empty states every page that fetches shares. Children
 * render only once there is something to show.
 */
function AsyncState({ loading, error, isEmpty, emptyText = 'Nothing here yet.', children }) {
  if (loading) {
    return (
      <div className='text-center my-5'>
        <Spinner animation='border' variant='primary' />
        <p className='mt-3'>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='danger' className='my-4'>
        {error}
      </Alert>
    );
  }

  if (isEmpty) {
    return (
      <Alert variant='light' className='text-center my-4'>
        {emptyText}
      </Alert>
    );
  }

  return children;
}

export default AsyncState;
