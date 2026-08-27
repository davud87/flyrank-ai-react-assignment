import { NextResponse } from 'next/server'

export type HealthStatus = {
  status: 'ok'
  application: 'TaskFlow'
  timestamp: string
  environment: string
}

export function GET() {
  const health: HealthStatus = {
    status: 'ok',
    application: 'TaskFlow',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }

  return NextResponse.json(health)
}
