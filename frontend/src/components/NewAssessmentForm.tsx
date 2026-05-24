import { FormEvent, useState } from "react";
import { isHttpUrl, requireText } from "../utils/validators";

interface Props {
  onCreate: (payload: { name: string; baseUrl: string; scopeNotes: string; authorizationReference: string }) => Promise<void>;
}

export default function NewAssessmentForm({ onCreate }: Props) {
  const [name, setName] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [scopeNotes, setScopeNotes] = useState("");
  const [authorizationReference, setAuthorizationReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const validation = requireText(name, "Assessment name") || requireText(baseUrl, "Base URL") || requireText(scopeNotes, "Scope notes") || requireText(authorizationReference, "Authorization reference");
    if (validation) return setError(validation);
    if (!isHttpUrl(baseUrl)) return setError("Base URL must be a valid http:// or https:// URL.");
    setError(null);
    setSaving(true);
    try {
      await onCreate({ name: name.trim(), baseUrl: baseUrl.trim(), scopeNotes: scopeNotes.trim(), authorizationReference: authorizationReference.trim() });
      setName("");
      setBaseUrl("");
      setScopeNotes("");
      setAuthorizationReference("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create assessment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl">
      <h2 className="text-lg font-bold text-white">New authorized target assessment</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-medium text-slate-200">Target label<input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
        <label className="block text-sm font-medium text-slate-200">Base URL<input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://app.example.test" className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      </div>
      <label className="mt-4 block text-sm font-medium text-slate-200">Scope notes<textarea value={scopeNotes} onChange={(e) => setScopeNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      <label className="mt-4 block text-sm font-medium text-slate-200">Authorization reference<textarea value={authorizationReference} onChange={(e) => setAuthorizationReference(e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
      {error ? <p className="mt-3 text-sm text-rose-300" role="alert">{error}</p> : null}
      <button disabled={saving} className="mt-4 rounded-lg bg-rift px-4 py-2 font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60">{saving ? "Creating…" : "Create assessment"}</button>
    </form>
  );
}
