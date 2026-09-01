import { X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '../../../components/ui/dialog'
import { TaskForm } from '../TaskForm'
import type { Task, TaskFormData, WorkflowStatus } from '../../types/task'
import { TaskDetails } from './TaskDetails'

export type DialogState =
  | { mode: 'create'; task: null; initialData: TaskFormData }
  | { mode: 'edit'; task: Task; initialData: TaskFormData }
  | { mode: 'detail'; task: Task; initialData: TaskFormData }
  | null

type TaskDialogProps = {
  dialogState: DialogState
  onClose: () => void
  onDeleteTask: (taskId: string) => void
  onEditTask: (task: Task, trigger?: HTMLButtonElement | null) => void
  onSaveTask: (taskData: TaskFormData) => void
  onStatusChange: (taskId: string, status: WorkflowStatus) => void
  onSubtaskToggle: (taskId: string, subtaskId: string) => void
}

export function TaskDialog({
  dialogState,
  onClose,
  onDeleteTask,
  onEditTask,
  onSaveTask,
  onStatusChange,
  onSubtaskToggle,
}: TaskDialogProps) {
  const activeDialogTitle =
    dialogState?.mode === 'create'
      ? dialogState.initialData.aiAssisted
        ? 'Review AI suggestion'
        : 'Create task'
      : dialogState?.mode === 'edit'
        ? 'Edit task'
        : 'Task details'

  return (
    <Dialog
      open={dialogState !== null}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose()
        }
      }}
    >
      {dialogState ? (
        <DialogContent
          aria-labelledby="task-dialog-title"
          className="task-dialog"
          showCloseButton={false}
        >
          <div className="dialog-title-row">
            <div>
              <p className="section-kicker">
                {dialogState.mode === 'detail' ? 'Inspect' : 'Plan'}
              </p>
              <DialogTitle id="task-dialog-title">
                {activeDialogTitle}
              </DialogTitle>
            </div>
            <button
              aria-label="Close task dialog"
              className="icon-button"
              onClick={onClose}
              type="button"
            >
              <X aria-hidden="true" size={18} />
            </button>
          </div>

          {dialogState.mode === 'detail' ? (
            <TaskDetails
              onDeleteTask={onDeleteTask}
              onEditTask={(event) =>
                onEditTask(dialogState.task, event.currentTarget)
              }
              onStatusChange={onStatusChange}
              onSubtaskToggle={onSubtaskToggle}
              task={dialogState.task}
            />
          ) : (
            <TaskForm
              cancelLabel={
                dialogState.initialData.aiAssisted ? 'Reject suggestion' : 'Cancel'
              }
              key={`${dialogState.mode}-${dialogState.task?.id ?? 'new'}-${dialogState.initialData.title}`}
              initialData={dialogState.initialData}
              onCancel={onClose}
              onSaveTask={onSaveTask}
              submitLabel={
                dialogState.mode === 'edit'
                  ? 'Save changes'
                  : dialogState.initialData.aiAssisted
                    ? 'Create from suggestion'
                    : 'Create task'
              }
            />
          )}
        </DialogContent>
      ) : null}
    </Dialog>
  )
}
