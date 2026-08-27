import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import './globals.css'
import { Navigation } from '../src/components/layout/Navigation'

export const metadata: Metadata = {
  title: 'TaskFlow',
  description:
    'A frontend-only task management application built with Next.js and TypeScript.',
}

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}
