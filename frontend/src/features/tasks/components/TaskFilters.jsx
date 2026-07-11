export function TaskFilters({
  resultsLabel,
  searchValue,
  onSearchChange,
  isRefreshing,
  totalCount,
}) {
  return (
    <section className="board-search">
      <div className="board-search__row">
        <label className="board-search__field" htmlFor="task-search">
          <span className="sr-only">Search tasks</span>
          <input
            id="task-search"
            className="input input--search"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search tasks by title or notes"
          />
        </label>

        <div className="board-search__meta">
          <span className={`sync-indicator${isRefreshing ? ' is-active' : ''}`}>
            {isRefreshing ? 'Refreshing...' : 'Up to date'}
          </span>
          <span className="board-search__count">
            {totalCount} {totalCount === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      <p className="board-search__summary">{resultsLabel}</p>
    </section>
  )
}
