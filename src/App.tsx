import { useState } from 'react'
import './App.css'
import { TaskControls } from './components/TaskControls'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import type { Priority, Task } from './types/task'

type TaskFormData = {
  title: string
  description: string
  priority: Priority
}

const createTaskId = () => {
  if ('randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return Date.now().toString()
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)

  const editingTask =
    tasks.find((task) => task.id === editingTaskId) ?? null

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
          <TaskControls />
          <TaskList
            tasks={tasks}
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

export default App
