'use client'

import { type ReactNode, type RefObject, useEffect, useRef } from 'react'

type ModalDialogProps = {
  children: ReactNode
  descriptionId?: string
  initialFocusRef?: RefObject<HTMLElement | null>
  isOpen: boolean
  onClose: () => void
  openerRef?: RefObject<HTMLElement | null>
  title: string
  titleId: string
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    .filter((element) => !element.hasAttribute('hidden'))
    .filter((element) => element.tabIndex >= 0)
}

export function ModalDialog({
  children,
  descriptionId,
  initialFocusRef,
  isOpen,
  onClose,
  openerRef,
  title,
  titleId,
}: ModalDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const fallbackFocusRef = useRef<HTMLDivElement>(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const dialog = dialogRef.current
    const fallback = fallbackFocusRef.current

    if (!dialog || !fallback) {
      return
    }

    const focusInitialElement = () => {
      const focusableElements = getFocusableElements(dialog)
      const target =
        initialFocusRef?.current ?? focusableElements[0] ?? fallback

      target.focus()
    }

    const timeoutId = window.setTimeout(focusInitialElement, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [initialFocusRef, isOpen])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const dialog = dialogRef.current

      if (!dialog) {
        return
      }

      const focusableElements = getFocusableElements(dialog)

      if (focusableElements.length === 0) {
        event.preventDefault()
        fallbackFocusRef.current?.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (!dialog.contains(activeElement)) {
        event.preventDefault()
        if (event.shiftKey) {
          lastElement.focus()
          return
        }

        firstElement.focus()
        return
      }

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
        return
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true
      return
    }

    if (wasOpenRef.current) {
      openerRef?.current?.focus()
      wasOpenRef.current = false
    }
  }, [isOpen, openerRef])

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" aria-hidden={false}>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <div className="modal-focus-fallback" ref={fallbackFocusRef} tabIndex={-1}>
          <div className="modal-heading-row">
            <h2 id={titleId}>{title}</h2>
            <button
              aria-label="Close dialog"
              className="icon-button"
              onClick={onClose}
              type="button"
            >
              X
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
