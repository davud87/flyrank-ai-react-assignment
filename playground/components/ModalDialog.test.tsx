import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRef, useState } from 'react'
import { describe, expect, it } from 'vitest'
import { ModalDialog } from './ModalDialog'

function ModalHarness() {
  const [isOpen, setIsOpen] = useState(false)
  const openerRef = useRef<HTMLButtonElement>(null)
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        ref={openerRef}
        type="button"
      >
        Open dialog
      </button>
      <a href="#after-dialog">Background link</a>
      <ModalDialog
        descriptionId="test-dialog-description"
        initialFocusRef={initialFocusRef}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        openerRef={openerRef}
        title="Test dialog"
        titleId="test-dialog-title"
      >
        <p id="test-dialog-description">Dialog description.</p>
        <button ref={initialFocusRef} type="button">
          First action
        </button>
        <button type="button">Last action</button>
      </ModalDialog>
    </div>
  )
}

describe('ModalDialog', () => {
  it('opens, moves focus inside, closes with Escape, and restores focus', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)

    const opener = screen.getByRole('button', { name: 'Open dialog' })
    await user.click(opener)

    expect(screen.getByRole('dialog', { name: 'Test dialog' })).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'First action' })).toHaveFocus(),
    )

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('wraps Tab and Shift+Tab within the dialog', async () => {
    const user = userEvent.setup()
    render(<ModalHarness />)

    await user.click(screen.getByRole('button', { name: 'Open dialog' }))

    const closeButton = screen.getByRole('button', { name: 'Close dialog' })
    const firstAction = screen.getByRole('button', { name: 'First action' })
    const lastAction = screen.getByRole('button', { name: 'Last action' })

    await waitFor(() => expect(firstAction).toHaveFocus())

    await user.tab()
    expect(lastAction).toHaveFocus()

    await user.tab()
    expect(closeButton).toHaveFocus()

    await user.tab({ shift: true })
    expect(lastAction).toHaveFocus()
  })
})
