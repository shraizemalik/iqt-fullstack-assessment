export function AppTopbar({ activePage }) {
  return (
    <header className="topbar panel">
      <div className="topbar__brand">
        <span className="topbar__logo">TM</span>
        <div>
          <strong>Task Manager</strong>
          <p>Laravel + React assessment project</p>
        </div>
      </div>
      <nav className="topbar__nav" aria-label="Primary">
        <a
          className={`topbar__link${activePage === 'tasks' ? ' topbar__link--active' : ''}`}
          href="#tasks"
        >
          Task Manager
        </a>
        <a
          className={`topbar__link${activePage === 'github-explorer' ? ' topbar__link--active' : ''}`}
          href="#github-explorer"
        >
          GitHub Explorer
        </a>
        <a className="topbar__link" href="#repository">
          GitHub Repository
        </a>
      </nav>
    </header>
  )
}
