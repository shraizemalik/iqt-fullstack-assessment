import { useEffect, useState } from 'react'

import { GitHubExplorerPage } from './pages/GitHubExplorerPage'
import { TaskDashboardPage } from './pages/TaskDashboardPage'

function resolvePageFromHash(hash) {
  return hash === '#github-explorer' ? 'github-explorer' : 'tasks'
}

function App() {
  const [activePage, setActivePage] = useState(resolvePageFromHash(window.location.hash))

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(resolvePageFromHash(window.location.hash))
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return activePage === 'github-explorer' ? <GitHubExplorerPage /> : <TaskDashboardPage />
}

export default App
