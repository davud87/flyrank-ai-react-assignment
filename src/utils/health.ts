export type HealthStatus = {
  status: 'ok'
  application: 'TaskFlow AI'
  timestamp: string
  environment: string
}

export function getHealthStatus(): HealthStatus {
  return {
    status: 'ok',
    application: 'TaskFlow AI',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  }
}
