import { Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaTrash } from 'react-icons/fa';

const PLACEHOLDER_COVER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="250">
       <rect width="100%" height="100%" fill="#e9ecef"/>
       <text x="50%" y="50%" fill="#6c757d" font-family="sans-serif"
             font-size="16" text-anchor="middle">No cover</text>
     </svg>`,
  );

/**
 * One book, in either collection. `onToggleLike` and `onRemove` are optional:
 * the catalog can be liked, favorites can also be removed.
 */
function BookCard({ book, detailsTo, onToggleLike, onRemove, busy = false }) {
  const liked = book.likes === 1;

  return (
    <Card className='w-100 h-100'>
      <Card.Img
        variant='top'
        src={book.image || PLACEHOLDER_COVER}
        alt={`Cover of ${book.title}`}
        style={{ height: '250px', objectFit: 'cover' }}
      />
      <Card.Body className='d-flex flex-column'>
        <div className='d-flex justify-content-between align-items-start mb-2 gap-2'>
          <Card.Title className='mb-0'>{book.title}</Card.Title>
          {onToggleLike && (
            <Button
              variant='link'
              className='p-0 flex-shrink-0'
              onClick={() => onToggleLike(book)}
              disabled={busy}
              aria-pressed={liked}
              aria-label={liked ? `Unlike ${book.title}` : `Like ${book.title}`}
            >
              {liked ? (
                <FaHeart color='red' size={24} />
              ) : (
                <FaRegHeart color='grey' size={24} />
              )}
            </Button>
          )}
        </div>

        <Card.Subtitle className='mb-2 text-muted'>{book.author}</Card.Subtitle>
        <Card.Text className='flex-grow-1'>{book.shortDesc}</Card.Text>

        <div className='d-flex gap-2 mt-auto'>
          {detailsTo && (
            <Button as={Link} to={detailsTo} variant='primary' className='flex-grow-1'>
              View Details
            </Button>
          )}
          {onRemove && (
            <Button
              variant='outline-danger'
              onClick={() => onRemove(book)}
              disabled={busy}
              aria-label={`Remove ${book.title}`}
            >
              <FaTrash />
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookCard;
