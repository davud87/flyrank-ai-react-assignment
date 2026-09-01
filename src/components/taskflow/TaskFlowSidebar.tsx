import { LayoutDashboard, ListTodo, Plus } from 'lucide-react'
import {
  departmentLabels,
  departments,
} from '../../types/task'
import type { AppSection, Department, Task } from '../../types/task'

type TaskFlowSidebarProps = {
  activeSection: AppSection
  onCreateTask: (trigger?: HTMLButtonElement | null) => void
  onSelectDepartment: (department: Department | 'all') => void
  onSetActiveSection: (section: AppSection) => void
  selectedDepartment: Department | 'all'
  tasks: Task[]
}

export function TaskFlowSidebar({
  activeSection,
  onCreateTask,
  onSelectDepartment,
  onSetActiveSection,
  selectedDepartment,
  tasks,
}: TaskFlowSidebarProps) {
  return (
    <aside className="sidebar" aria-label="TaskFlow navigation">
      <div className="brand-block">
        <span className="brand-mark">TF</span>
        <div>
          <p>TaskFlow AI</p>
          <span>Intelligent Work Management</span>
        </div>
      </div>

      <nav aria-label="Primary workspace">
        <button
          className={activeSection === 'overview' ? 'nav-item active' : 'nav-item'}
          onClick={() => onSetActiveSection('overview')}
          type="button"
        >
          <LayoutDashboard aria-hidden="true" size={18} />
          Overview
        </button>
        <button
          className={activeSection === 'tasks' ? 'nav-item active' : 'nav-item'}
          onClick={() => onSetActiveSection('tasks')}
          type="button"
        >
          <ListTodo aria-hidden="true" size={18} />
          My Tasks
        </button>
      </nav>

      <div className="sidebar-section">
        <div className="sidebar-section-title">
          <span>Spaces</span>
          <button
            aria-label="Add Department"
            className="icon-button"
            onClick={(event) => onCreateTask(event.currentTarget)}
            title="Add Department"
            type="button"
          >
            <Plus aria-hidden="true" size={16} />
          </button>
        </div>

        <button
          className={
            selectedDepartment === 'all' ? 'space-button active' : 'space-button'
          }
          onClick={() => onSelectDepartment('all')}
          type="button"
        >
          <span>All departments</span>
          <strong>{tasks.length}</strong>
        </button>
        {departments.map((department) => {
          const count = tasks.filter((task) => task.department === department).length

          return (
            <button
              className={
                selectedDepartment === department
                  ? 'space-button active'
                  : 'space-button'
              }
              key={department}
              onClick={() => {
                onSelectDepartment(department)
                onSetActiveSection('tasks')
              }}
              type="button"
            >
              <span>{departmentLabels[department]}</span>
              <strong>{count}</strong>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
