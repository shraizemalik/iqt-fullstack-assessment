import { Button } from './Button'

export function Pagination({ currentPage, lastPage, onPageChange }) {
  if (lastPage <= 1) {
    return null
  }

  const pages = []

  for (let page = 1; page <= lastPage; page += 1) {
    if (
      page === 1 ||
      page === lastPage ||
      Math.abs(page - currentPage) <= 1
    ) {
      pages.push(page)
    } else if (pages.at(-1) !== 'ellipsis') {
      pages.push('ellipsis')
    }
  }

  return (
    <nav className="pagination" aria-label="Task pagination">
      <Button
        variant="secondary"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>
      <div className="pagination__pages">
        {pages.map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="pagination__ellipsis">
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              className={`pagination__page${page === currentPage ? ' pagination__page--active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ),
        )}
      </div>
      <Button
        variant="secondary"
        disabled={currentPage === lastPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
