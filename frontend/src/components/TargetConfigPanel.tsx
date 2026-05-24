import { FormEvent, useState } from "react";
import type { AssessmentConfig, HeaderMutationConfig } from "../types";
import { isHttpUrl, splitLines } from "../utils/validators";

interface Props { config: AssessmentConfig; onSave: (config: Omit<AssessmentConfig, "assessmentId">) => Promise<void>; }

const defaultHeaders = ["User-Agent", "Origin", "Referer", "X-Forwarded-For", "Accept"];

export default function TargetConfigPanel({ config, onSave }: Props) {
  const [authEntryUrl, setAuthEntryUrl] = useState(config.authEntryUrl || "");
  const [protectedPaths, setProtectedPaths] = useState(config.protectedPaths.join("\n"));
  const [replayChecksEnabled, setReplayChecksEnabled] = useState(config.replayChecksEnabled);
  const [headerTestsEnabled, setHeaderTestsEnabled] = useState(config.headerTestsEnabled);
  const [headerMutations, setHeaderMutations] = useState<HeaderMutationConfig[]>(config.headerMutations.length ? config.headerMutations : defaultHeaders.map((headerName) => ({ headerName, mutatedValue: "CookieRift-Controlled-Test", enabled: false })));
  const [maxSequentialRequests, setMaxSequentialRequests] = useState(config.maxSequentialRequests || 3);
  const [notes, setNotes] = useState(config.notes || "");
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!authEntryUrl.trim() || !isHttpUrl(authEntryUrl)) return setMessage("Authentication entry URL must be a valid http:// or https:// URL.");
    if (maxSequentialRequests < 1 || maxSequentialRequests > 20) return setMessage("Sequential request limit must be between 1 and 20.");
    setSaving(true);
    setMessage(null);
    try {
      await onSave({ authEntryUrl: authEntryUrl.trim(), protectedPaths: splitLines(protectedPaths), replayChecksEnabled, headerTestsEnabled, headerMutations, maxSequentialRequests, notes });
      setMessage("Configuration saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to save configuration.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <h2 className="text-lg font-bold text-white">Controlled test configuration</h2>
      <label className="mt-4 block text-sm font-medium text-slate-200">Authentication entry URL<input value={authEntryUrl} onChange={(e) => setAuthEntryUrl(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      <label className="mt-4 block text-sm font-medium text-slate-200">Protected paths or URLs<textarea value={protectedPaths} onChange={(e) => setProtectedPaths(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"><input type="checkbox" checked={replayChecksEnabled} onChange={(e) => setReplayChecksEnabled(e.target.checked)} /> Safe replay checks</label>
        <label className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 p-3 text-sm"><input type="checkbox" checked={headerTestsEnabled} onChange={(e) => setHeaderTestsEnabled(e.target.checked)} /> Header variation tests</label>
        <label className="block text-sm font-medium text-slate-200">Sequential request limit<input type="number" min={1} max={20} value={maxSequentialRequests} onChange={(e) => setMaxSequentialRequests(Number(e.target.value))} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      </div>
      <div className="mt-4 rounded-xl border border-slate-800 p-3"><div className="text-sm font-semibold text-white">Header mutations</div>{headerMutations.map((mutation, index) => <div key={mutation.headerName} className="mt-2 grid gap-2 md:grid-cols-12"><label className="md:col-span-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={mutation.enabled} onChange={(e) => setHeaderMutations((items) => items.map((item, i) => i === index ? { ...item, enabled: e.target.checked } : item))} /> {mutation.headerName}</label><input aria-label={`${mutation.headerName} mutated value`} value={mutation.mutatedValue} onChange={(e) => setHeaderMutations((items) => items.map((item, i) => i === index ? { ...item, mutatedValue: e.target.value } : item))} className="md:col-span-9 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white" /></div>)}</div>
      <label className="mt-4 block text-sm font-medium text-slate-200">Assessment notes<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      {message ? <p className="mt-3 text-sm text-slate-300" role="status">{message}</p> : null}
      <button disabled={saving} className="mt-4 rounded-lg bg-rift px-4 py-2 font-semibold text-white hover:bg-violet-500 disabled:opacity-60">{saving ? "Saving…" : "Save configuration"}</button>
    </form>
  );
}
