import { useEffect, useMemo, useRef, useState } from 'react'

import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { NotificationList } from '../components/ui/NotificationList'
import { Pagination } from '../components/ui/Pagination'
import { DeleteTaskDialog } from '../features/tasks/components/DeleteTaskDialog'
import { SummaryCards } from '../features/tasks/components/SummaryCards'
import { TaskFilters } from '../features/tasks/components/TaskFilters'
import { TaskFormDialog } from '../features/tasks/components/TaskFormDialog'
import { TaskList } from '../features/tasks/components/TaskList'
import { useNotifications } from '../hooks/useNotifications'
import { createTask, deleteTask, getTasks, updateTask } from '../services/api/tasks'
import { getErrorMessage, getValidationErrors, isRequestCanceled } from '../utils/httpErrors'

export function TaskDashboardPage() {
  const [tasks, setTasks] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 9,
    total: 0,
    from: 0,
    to: 0,
  })
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  })
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('create')
  const [selectedTask, setSelectedTask] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [deleteCandidate, setDeleteCandidate] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)
  const hasLoadedOnceRef = useRef(false)

  const { notifications, dismissNotification, pushNotification } = useNotifications()

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchQuery(searchInput.trim())
      setPagination((current) => ({
        ...current,
        current_page: 1,
      }))
    }, 350)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

  useEffect(() => {
    const controller = new AbortController()

    const fetchTasks = async () => {
      const shouldShowInitialLoader = !hasLoadedOnceRef.current

      if (shouldShowInitialLoader) {
        setIsInitialLoading(true)
      } else {
        setIsRefreshing(true)
      }

      try {
        const [response, totalResponse, completedResponse, pendingResponse] = await Promise.all([
          getTasks(
            {
              page: pagination.current_page,
              per_page: pagination.per_page,
              search: searchQuery || undefined,
              status: statusFilter === 'all' ? undefined : statusFilter,
            },
            controller.signal,
          ),
          getTasks(
            {
              per_page: 1,
            },
            controller.signal,
          ),
          getTasks(
            {
              per_page: 1,
              status: 'completed',
            },
            controller.signal,
          ),
          getTasks(
            {
              per_page: 1,
              status: 'pending',
            },
            controller.signal,
          ),
        ])

        setTasks(response.data)
        setPagination((current) => ({
          ...current,
          ...response.meta,
        }))
        setSummary({
          total: totalResponse.meta.total,
          completed: completedResponse.meta.total,
          pending: pendingResponse.meta.total,
        })
        hasLoadedOnceRef.current = true
      } catch (error) {
        if (isRequestCanceled(error)) {
          return
        }

        pushNotification({
          type: 'error',
          title: 'Unable to load tasks',
          message: getErrorMessage(error, 'Please try again in a moment.'),
        })
      } finally {
        setIsInitialLoading(false)
        setIsRefreshing(false)
      }
    }

    fetchTasks()

    return () => controller.abort()
  }, [
    pagination.current_page,
    pagination.per_page,
    pushNotification,
    reloadKey,
    searchQuery,
    statusFilter,
  ])

  const resultsLabel = useMemo(() => {
    if (pagination.total === 0) {
      return 'No tasks found yet.'
    }

    return `Showing ${pagination.from}-${pagination.to} of ${pagination.total} tasks`
  }, [pagination.from, pagination.to, pagination.total])

  const openCreateDialog = () => {
    setFormMode('create')
    setSelectedTask(null)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const openEditDialog = (task) => {
    setFormMode('edit')
    setSelectedTask(task)
    setFormErrors({})
    setIsFormOpen(true)
  }

  const closeFormDialog = () => {
    if (isSaving) {
      return
    }

    setIsFormOpen(false)
    setSelectedTask(null)
    setFormErrors({})
  }

  const triggerReload = () => {
    setReloadKey((current) => current + 1)
  }

  const refreshFirstPage = () => {
    let shouldReload = false

    setPagination((current) => {
      if (current.current_page === 1) {
        shouldReload = true
        return current
      }

      return {
        ...current,
        current_page: 1,
      }
    })

    if (shouldReload) {
      triggerReload()
    }
  }

  const handleTaskSubmit = async (payload) => {
    setIsSaving(true)
    setFormErrors({})

    try {
      if (formMode === 'create') {
        await createTask(payload)
        pushNotification({
          title: 'Task created',
          message: 'The new task has been added successfully.',
        })
      } else if (selectedTask) {
        await updateTask(selectedTask.id, payload)
        pushNotification({
          title: 'Task updated',
          message: 'Your changes have been saved successfully.',
        })
      }

      setIsFormOpen(false)
      setSelectedTask(null)
      setFormErrors({})
      refreshFirstPage()
    } catch (error) {
      const validationErrors = getValidationErrors(error)

      if (validationErrors) {
        setFormErrors(validationErrors)
      } else {
        pushNotification({
          type: 'error',
          title: 'Unable to save task',
          message: getErrorMessage(error, 'Please review the form and try again.'),
        })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteRequest = (task) => {
    setDeleteCandidate(task)
  }

  const closeDeleteDialog = () => {
    if (isDeleting) {
      return
    }

    setDeleteCandidate(null)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) {
      return
    }

    setIsDeleting(true)

    try {
      await deleteTask(deleteCandidate.id)
      pushNotification({
        title: 'Task deleted',
        message: 'The task was removed successfully.',
      })

      setDeleteCandidate(null)

      if (tasks.length === 1 && pagination.current_page > 1) {
        setPagination((current) => ({
          ...current,
          current_page: current.current_page - 1,
        }))
      } else {
        refreshFirstPage()
      }
    } catch (error) {
      pushNotification({
        type: 'error',
        title: 'Unable to delete task',
        message: getErrorMessage(error, 'Please try again in a moment.'),
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleStatus = async (task) => {
    setUpdatingTaskId(task.id)

    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
        is_completed: !task.is_completed,
      })

      pushNotification({
        title: task.is_completed ? 'Task marked as pending' : 'Task completed',
        message: task.is_completed
          ? 'The task is back in your active queue.'
          : 'The task has been marked as completed.',
      })

      setTasks((current) =>
        current.map((entry) =>
          entry.id === task.id
            ? {
                ...entry,
                is_completed: !entry.is_completed,
              }
            : entry,
        ),
      )
      setSummary((current) => ({
        ...current,
        completed: task.is_completed ? current.completed - 1 : current.completed + 1,
        pending: task.is_completed ? current.pending + 1 : current.pending - 1,
      }))
    } catch (error) {
      pushNotification({
        type: 'error',
        title: 'Unable to update status',
        message: getErrorMessage(error, 'Please try again in a moment.'),
      })
    } finally {
      setUpdatingTaskId(null)
    }
  }

  return (
    <main className="app-shell">
      <NotificationList notifications={notifications} onDismiss={dismissNotification} />

      <header className="topbar panel">
        <div className="topbar__brand">
          <span className="topbar__logo">TM</span>
          <div>
            <strong>Task Manager</strong>
            <p>Laravel + React assessment project</p>
          </div>
        </div>
        <nav className="topbar__nav" aria-label="Primary">
          <a className="topbar__link topbar__link--active" href="#tasks">
            Task Manager
          </a>
          <a className="topbar__link" href="#github-explorer">
            GitHub Explorer
          </a>
          <a className="topbar__link" href="#repository">
            GitHub Repository
          </a>
        </nav>
      </header>

      <section id="tasks" className="hero panel">
        <div className="hero__content">
          <span className="eyebrow">Overview</span>
          <h1>Task Management System</h1>
          <p>Organize, track, and complete your daily tasks.</p>
        </div>
        <div className="hero__actions">
          <div className="hero__status">
            <span>Current filter</span>
            <strong>{statusFilter === 'all' ? 'All tasks' : `${statusFilter} tasks`}</strong>
          </div>
          <Button onClick={openCreateDialog}>Add new task</Button>
        </div>
      </section>

      <SummaryCards summary={summary} />

      <TaskFilters
        resultsLabel={resultsLabel}
        searchValue={searchInput}
        selectedStatus={statusFilter}
        onSearchChange={setSearchInput}
        onStatusChange={(value) => {
          setStatusFilter(value)
          setPagination((current) => ({
            ...current,
            current_page: 1,
          }))
        }}
        isRefreshing={isRefreshing}
      />

      {isInitialLoading ? (
        <section className="task-grid task-grid--loading" aria-label="Loading tasks">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="task-card task-card--skeleton" />
          ))}
        </section>
      ) : tasks.length === 0 ? (
        <EmptyState
          title="No tasks match your current view"
          description="Try a different search term, switch filters, or create a new task to get started."
          action={<Button onClick={openCreateDialog}>Create your first task</Button>}
        />
      ) : (
        <>
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteRequest}
            onEdit={openEditDialog}
            onToggleStatus={handleToggleStatus}
            updatingTaskId={updatingTaskId}
          />
          <Pagination
            currentPage={pagination.current_page}
            lastPage={pagination.last_page}
            onPageChange={(page) =>
              setPagination((current) => ({
                ...current,
                current_page: page,
              }))
            }
          />
        </>
      )}

      <TaskFormDialog
        isOpen={isFormOpen}
        isSaving={isSaving}
        mode={formMode}
        onClose={closeFormDialog}
        onSubmit={handleTaskSubmit}
        serverErrors={formErrors}
        task={selectedTask}
      />

      <DeleteTaskDialog
        isDeleting={isDeleting}
        isOpen={Boolean(deleteCandidate)}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteConfirm}
        taskTitle={deleteCandidate?.title ?? 'this task'}
      />
    </main>
  )
}
