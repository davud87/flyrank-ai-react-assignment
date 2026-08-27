import { NextResponse } from 'next/server'
import { getHealthStatus } from '../../../src/utils/health'

export function GET() {
  return NextResponse.json(getHealthStatus())
}
