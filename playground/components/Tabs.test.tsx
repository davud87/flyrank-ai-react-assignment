import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Tabs, type TabItem } from './Tabs'

const items: TabItem[] = [
  { id: 'one', label: 'One', content: <p>Panel one</p> },
  { id: 'two', label: 'Two', content: <p>Panel two</p> },
  { id: 'three', label: 'Three', content: <p>Panel three</p> },
]

describe('Tabs', () => {
  it('moves focus with arrows, Home, and End without changing selection', async () => {
    const user = userEvent.setup()
    render(<Tabs ariaLabel="Test tabs" items={items} />)

    const firstTab = screen.getByRole('tab', { name: 'One' })
    const secondTab = screen.getByRole('tab', { name: 'Two' })
    const thirdTab = screen.getByRole('tab', { name: 'Three' })

    await user.tab()
    expect(firstTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')

    await user.keyboard('{ArrowRight}')
    expect(secondTab).toHaveFocus()
    expect(firstTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel one')

    await user.keyboard('{ArrowLeft}')
    expect(firstTab).toHaveFocus()

    await user.keyboard('{ArrowLeft}')
    expect(thirdTab).toHaveFocus()

    await user.keyboard('{Home}')
    expect(firstTab).toHaveFocus()

    await user.keyboard('{End}')
    expect(thirdTab).toHaveFocus()
  })

  it('activates the focused tab with Enter and Space', async () => {
    const user = userEvent.setup()
    render(<Tabs ariaLabel="Test tabs" items={items} />)

    const firstTab = screen.getByRole('tab', { name: 'One' })
    const secondTab = screen.getByRole('tab', { name: 'Two' })
    const thirdTab = screen.getByRole('tab', { name: 'Three' })

    await user.tab()
    await user.keyboard('{ArrowRight}{Enter}')

    expect(secondTab).toHaveAttribute('aria-selected', 'true')
    expect(secondTab).toHaveAttribute('tabindex', '0')
    expect(firstTab).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two')

    await user.keyboard('{ArrowRight} ')

    expect(thirdTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel three')
  })
})
