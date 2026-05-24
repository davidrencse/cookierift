import type { CookieObservation, FlowEvent, HeaderTestResult, ReplayCheckResult, TimelineEvent, TokenAnalysis } from "../types";
import { formatDate, truncate } from "../utils/formatters";
import StatusView from "./StatusView";

export function FlowMapTable({ events }: { events: FlowEvent[] }) {
  if (!events.length) return <StatusView title="No flow events recorded" message="Save configuration and start a controlled run to populate the authentication flow map." />;
  return <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70"><table className="min-w-full text-sm"><thead className="bg-slate-950 text-left text-xs uppercase text-slate-400"><tr><th className="p-3">#</th><th className="p-3">Request</th><th className="p-3">Status</th><th className="p-3">Redirect</th><th className="p-3">Cookies</th><th className="p-3">Time</th></tr></thead><tbody>{events.map((event) => <tr key={event.id} className="border-t border-slate-800"><td className="p-3">{event.sequence}</td><td className="p-3"><span className="font-semibold text-violet-200">{event.requestMethod}</span> {truncate(event.requestUrl)}</td><td className="p-3">{event.responseStatus}</td><td className="p-3">{event.redirectedTo ? truncate(event.redirectedTo) : "—"}</td><td className="p-3">{event.observedCookieIds.length}</td><td className="p-3 text-slate-400">{formatDate(event.timestamp)}</td></tr>)}</tbody></table></div>;
}

export function CookieAttributeTable({ cookies }: { cookies: CookieObservation[] }) {
  if (!cookies.length) return <StatusView title="No cookies observed" message="Cookie attributes will appear after the backend records Set-Cookie observations." />;
  return <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/70"><table className="min-w-full text-sm"><thead className="bg-slate-950 text-left text-xs uppercase text-slate-400"><tr><th className="p-3">Cookie</th><th className="p-3">Hash</th><th className="p-3">Scope</th><th className="p-3">Secure</th><th className="p-3">HttpOnly</th><th className="p-3">SameSite</th><th className="p-3">Persistence</th></tr></thead><tbody>{cookies.map((cookie) => <tr key={cookie.id} className="border-t border-slate-800"><td className="p-3 font-semibold text-white">{cookie.name}</td><td className="p-3 font-mono text-xs text-slate-400">{truncate(cookie.valueHash, 24)}</td><td className="p-3">{cookie.domain || "host"}{cookie.path || "/"}</td><td className={`p-3 ${cookie.secure ? "text-emerald-300" : "text-rose-300"}`}>{cookie.secure ? "yes" : "missing"}</td><td className={`p-3 ${cookie.httpOnly ? "text-emerald-300" : "text-rose-300"}`}>{cookie.httpOnly ? "yes" : "missing"}</td><td className={`p-3 ${cookie.sameSite === "Unset" ? "text-rose-300" : "text-emerald-300"}`}>{cookie.sameSite}</td><td className="p-3">{cookie.persistent ? `until ${formatDate(cookie.expiresAt)}` : "session"}</td></tr>)}</tbody></table></div>;
}

export function TokenComparisonPanel({ analyses }: { analyses: TokenAnalysis[] }) {
  if (!analyses.length) return <StatusView title="No token comparisons yet" message="Sequential request analysis will show whether session identifiers rotate, remain unchanged, or are reused." />;
  return <div className="grid gap-4 md:grid-cols-2">{analyses.map((analysis) => <article key={analysis.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex items-center justify-between"><h3 className="font-bold text-white">{analysis.cookieName}</h3><span className={`rounded-full border px-2 py-1 text-xs ${analysis.result === "rotated" ? "border-emerald-700 bg-emerald-950 text-emerald-200" : "border-amber-700 bg-amber-950 text-amber-200"}`}>{analysis.result}</span></div><p className="mt-3 text-sm text-slate-300">{analysis.reason}</p><p className="mt-3 text-xs text-slate-500">Observed {formatDate(analysis.observedAt)}</p></article>)}</div>;
}

export function ReplayScenarioList({ results }: { results: ReplayCheckResult[] }) {
  if (!results.length) return <StatusView title="No replay checks recorded" message="Enable safe replay checks in configuration and run an assessment to review results." />;
  return <div className="grid gap-3">{results.map((result) => <div key={result.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex flex-wrap items-center gap-3"><span className="font-semibold text-white">Flow event {result.flowEventId}</span><span className="text-sm text-slate-400">HTTP {result.responseStatus}</span><span className={result.sessionStillAccepted ? "text-amber-300" : "text-emerald-300"}>{result.sessionStillAccepted ? "session accepted" : "session rejected"}</span></div><p className="mt-2 text-sm text-slate-300">{result.notes}</p></div>)}</div>;
}

export function HeaderMutationPanel({ results }: { results: HeaderTestResult[] }) {
  if (!results.length) return <StatusView title="No header tests recorded" message="Enable header variation checks and select mutations in the target configuration." />;
  return <div className="grid gap-3">{results.map((result) => <div key={result.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex flex-wrap gap-3"><span className="font-semibold text-violet-200">{result.headerName}</span><span className="text-slate-300">→ {result.mutatedValue}</span><span className="text-slate-400">HTTP {result.responseStatus}</span><span className={result.sessionAccepted ? "text-amber-300" : "text-emerald-300"}>{result.sessionAccepted ? "accepted" : "rejected"}</span></div><p className="mt-2 text-sm text-slate-300">{result.notes}</p></div>)}</div>;
}

export function TimelineView({ events }: { events: TimelineEvent[] }) {
  if (!events.length) return <StatusView title="No lifecycle events" message="Run results will build a chronological session lifecycle timeline." />;
  return <ol className="relative space-y-4 border-l border-slate-800 pl-5">{events.map((event) => <li key={event.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-rift" /><div className="flex flex-wrap items-center gap-2"><span className="font-bold text-white">{event.label}</span><span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{event.type}</span><span className="text-xs text-slate-500">{formatDate(event.timestamp)}</span></div><p className="mt-2 text-sm text-slate-300">{event.details}</p></li>)}</ol>;
}
