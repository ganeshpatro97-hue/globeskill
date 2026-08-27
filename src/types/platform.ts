export interface PlatformStatus {
  status: "ok" | "degraded" | "down";
  project: string;
  message: string;
  platformStatus: string;
  currentPhase: string;
  timestamp: string;
  version: string;
  details: {
    mission: string;
    targetAudience: string;
    environment: string;
  };
}
