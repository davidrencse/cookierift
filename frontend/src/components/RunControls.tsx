import type { RunStatusResponse } from "../types";
import { statusClass } from "../utils/formatters";

interface Props { status: RunStatusResponse | null; onRun: () => Promise<void>; onStop: () => Promise<void>; runningAction: boolean; }

export default function RunControls({ status, onRun, onStop, runningAction }: Props) {
  const isRunning = status?.status === "running" || status?.status === "queued";
  const total = status?.progress.totalSteps || 0;
  const completed = status?.progress.completedSteps || 0;
  const percent = total > 0 ? Math.min(100, Math.round((completed / total) * 100)) : 0;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2"><h2 className="text-lg font-bold text-white">Assessment run</h2>{status ? <span className={`rounded-full border px-2 py-1 text-xs ${statusClass(status.status)}`}>{status.status}</span> : null}</div>
          <p className="mt-1 text-sm text-slate-400">{status?.progress.currentPhase || "Run status will appear after the backend is reachable."}</p>
        </div>
        <div className="flex gap-2">
          <button disabled={runningAction || isRunning} onClick={() => void onRun()} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50">Start controlled run</button>
          <button disabled={runningAction || !isRunning} onClick={() => void onStop()} className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">Stop</button>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-800"><div className="h-full bg-rift transition-all" style={{ width: `${percent}%` }} /></div>
      {status?.error ? <p className="mt-3 text-sm text-rose-300" role="alert">{status.error}</p> : null}
      {status ? <div className="mt-3 grid gap-3 text-sm text-slate-300 md:grid-cols-3"><div>Cookies: {status.summary.cookieCount}</div><div>Findings: {status.summary.findingCount}</div><div>Timeline events: {status.summary.timelineEventCount}</div></div> : null}
    </section>
  );
}
