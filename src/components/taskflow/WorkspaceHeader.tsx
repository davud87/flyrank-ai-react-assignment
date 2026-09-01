import { Plus } from 'lucide-react'
import { departmentLabels } from '../../types/task'
import type { AppSection, Department } from '../../types/task'

type WorkspaceHeaderProps = {
  activeSection: AppSection
  onCreateTask: (trigger?: HTMLButtonElement | null) => void
  selectedDepartment: Department | 'all'
}

export function WorkspaceHeader({
  activeSection,
  onCreateTask,
  selectedDepartment,
}: WorkspaceHeaderProps) {
  return (
    <header className="workspace-header">
      <div>
        <p className="eyebrow">TaskFlow AI</p>
        <h1>
          {activeSection === 'overview'
            ? 'Project overview'
            : selectedDepartment === 'all'
              ? 'My tasks'
              : departmentLabels[selectedDepartment]}
        </h1>
        <p>
          Organize work by department and move tasks through a focused,
          accessible Kanban workflow.
        </p>
      </div>
      <button
        className="primary-action header-action"
        onClick={(event) => onCreateTask(event.currentTarget)}
        type="button"
      >
        <Plus aria-hidden="true" size={18} />
        New task
      </button>
    </header>
  )
}
