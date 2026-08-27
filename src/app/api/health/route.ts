import { NextResponse } from "next/server";
import { getPlatformStatus } from "@/lib/services/platform.service";

/**
 * GET /api/health
 * 
 * Thin API controller layer:
 * Validates request, delegates execution to business logic layer, and formats the HTTP response.
 */
export async function GET() {
  try {
    const statusData = await getPlatformStatus();
    return NextResponse.json(statusData, { status: 200 });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        status: "down",
        project: "GlobeSkill",
        message: "Failed to fetch platform status",
        platformStatus: "Offline",
        currentPhase: "Unknown",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
        details: {
          mission: "Technology & AI Education for Every Child",
          targetAudience: "Underserved learners",
          environment: process.env.NODE_ENV || "development",
        },
      },
      { status: 500 }
    );
  }
}
