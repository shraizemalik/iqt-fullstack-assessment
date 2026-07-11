const repositoryUrl = import.meta.env.VITE_REPOSITORY_URL || '#'

export function AppTopbar({
  activePage,
  subtitle = "Focus on what's next",
  sidebarContent = null,
  variant = 'default',
}) {
  return (
    <aside className={`sidebar sidebar--${variant} panel`}>
      <div className="sidebar__brand">
        <span className="sidebar__logo">TM</span>
        <div>
          <strong>Task Manager</strong>
          <p>{subtitle}</p>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Primary">
        <a
          className={`sidebar__link${activePage === 'tasks' ? ' sidebar__link--active' : ''}`}
          href="#tasks"
          aria-current={activePage === 'tasks' ? 'page' : undefined}
        >
          Task Manager
        </a>
        <a
          className={`sidebar__link${activePage === 'github-explorer' ? ' sidebar__link--active' : ''}`}
          href="#github-explorer"
          aria-current={activePage === 'github-explorer' ? 'page' : undefined}
        >
          GitHub Explorer
        </a>
        <a
          className="sidebar__link"
          href={repositoryUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          GitHub Repository
        </a>
      </nav>

      {sidebarContent ? <div className="sidebar__content">{sidebarContent}</div> : null}
    </aside>
  )
}
