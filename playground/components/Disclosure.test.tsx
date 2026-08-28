import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Disclosure } from './Disclosure'

describe('Disclosure', () => {
  it('toggles with Enter and Space while updating aria-expanded', async () => {
    const user = userEvent.setup()
    render(
      <Disclosure title="Show details">
        <p>Extra details</p>
      </Disclosure>,
    )

    const button = screen.getByRole('button', { name: 'Show details' })

    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Extra details')).not.toBeVisible()

    await user.tab()
    expect(button).toHaveFocus()

    await user.keyboard('{Enter}')
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Extra details')).toBeVisible()

    await user.keyboard(' ')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getByText('Extra details')).not.toBeVisible()
  })
})
