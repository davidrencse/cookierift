import type { AssessmentStatus, Confidence, Severity } from "../types";

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function statusClass(status: AssessmentStatus): string {
  const map: Record<AssessmentStatus, string> = {
    idle: "bg-slate-800 text-slate-200 border-slate-600",
    queued: "bg-indigo-950 text-indigo-200 border-indigo-700",
    running: "bg-cyan-950 text-cyan-200 border-cyan-700",
    completed: "bg-emerald-950 text-emerald-200 border-emerald-700",
    failed: "bg-rose-950 text-rose-200 border-rose-700",
    stopped: "bg-amber-950 text-amber-200 border-amber-700"
  };
  return map[status];
}

export function severityClass(severity: Severity): string {
  const map: Record<Severity, string> = {
    info: "bg-slate-800 text-slate-200 border-slate-600",
    low: "bg-blue-950 text-blue-200 border-blue-700",
    medium: "bg-amber-950 text-amber-200 border-amber-700",
    high: "bg-rose-950 text-rose-200 border-rose-700"
  };
  return map[severity];
}

export function confidenceClass(confidence: Confidence): string {
  const map: Record<Confidence, string> = {
    low: "text-slate-300",
    medium: "text-amber-200",
    high: "text-emerald-200"
  };
  return map[confidence];
}

export function truncate(value: string, length = 72): string {
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}
