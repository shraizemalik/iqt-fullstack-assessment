const filters = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
]

export function TaskFilters({
  resultsLabel,
  searchValue,
  selectedStatus,
  onSearchChange,
  onStatusChange,
  isRefreshing,
}) {
  return (
    <section className="panel filters-panel">
      <div className="filters-panel__header">
        <div>
          <span className="eyebrow">Task overview</span>
          <h2>Track work with a clean, focused flow</h2>
        </div>
        <span className={`sync-indicator${isRefreshing ? ' is-active' : ''}`}>
          {isRefreshing ? 'Refreshing...' : 'Up to date'}
        </span>
      </div>
      <div className="filters-panel__controls">
        <label className="field">
          <span>Search tasks</span>
          <input
            className="input"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by title or description"
          />
        </label>
        <div className="field">
          <span>Status</span>
          <div className="segmented-control" role="tablist" aria-label="Task filters">
            {filters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`segmented-control__item${selectedStatus === filter.value ? ' is-active' : ''}`}
                onClick={() => onStatusChange(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="filters-panel__summary">{resultsLabel}</p>
    </section>
  )
}
