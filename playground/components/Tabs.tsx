'use client'

import {
  type KeyboardEvent,
  type ReactNode,
  useId,
  useRef,
  useState,
} from 'react'

export type TabItem = {
  content: ReactNode
  id: string
  label: string
}

type TabsProps = {
  ariaLabel: string
  items: TabItem[]
}

export function Tabs({ ariaLabel, items }: TabsProps) {
  const generatedId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const focusTab = (index: number) => {
    tabRefs.current[index]?.focus()
  }

  const getPreviousIndex = (index: number) =>
    index === 0 ? items.length - 1 : index - 1

  const getNextIndex = (index: number) =>
    index === items.length - 1 ? 0 : index + 1

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault()
        focusTab(getNextIndex(index))
        break
      }
      case 'ArrowLeft': {
        event.preventDefault()
        focusTab(getPreviousIndex(index))
        break
      }
      case 'Home': {
        event.preventDefault()
        focusTab(0)
        break
      }
      case 'End': {
        event.preventDefault()
        focusTab(items.length - 1)
        break
      }
      case 'Enter':
      case ' ': {
        event.preventDefault()
        setActiveIndex(index)
        break
      }
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="tabs-widget">
      <div aria-label={ariaLabel} className="tab-list" role="tablist">
        {items.map((item, index) => {
          const isActive = index === activeIndex
          const tabId = `${generatedId}-${item.id}-tab`
          const panelId = `${generatedId}-${item.id}-panel`

          return (
            <button
              aria-controls={panelId}
              aria-selected={isActive}
              className="tab-button"
              id={tabId}
              key={item.id}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              role="tab"
              tabIndex={isActive ? 0 : -1}
              type="button"
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item, index) => {
        const isActive = index === activeIndex
        const tabId = `${generatedId}-${item.id}-tab`
        const panelId = `${generatedId}-${item.id}-panel`

        return (
          <section
            aria-labelledby={tabId}
            className="tab-panel"
            hidden={!isActive}
            id={panelId}
            key={item.id}
            role="tabpanel"
            tabIndex={0}
          >
            {item.content}
          </section>
        )
      })}
    </div>
  )
}
