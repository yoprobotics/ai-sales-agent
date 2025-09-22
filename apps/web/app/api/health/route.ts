import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()
    
    // Get database statistics
    const userCount = await prisma.user.count()
    const icpCount = await prisma.iCP.count()
    const prospectCount = await prisma.prospect.count()
    
    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      stats: {
        users: userCount,
        icps: icpCount,
        prospects: prospectCount,
      },
      version: process.env.npm_package_version || '0.1.1',
      environment: process.env.NODE_ENV || 'development',
    })
  } catch (error) {
    console.error('Health check failed:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
