export type HealthStatus = {
  status: 'ok'
  application: 'TaskFlow'
  timestamp: string
  environment: string
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    application: 'TaskFlow',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }
}
