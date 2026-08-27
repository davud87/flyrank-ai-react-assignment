'use client'

import { useEffect, useState } from 'react'
import './TaskFlowApp.css'
import { TaskControls } from './TaskControls'
import { TaskForm } from './TaskForm'
import { TaskList } from './TaskList'
import type { FilterStatus, Task, TaskFormData } from '../types/task'
import { loadTasks, saveTasks } from '../utils/taskStorage'

const createTaskId = () => {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Date.now().toString()
}

export function TaskFlowApp() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all')

  const editingTask =
    tasks.find((task) => task.id === editingTaskId) ?? null

  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const visibleTasks = tasks.filter((task) => {
    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'active' && !task.completed) ||
      (activeFilter === 'completed' && task.completed)

    if (!matchesFilter) {
      return false
    }

    if (!normalizedSearchQuery) {
      return true
    }

    return (
      task.title.toLowerCase().includes(normalizedSearchQuery) ||
      (task.description?.toLowerCase().includes(normalizedSearchQuery) ?? false)
    )
  })

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const handleSaveTask = (taskData: TaskFormData) => {
    if (editingTask) {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: taskData.title,
                description: taskData.description || undefined,
                priority: taskData.priority,
                updatedAt: new Date().toISOString(),
              }
            : task,
        ),
      )
      setEditingTaskId(null)
      return
    }

    const newTask: Task = {
      id: createTaskId(),
      title: taskData.title,
      description: taskData.description || undefined,
      priority: taskData.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    setTasks((currentTasks) => [newTask, ...currentTasks])
  }

  const handleToggleTask = (taskId: string) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  const handleDeleteTask = (taskId: string) => {
    const confirmedDelete = window.confirm(
      'Are you sure you want to delete this task?',
    )

    if (!confirmedDelete) {
      return
    }

    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))

    if (editingTaskId === taskId) {
      setEditingTaskId(null)
    }
  }

  const handleStartEditing = (taskId: string) => {
    setEditingTaskId(taskId)
  }

  const handleCancelEditing = () => {
    setEditingTaskId(null)
  }

  return (
    <main className="app-shell">
      <section className="app-hero" aria-labelledby="app-title">
        <div>
          <p className="eyebrow">TaskFlow</p>
          <h1 id="app-title">Plan your day with clarity.</h1>
          <p className="app-subtitle">
            A lightweight task manager for adding, organizing, and reviewing
            priorities without leaving the browser.
          </p>
        </div>

        <div className="summary-panel" aria-label="Task summary preview">
          <span className="summary-value">{tasks.length}</span>
          <span className="summary-label">tasks ready to organize</span>
        </div>
      </section>

      <section className="workspace" aria-label="Task management workspace">
        <TaskForm
          key={editingTask?.id ?? 'new-task'}
          editingTask={editingTask}
          onCancelEditing={handleCancelEditing}
          onSaveTask={handleSaveTask}
        />

        <div className="task-board">
          <TaskControls
            activeFilter={activeFilter}
            searchQuery={searchQuery}
            onFilterChange={setActiveFilter}
            onSearchChange={setSearchQuery}
          />
          <TaskList
            tasks={visibleTasks}
            totalTaskCount={tasks.length}
            editingTaskId={editingTaskId}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleStartEditing}
            onToggleTask={handleToggleTask}
          />
        </div>
      </section>
    </main>
  )
}
