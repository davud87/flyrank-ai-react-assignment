import { getHealthStatus } from '../../src/utils/health'

export const dynamic = 'force-dynamic'

export default function HealthPage() {
  const health = getHealthStatus()

  return (
    <main className="mx-auto grid min-h-[calc(100svh-80px)] w-[min(100%_-_2rem,720px)] place-items-center py-10">
      <section className="w-full rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
          System Health
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Application status
        </h1>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-sm font-semibold text-slate-600">Status</dt>
            <dd className="mt-1 text-lg font-bold text-green-700">
              {health.status}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <dt className="text-sm font-semibold text-slate-600">
              Application
            </dt>
            <dd className="mt-1 text-lg font-bold text-slate-950">
              {health.application}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
            <dt className="text-sm font-semibold text-slate-600">Timestamp</dt>
            <dd className="mt-1 break-words text-lg font-bold text-slate-950">
              {health.timestamp}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 sm:col-span-2">
            <dt className="text-sm font-semibold text-slate-600">
              Environment
            </dt>
            <dd className="mt-1 text-lg font-bold text-slate-950">
              {health.environment}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  )
}
