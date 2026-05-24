export type AssessmentStatus = "idle" | "queued" | "running" | "completed" | "failed" | "stopped";
export type Severity = "info" | "low" | "medium" | "high";
export type Confidence = "low" | "medium" | "high";
export type FindingStatus = "open" | "verified" | "needs-review" | "accepted-risk" | "false-positive";

export interface AssessmentSummary {
  id: string;
  name: string;
  baseUrl: string;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt: string;
  findingCount: number;
}

export interface Assessment {
  id: string;
  name: string;
  baseUrl: string;
  scopeNotes: string;
  authorizationReference: string;
  createdAt: string;
  updatedAt: string;
  status: AssessmentStatus;
}

export interface HeaderMutationConfig {
  headerName: string;
  mutatedValue: string;
  enabled: boolean;
}

export interface AssessmentConfig {
  assessmentId: string;
  authEntryUrl: string;
  protectedPaths: string[];
  replayChecksEnabled: boolean;
  headerTestsEnabled: boolean;
  headerMutations: HeaderMutationConfig[];
  maxSequentialRequests: number;
  notes: string;
}

export interface FlowEvent {
  id: string;
  assessmentId: string;
  sequence: number;
  requestMethod: string;
  requestUrl: string;
  responseStatus: number;
  redirectedTo: string | null;
  observedCookieIds: string[];
  timestamp: string;
}

export interface CookieObservation {
  id: string;
  assessmentId: string;
  name: string;
  valueHash: string;
  domain: string | null;
  path: string | null;
  secure: boolean;
  httpOnly: boolean;
  sameSite: "None" | "Lax" | "Strict" | "Unset";
  persistent: boolean;
  expiresAt: string | null;
  sourceUrl: string;
  observedAt: string;
}

export interface TokenAnalysis {
  id: string;
  assessmentId: string;
  cookieName: string;
  baselineCookieObservationId: string;
  comparisonCookieObservationId: string;
  result: "unchanged" | "rotated" | "missing" | "reused-after-state-change";
  reason: string;
  observedAt: string;
}

export interface ReplayCheckResult {
  id: string;
  assessmentId: string;
  flowEventId: string;
  replayed: boolean;
  responseStatus: number;
  sessionStillAccepted: boolean;
  notes: string;
  observedAt: string;
}

export interface HeaderTestResult {
  id: string;
  assessmentId: string;
  headerName: string;
  originalValueRedacted: string;
  mutatedValue: string;
  responseStatus: number;
  sessionAccepted: boolean;
  notes: string;
  observedAt: string;
}

export interface TimelineEvent {
  id: string;
  assessmentId: string;
  type: "login" | "set-cookie" | "protected-access" | "token-rotation" | "replay-check" | "header-test" | "logout" | "expiration" | "error";
  label: string;
  details: string;
  relatedEntityId: string | null;
  timestamp: string;
}

export interface Finding {
  id: string;
  assessmentId: string;
  type: "missing-cookie-attribute" | "weak-cookie-scope" | "token-not-rotated" | "replayable-auth-flow" | "weak-header-bound-session" | "manual-review-note";
  title: string;
  severity: Severity;
  confidence: Confidence;
  status: FindingStatus;
  summary: string;
  analystNotes: string;
  remediation: string;
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EvidenceRecord {
  id: string;
  assessmentId: string;
  kind: "request-response" | "cookie-snapshot" | "token-comparison" | "header-test" | "timeline-reference";
  title: string;
  request: { method: string; url: string; headersRedacted: Record<string, string> };
  response: { status: number; headersRedacted: Record<string, string> };
  bodyPreview: string;
  createdAt: string;
}

export interface GeneratedReport {
  assessmentId: string;
  format: "markdown";
  content: string;
  generatedAt: string;
}

export interface RunStatusResponse {
  status: AssessmentStatus;
  progress: { completedSteps: number; totalSteps: number; currentPhase: string };
  summary: { cookieCount: number; findingCount: number; timelineEventCount: number };
  error: string | null;
}

export interface AssessmentDetailResponse {
  assessment: Assessment;
  config: AssessmentConfig;
  flowEvents: FlowEvent[];
  cookieObservations: CookieObservation[];
  tokenAnalyses: TokenAnalysis[];
  replayResults: ReplayCheckResult[];
  headerTestResults: HeaderTestResult[];
  timeline: TimelineEvent[];
  findings: Finding[];
  evidence: EvidenceRecord[];
  report: GeneratedReport | null;
}

export interface ExportArtifact {
  assessment: Assessment;
  config: AssessmentConfig;
  findings: Finding[];
  evidence: EvidenceRecord[];
  report: GeneratedReport | null;
}
