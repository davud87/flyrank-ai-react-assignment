import './App.css'
import { TaskControls } from './components/TaskControls'
import { TaskForm } from './components/TaskForm'
import { TaskListPreview } from './components/TaskListPreview'

function App() {
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
          <span className="summary-value">0</span>
          <span className="summary-label">tasks ready to organize</span>
        </div>
      </section>

      <section className="workspace" aria-label="Task management workspace">
        <TaskForm />

        <div className="task-board">
          <TaskControls />
          <TaskListPreview />
        </div>
      </section>
    </main>
  )
}

export default App
