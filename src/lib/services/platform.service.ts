import { PlatformStatus } from "@/types/platform";

/**
 * Core business logic function to retrieve the platform health and metadata.
 * 
 * Architectural Flow:
 * Frontend -> API Route (/api/health) -> Business Logic (getPlatformStatus) -> Response
 */
export async function getPlatformStatus(): Promise<PlatformStatus> {
  // Encapsulated domain logic:
  return {
    status: "ok",
    project: "GlobeSkill",
    message: "GlobeSkill backend is running",
    platformStatus: "Online",
    currentPhase: "Phase 1 - 5: Full-Stack Educational Platform & AI Assistant",
    timestamp: new Date().toISOString(),
    version: "2.0.0",
    details: {
      mission: "Technology & AI Education for Every Child",
      targetAudience: "Underserved learners and grassroots educational communities",
      environment: process.env.NODE_ENV || "development",
    },
  };
}
