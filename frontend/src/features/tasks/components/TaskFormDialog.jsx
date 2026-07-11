import { useEffect, useState } from 'react'

import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'

const defaultFormState = {
  title: '',
  description: '',
  is_completed: false,
}

export function TaskFormDialog({
  isOpen,
  isSaving,
  mode,
  onClose,
  onSubmit,
  serverErrors,
  task,
}) {
  const [form, setForm] = useState(defaultFormState)
  const [localErrors, setLocalErrors] = useState({})

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setForm(
      task
        ? {
            title: task.title,
            description: task.description ?? '',
            is_completed: task.is_completed,
          }
        : defaultFormState,
    )
    setLocalErrors({})
  }, [isOpen, task])

  const errors = {
    ...serverErrors,
    ...localErrors,
  }

  const handleChange = (field) => (event) => {
    const value =
      field === 'is_completed' ? event.target.checked : event.target.value

    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setLocalErrors((current) => {
      if (!current[field]) {
        return current
      }

      const nextErrors = { ...current }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const nextErrors = {}

    if (!form.title.trim()) {
      nextErrors.title = ['A title is required.']
    }

    if (Object.keys(nextErrors).length > 0) {
      setLocalErrors(nextErrors)
      return
    }

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim() || null,
      is_completed: form.is_completed,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Add task' : 'Edit task'}
      description="Keep tasks concise, clear, and easy to complete."
    >
      <form className="task-form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Title</span>
          <input
            className={`input${errors.title ? ' input--error' : ''}`}
            type="text"
            value={form.title}
            onChange={handleChange('title')}
            placeholder="Enter task title"
            maxLength={255}
          />
          {errors.title ? <small className="field-error">{errors.title[0]}</small> : null}
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            className={`input input--textarea${errors.description ? ' input--error' : ''}`}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Add a short description"
            rows={5}
          />
          {errors.description ? <small className="field-error">{errors.description[0]}</small> : null}
        </label>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={form.is_completed}
            onChange={handleChange('is_completed')}
          />
          <span>Mark this task as completed</span>
        </label>

        <div className="task-form__actions">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : mode === 'create' ? 'Create task' : 'Save changes'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
