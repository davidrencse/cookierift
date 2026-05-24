import type { Assessment, AssessmentConfig, AssessmentDetailResponse, AssessmentSummary, ExportArtifact, Finding, GeneratedReport, HeaderMutationConfig, RunStatusResponse } from "../types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "http://localhost:3000";

type RequestBody = Record<string, unknown> | undefined;

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function apiFetch<T>(path: string, options: { method?: string; body?: RequestBody } = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    credentials: "include",
    headers: options.body ? { "Content-Type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json().catch(() => null) : await response.text().catch(() => "");

  if (!response.ok) {
    const message = typeof payload === "object" && payload && "error" in payload
      ? String((payload as { error?: unknown }).error)
      : typeof payload === "object" && payload && "message" in payload
        ? String((payload as { message?: unknown }).message)
        : `Request failed with status ${response.status}`;
    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}

export const api = {
  health: () => apiFetch<{ status: "ok" }>("/api/health"),
  acknowledgeAuthorizedUse: (authorizationReference: string) => apiFetch<{ authorizedUseAccepted: boolean; acceptedAt: string }>("/api/authorized-use/acknowledge", { method: "POST", body: { accepted: true, authorizationReference } }),
  listAssessments: () => apiFetch<{ items: AssessmentSummary[] }>("/api/assessments"),
  createAssessment: (body: { name: string; baseUrl: string; scopeNotes: string; authorizationReference: string }) => apiFetch<{ assessment: Assessment }>("/api/assessments", { method: "POST", body }),
  getAssessment: (assessmentId: string) => apiFetch<AssessmentDetailResponse>(`/api/assessments/${encodeURIComponent(assessmentId)}`),
  updateConfig: (assessmentId: string, body: { authEntryUrl: string; protectedPaths: string[]; replayChecksEnabled: boolean; headerTestsEnabled: boolean; headerMutations: HeaderMutationConfig[]; maxSequentialRequests: number; notes: string }) => apiFetch<{ config: AssessmentConfig }>(`/api/assessments/${encodeURIComponent(assessmentId)}/config`, { method: "PATCH", body }),
  startRun: (assessmentId: string) => apiFetch<{ runId: string; status: "queued" | "running" }>(`/api/assessments/${encodeURIComponent(assessmentId)}/run`, { method: "POST", body: { confirmAuthorized: true } }),
  stopRun: (assessmentId: string) => apiFetch<{ status: "stopped" }>(`/api/assessments/${encodeURIComponent(assessmentId)}/stop`, { method: "POST" }),
  getStatus: (assessmentId: string) => apiFetch<RunStatusResponse>(`/api/assessments/${encodeURIComponent(assessmentId)}/status`),
  listFindings: (assessmentId: string) => apiFetch<{ items: Finding[] }>(`/api/assessments/${encodeURIComponent(assessmentId)}/findings`),
  updateFinding: (assessmentId: string, findingId: string, body: Pick<Finding, "status" | "severity" | "confidence" | "title" | "analystNotes" | "remediation" | "evidenceIds">) => apiFetch<{ finding: Finding }>(`/api/assessments/${encodeURIComponent(assessmentId)}/findings/${encodeURIComponent(findingId)}`, { method: "PATCH", body }),
  listEvidence: (assessmentId: string) => apiFetch<{ items: import("../types").EvidenceRecord[] }>(`/api/assessments/${encodeURIComponent(assessmentId)}/evidence`),
  getReport: (assessmentId: string) => apiFetch<{ report: GeneratedReport }>(`/api/assessments/${encodeURIComponent(assessmentId)}/report`),
  exportAssessment: (assessmentId: string) => apiFetch<ExportArtifact>(`/api/assessments/${encodeURIComponent(assessmentId)}/export`),
  deleteAssessment: (assessmentId: string) => apiFetch<{ deleted: boolean }>(`/api/assessments/${encodeURIComponent(assessmentId)}`, { method: "DELETE" })
};
