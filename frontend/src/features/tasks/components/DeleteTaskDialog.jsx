import { Button } from '../../../components/ui/Button'
import { Modal } from '../../../components/ui/Modal'

export function DeleteTaskDialog({ isDeleting, isOpen, onClose, onConfirm, taskTitle }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete task"
      description="This action cannot be undone."
    >
      <div className="dialog-content">
        <p>
          Are you sure you want to delete <strong>{taskTitle}</strong>?
        </p>
        <div className="dialog-actions">
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete task'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
