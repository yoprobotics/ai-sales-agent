import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const dbCheck = await prisma.$queryRaw`SELECT 1`
    
    return NextResponse.json({
      status: 'healthy',
      message: 'AI Sales Agent API is running',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: dbCheck ? 'connected' : 'disconnected',
      version: '1.0.0'
    }, { status: 200 })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json({
      status: 'unhealthy',
      message: 'Health check failed',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      error: process.env.NODE_ENV === 'development' ? error : 'Internal error'
    }, { status: 503 })
  }
}

export async function HEAD(request: NextRequest) {
  return GET(request)
}