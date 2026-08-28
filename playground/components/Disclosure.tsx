'use client'

import { type ReactNode, useId, useState } from 'react'

type DisclosureProps = {
  children: ReactNode
  defaultOpen?: boolean
  title: string
}

export function Disclosure({
  children,
  defaultOpen = false,
  title,
}: DisclosureProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const generatedId = useId()
  const panelId = `${generatedId}-disclosure-panel`

  return (
    <div className="disclosure">
      <button
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="disclosure-trigger"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        type="button"
      >
        {title}
      </button>
      <div className="disclosure-panel" hidden={!isOpen} id={panelId}>
        {children}
      </div>
    </div>
  )
}
