import Link from 'next/link'

const navigationItems = [
  { href: '/', label: 'TaskFlow' },
  { href: '/health', label: 'Health' },
]

export function Navigation() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <nav
        className="mx-auto flex w-[min(100%_-_2rem,1120px)] flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Primary navigation"
      >
        <Link className="text-lg font-extrabold text-slate-950" href="/">
          TaskFlow
        </Link>
        <ul className="flex flex-wrap gap-2">
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link
                className="inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:border-blue-600 hover:text-blue-700 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue-200"
                href={item.href}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
