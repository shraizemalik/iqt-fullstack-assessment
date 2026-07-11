import { useEffect, useMemo, useRef, useState } from 'react'

import { AppTopbar } from '../components/layout/AppTopbar'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { NotificationList } from '../components/ui/NotificationList'
import { Pagination } from '../components/ui/Pagination'
import { DeleteTaskDialog } from '../features/tasks/components/DeleteTaskDialog'
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
        const response = await getTasks(
          {
            page: pagination.current_page,
            per_page: pagination.per_page,
            search: searchQuery || undefined,
            status: statusFilter === 'all' ? undefined : statusFilter,
          },
          controller.signal,
        )

        setTasks(response.data)
        setPagination((current) => ({
          ...current,
          ...response.meta,
        }))
        setSummary({
          total: response.summary.total,
          completed: response.summary.completed,
          pending: response.summary.pending,
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

  const completionRate = useMemo(() => {
    if (summary.total === 0) {
      return 0
    }

    return Math.round((summary.completed / summary.total) * 100)
  }, [summary.completed, summary.total])

  const sidebarFilters = useMemo(
    () => [
      { label: 'All tasks', value: 'all', count: summary.total, tone: 'all' },
      { label: 'Pending', value: 'pending', count: summary.pending, tone: 'pending' },
      { label: 'Completed', value: 'completed', count: summary.completed, tone: 'completed' },
    ],
    [summary.completed, summary.pending, summary.total],
  )

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
                updated_at: new Date().toISOString(),
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
    <main className="app-shell app-shell--board">
      <NotificationList notifications={notifications} onDismiss={dismissNotification} />

      <AppTopbar
        activePage="tasks"
        subtitle="Focus on what's next"
        variant="tasks"
        sidebarContent={
          <>
            <section className="sidebar-panel sidebar-panel--progress">
              <div
                className="progress-ring"
                style={{ '--progress-value': `${completionRate}%` }}
                aria-hidden="true"
              >
                <div className="progress-ring__inner">
                  <strong>{completionRate}%</strong>
                </div>
              </div>
              <div className="sidebar-panel__content">
                <span className="eyebrow">Progress</span>
                <strong>
                  {summary.completed} of {summary.total} done
                </strong>
              </div>
            </section>

            <section className="sidebar-section">
              <span className="eyebrow">Filter</span>
              <div className="sidebar-filter-list" role="tablist" aria-label="Task filters">
                {sidebarFilters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === filter.value}
                    className={`sidebar-filter${statusFilter === filter.value ? ' sidebar-filter--active' : ''}`}
                    onClick={() => {
                      setStatusFilter(filter.value)
                      setPagination((current) => ({
                        ...current,
                        current_page: 1,
                      }))
                    }}
                  >
                    <span className={`sidebar-filter__dot sidebar-filter__dot--${filter.tone}`} />
                    <span>{filter.label}</span>
                    <strong>{filter.count}</strong>
                  </button>
                ))}
              </div>
            </section>

            <Button className="sidebar__cta" onClick={openCreateDialog}>
              + New task
            </Button>
          </>
        }
      />

      <div className="board-main">
        <section id="tasks" className="board-hero">
          <span className="eyebrow">Your board</span>
          <h1>Today's work, sorted.</h1>
          <p>Capture, track, and finish one card at a time.</p>
        </section>

        <TaskFilters
          resultsLabel={resultsLabel}
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          isRefreshing={isRefreshing}
          totalCount={pagination.total}
        />

        <section className="mobile-task-controls" aria-label="Task filters and actions">
          <div className="mobile-task-controls__filters" role="tablist" aria-label="Task status filters">
            {sidebarFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === filter.value}
                className={`mobile-task-filter${statusFilter === filter.value ? ' mobile-task-filter--active' : ''}`}
                onClick={() => {
                  setStatusFilter(filter.value)
                  setPagination((current) => ({
                    ...current,
                    current_page: 1,
                  }))
                }}
              >
                <span className={`sidebar-filter__dot sidebar-filter__dot--${filter.tone}`} />
                <span>{filter.label}</span>
                <strong>{filter.count}</strong>
              </button>
            ))}
          </div>

          <Button className="mobile-task-controls__button" onClick={openCreateDialog}>
            + New task
          </Button>
        </section>

        {isInitialLoading ? (
          <section className="task-grid task-grid--loading" aria-label="Loading tasks">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="task-card task-card--skeleton" />
            ))}
          </section>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No tasks match this view"
            description="Try another search, switch the filter, or add a new task to keep the board moving."
            action={<Button onClick={openCreateDialog}>Create a task</Button>}
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
      </div>

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
