'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './TaskFlowApp.css'
import type {
  AppSection,
  Department,
  Task,
  TaskFilters,
  TaskFormData,
  TaskPlannerSuggestion,
  WorkflowStatus,
} from '../types/task'
import { workflowStatusLabels } from '../types/task'
import {
  defaultFilters,
  filterTasks,
  getDepartmentProgress,
  getTaskStats,
} from '../utils/taskAnalytics'
import { loadTasks, saveTasks } from '../utils/taskStorage'
import {
  createEmptyTaskData,
  createTaskId,
  suggestionToFormData,
  taskToFormData,
} from '../utils/taskTransforms'
import { AiTaskPlanner } from './taskflow/AiTaskPlanner'
import { KanbanBoard } from './taskflow/KanbanBoard'
import { OverviewPanel } from './taskflow/OverviewPanel'
import { TaskDialog, type DialogState } from './taskflow/TaskDialog'
import { TaskFilterBar } from './taskflow/TaskFilterBar'
import { TaskFlowSidebar } from './taskflow/TaskFlowSidebar'
import { WorkspaceHeader } from './taskflow/WorkspaceHeader'

export function TaskFlowApp() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [activeSection, setActiveSection] = useState<AppSection>('overview')
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'all'>(
    'all',
  )
  const [filters, setFilters] = useState<TaskFilters>(defaultFilters)
  const [dialogState, setDialogState] = useState<DialogState>(null)
  const [announcement, setAnnouncement] = useState('')
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null)

  const visibleTasks = useMemo(
    () => filterTasks(tasks, filters, selectedDepartment),
    [filters, selectedDepartment, tasks],
  )
  const stats = useMemo(() => getTaskStats(tasks), [tasks])
  const departmentProgress = useMemo(() => getDepartmentProgress(tasks), [tasks])

  const closeDialog = useCallback(() => {
    setDialogState(null)
    window.setTimeout(() => {
      lastTriggerRef.current?.focus()
    }, 0)
  }, [])

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const openDialog = (
    state: DialogState,
    trigger?: HTMLButtonElement | null,
  ) => {
    lastTriggerRef.current = trigger ?? null
    setDialogState(state)
  }

  const openCreateDialog = (trigger?: HTMLButtonElement | null) => {
    const department =
      selectedDepartment === 'all' ? 'marketing' : selectedDepartment

    openDialog(
      {
        mode: 'create',
        task: null,
        initialData: createEmptyTaskData(department),
      },
      trigger,
    )
  }

  const openAiSuggestionDialog = (
    suggestion: TaskPlannerSuggestion,
    trigger?: HTMLButtonElement | null,
  ) => {
    openDialog(
      {
        mode: 'create',
        task: null,
        initialData: suggestionToFormData(suggestion),
      },
      trigger,
    )
  }

  const openEditDialog = (task: Task, trigger?: HTMLButtonElement | null) => {
    openDialog(
      {
        mode: 'edit',
        task,
        initialData: taskToFormData(task),
      },
      trigger,
    )
  }

  const openDetailDialog = (task: Task, trigger?: HTMLButtonElement | null) => {
    openDialog(
      {
        mode: 'detail',
        task,
        initialData: taskToFormData(task),
      },
      trigger,
    )
  }

  const handleSaveTask = (taskData: TaskFormData) => {
    const now = new Date().toISOString()

    if (dialogState?.mode === 'edit' && dialogState.task) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === dialogState.task.id
            ? {
                ...task,
                ...taskData,
                completed: taskData.status === 'done',
                updatedAt: now,
              }
            : task,
        ),
      )
      setAnnouncement(`Updated ${taskData.title}.`)
      closeDialog()
      return
    }

    const newTask: Task = {
      ...taskData,
      id: createTaskId(),
      completed: taskData.status === 'done',
      aiGenerated: taskData.aiAssisted === true,
      createdAt: now,
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
    setAnnouncement(`Created ${taskData.title}.`)
    closeDialog()
  }

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId)
    const confirmedDelete = window.confirm(
      `Delete "${task?.title ?? 'this task'}"? This cannot be undone.`,
    )

    if (!confirmedDelete) {
      return
    }

    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskId))
    setAnnouncement(task ? `Deleted ${task.title}.` : 'Deleted task.')
    closeDialog()
  }

  const handleStatusChange = (taskId: string, status: WorkflowStatus) => {
    const now = new Date().toISOString()
    const task = tasks.find((item) => item.id === taskId)
    const updateTaskStatus = (item: Task): Task =>
      item.id === taskId
        ? {
            ...item,
            status,
            completed: status === 'done',
            updatedAt: now,
          }
        : item

    setTasks((currentTasks) => currentTasks.map(updateTaskStatus))
    setDialogState((currentDialog) => {
      if (
        !currentDialog ||
        currentDialog.mode === 'create' ||
        currentDialog.task.id !== taskId
      ) {
        return currentDialog
      }

      return {
        ...currentDialog,
        task: updateTaskStatus(currentDialog.task),
      }
    })
    setAnnouncement(
      `${task?.title ?? 'Task'} moved to ${workflowStatusLabels[status]}.`,
    )
  }

  const handleSubtaskToggle = (taskId: string, subtaskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((subtask) =>
                subtask.id === subtaskId
                  ? { ...subtask, completed: !subtask.completed }
                  : subtask,
              ),
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  const updateFilters = (updates: Partial<TaskFilters>) => {
    setFilters((currentFilters) => ({ ...currentFilters, ...updates }))
  }

  const resetFilters = () => {
    setFilters(defaultFilters)
    setSelectedDepartment('all')
  }

  return (
    <main className="taskflow-shell">
      <TaskFlowSidebar
        activeSection={activeSection}
        onCreateTask={openCreateDialog}
        onSelectDepartment={setSelectedDepartment}
        onSetActiveSection={setActiveSection}
        selectedDepartment={selectedDepartment}
        tasks={tasks}
      />

      <section className="workspace-panel" aria-label="Task workspace">
        <WorkspaceHeader
          activeSection={activeSection}
          onCreateTask={openCreateDialog}
          selectedDepartment={selectedDepartment}
        />

        <div className="sr-only" aria-live="polite">
          {announcement}
        </div>

        {activeSection === 'overview' ? (
          <OverviewPanel
            departmentProgress={departmentProgress}
            onOpenTasks={() => setActiveSection('tasks')}
            stats={stats}
          />
        ) : null}

        <AiTaskPlanner onAcceptSuggestion={openAiSuggestionDialog} />

        <section className="task-workspace" aria-labelledby="board-title">
          <div className="board-heading">
            <div>
              <p className="section-kicker">Workflow</p>
              <h2 id="board-title">Kanban board</h2>
            </div>
            <span>{visibleTasks.length} visible tasks</span>
          </div>

          <TaskFilterBar
            filters={filters}
            onReset={resetFilters}
            onUpdate={updateFilters}
          />

          <KanbanBoard
            onDeleteTask={handleDeleteTask}
            onEditTask={openEditDialog}
            onOpenTask={openDetailDialog}
            onStatusChange={handleStatusChange}
            onSubtaskToggle={handleSubtaskToggle}
            tasks={visibleTasks}
            totalTasks={tasks.length}
          />
        </section>
      </section>

      <TaskDialog
        dialogState={dialogState}
        onClose={closeDialog}
        onDeleteTask={handleDeleteTask}
        onEditTask={openEditDialog}
        onSaveTask={handleSaveTask}
        onStatusChange={handleStatusChange}
        onSubtaskToggle={handleSubtaskToggle}
      />
    </main>
  )
}
