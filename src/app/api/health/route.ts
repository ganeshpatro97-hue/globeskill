import { NextResponse } from 'next/server';
import { getPlatformStatus } from '@/lib/status-checker';

export const dynamic = 'force-dynamic'; // Prevent Vercel compilation caching

/**
 * GET /api/health
 * 
 * Serverless API Route Handler:
 * Strips edge-network caching headers, checks platform downstream services,
 * and responds with real-time health metrics.
 */
export async function GET() {
  try {
    const healthReport = await getPlatformStatus();

    // Set response headers to prevent CDNs, proxies, and service workers from caching stale results
    return NextResponse.json(healthReport, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Health check API error:', error);
    return NextResponse.json(
      {
        status: 'error',
        database: 'disconnected',
        message: 'Platform status engine failed',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
