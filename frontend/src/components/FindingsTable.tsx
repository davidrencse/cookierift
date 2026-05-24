import { FormEvent, useState } from "react";
import type { Confidence, Finding, FindingStatus, Severity } from "../types";
import { confidenceClass, formatDate, severityClass } from "../utils/formatters";
import StatusView from "./StatusView";

interface Props { findings: Finding[]; onSave: (finding: Finding) => Promise<void>; }
const severities: Severity[] = ["info", "low", "medium", "high"];
const confidences: Confidence[] = ["low", "medium", "high"];
const statuses: FindingStatus[] = ["open", "verified", "needs-review", "accepted-risk", "false-positive"];

export default function FindingsTable({ findings, onSave }: Props) {
  const [editing, setEditing] = useState<Finding | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!editing) return;
    if (!editing.title.trim()) return setError("Finding title is required.");
    setSaving(true);
    setError(null);
    try {
      await onSave(editing);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update finding.");
    } finally {
      setSaving(false);
    }
  }

  if (!findings.length) return <StatusView title="No findings generated" message="Generated findings will appear here after cookie, token, replay, and header analyses complete." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
        {findings.map((finding) => <button key={finding.id} onClick={() => setEditing(finding)} className="block w-full border-b border-slate-800 p-4 text-left hover:bg-slate-800/60"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-white">{finding.title}</h3><p className="mt-1 text-sm text-slate-400">{finding.summary}</p></div><span className={`rounded-full border px-2 py-1 text-xs ${severityClass(finding.severity)}`}>{finding.severity}</span></div><div className="mt-3 flex flex-wrap gap-3 text-xs"><span className={confidenceClass(finding.confidence)}>confidence: {finding.confidence}</span><span className="text-slate-400">status: {finding.status}</span><span className="text-slate-500">updated {formatDate(finding.updatedAt)}</span></div></button>)}
      </div>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
        {editing ? <form onSubmit={submit}><h3 className="text-lg font-bold text-white">Edit finding</h3><label className="mt-4 block text-sm font-medium">Title<input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label><div className="mt-4 grid gap-3 md:grid-cols-3"><label className="block text-sm">Severity<select value={editing.severity} onChange={(e) => setEditing({ ...editing, severity: e.target.value as Severity })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{severities.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm">Confidence<select value={editing.confidence} onChange={(e) => setEditing({ ...editing, confidence: e.target.value as Confidence })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{confidences.map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-sm">Status<select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as FindingStatus })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2">{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div><label className="mt-4 block text-sm font-medium">Analyst notes<textarea value={editing.analystNotes} onChange={(e) => setEditing({ ...editing, analystNotes: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label><label className="mt-4 block text-sm font-medium">Remediation<textarea value={editing.remediation} onChange={(e) => setEditing({ ...editing, remediation: e.target.value })} rows={4} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label><label className="mt-4 block text-sm font-medium">Evidence IDs<input value={editing.evidenceIds.join(", ")} onChange={(e) => setEditing({ ...editing, evidenceIds: e.target.value.split(",").map((x) => x.trim()).filter(Boolean) })} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>{error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}<div className="mt-4 flex gap-2"><button disabled={saving} className="rounded-lg bg-rift px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Saving…" : "Save finding"}</button><button type="button" onClick={() => setEditing(null)} className="rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white">Cancel</button></div></form> : <StatusView title="Select a finding" message="Choose a generated finding to update severity, confidence, status, notes, remediation, or evidence links." />}
      </div>
    </div>
  );
}
