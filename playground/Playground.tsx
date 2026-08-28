'use client'

import { useRef, useState } from 'react'
import { Disclosure } from './components/Disclosure'
import { ModalDialog } from './components/ModalDialog'
import { Tabs, type TabItem } from './components/Tabs'
import './playground.css'

const tabItems: TabItem[] = [
  {
    id: 'overview',
    label: 'Overview',
    content: (
      <p>
        The focused tab and the selected tab are intentionally separate until
        Enter or Space activates a focused tab.
      </p>
    ),
  },
  {
    id: 'keyboard',
    label: 'Keyboard',
    content: (
      <ul>
        <li>ArrowRight and ArrowLeft move focus between tabs.</li>
        <li>Home and End jump focus to the first and last tab.</li>
        <li>Enter and Space activate the focused tab.</li>
      </ul>
    ),
  },
  {
    id: 'panel',
    label: 'Panel',
    content: (
      <p>
        The active tab controls this tabpanel through matching
        aria-controls and aria-labelledby values.
      </p>
    ),
  },
]

export function Playground() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const openDialogButtonRef = useRef<HTMLButtonElement>(null)
  const initialDialogFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <main className="playground-shell">
      <section className="playground-header" aria-labelledby="playground-title">
        <p className="playground-kicker">Accessibility foundations</p>
        <h1 id="playground-title">Handcrafted ARIA practice components</h1>
        <p>
          A standalone playground for keyboard-testing a modal dialog, manual
          activation tabs, and a native-button disclosure pattern.
        </p>
      </section>

      <section className="playground-section" aria-labelledby="dialog-heading">
        <div className="section-copy">
          <p className="playground-kicker">Modal dialog</p>
          <h2 id="dialog-heading">Focus is moved, trapped, and restored</h2>
          <p>
            Open the dialog and use Tab, Shift+Tab, and Escape to verify the
            expected APG interaction.
          </p>
        </div>
        <button
          className="primary-demo-action"
          onClick={() => setIsDialogOpen(true)}
          ref={openDialogButtonRef}
          type="button"
        >
          Open dialog
        </button>
        <a className="text-link" href="#tabs-heading">
          Background tab stop after opener
        </a>
      </section>

      <ModalDialog
        descriptionId="demo-dialog-description"
        initialFocusRef={initialDialogFocusRef}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        openerRef={openDialogButtonRef}
        title="Keyboard review checklist"
        titleId="demo-dialog-title"
      >
        <p id="demo-dialog-description">
          This dialog keeps keyboard focus inside until it is closed. Escape or
          either close control should return focus to the Open dialog button.
        </p>
        <div className="dialog-actions">
          <button
            className="secondary-demo-action"
            onClick={() => setIsDialogOpen(false)}
            ref={initialDialogFocusRef}
            type="button"
          >
            Close and return
          </button>
          <button
            className="primary-demo-action"
            onClick={() => setIsDialogOpen(false)}
            type="button"
          >
            Confirm
          </button>
        </div>
      </ModalDialog>

      <section className="playground-section" aria-labelledby="tabs-heading">
        <div className="section-copy">
          <p className="playground-kicker">Tabs</p>
          <h2 id="tabs-heading">Manual activation tabs</h2>
          <p>
            Arrow keys move focus only. Enter or Space changes the selected
            panel.
          </p>
        </div>
        <Tabs ariaLabel="Accessibility notes" items={tabItems} />
      </section>

      <section
        className="playground-section"
        aria-labelledby="disclosure-heading"
      >
        <div className="section-copy">
          <p className="playground-kicker">Disclosure</p>
          <h2 id="disclosure-heading">Native button disclosure</h2>
          <p>
            The button exposes expanded state and relies on native keyboard
            activation for Enter and Space.
          </p>
        </div>
        <Disclosure title="Show implementation notes">
          <p>
            A native button already provides keyboard activation and focus
            behavior. The component adds aria-expanded, aria-controls, and
            matching hidden content.
          </p>
        </Disclosure>
      </section>
    </main>
  )
}
