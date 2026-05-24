import { FormEvent, useState } from "react";
import { api } from "../api/client";

interface Props { onAccepted: (acceptedAt: string) => void; }

export default function AuthorizedUsePage({ onAccepted }: Props) {
  const [checked, setChecked] = useState(false);
  const [authorizationReference, setAuthorizationReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!checked) return setError("You must confirm authorized use before continuing.");
    if (!authorizationReference.trim()) return setError("Provide an authorization reference for this browser session.");
    setSaving(true);
    setError(null);
    try {
      const response = await api.acknowledgeAuthorizedUse(authorizationReference.trim());
      if (!response.authorizedUseAccepted) throw new Error("Authorization acknowledgement was not accepted.");
      onAccepted(response.acceptedAt);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to record acknowledgement.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-8 shadow-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Authorized-use gate</p>
        <h1 className="mt-3 text-4xl font-black text-white md:text-5xl">Assess session handling only with explicit permission.</h1>
        <p className="mt-5 text-lg text-slate-300">CookieRift helps document cookie scope, token rotation, replay acceptance, header variation behavior, evidence, and reports for controlled assessments. It does not grant permission to test third-party systems.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><h2 className="font-bold text-white">Bounded scope</h2><p className="mt-2 text-sm text-slate-400">Use target URLs and paths covered by your written authorization.</p></div><div className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><h2 className="font-bold text-white">Redacted evidence</h2><p className="mt-2 text-sm text-slate-400">The UI displays redacted request and response metadata from the backend.</p></div><div className="rounded-2xl border border-slate-800 bg-slate-950 p-4"><h2 className="font-bold text-white">Manual verification</h2><p className="mt-2 text-sm text-slate-400">Findings are assessment aids and should be verified by the analyst.</p></div></div>
        <form onSubmit={submit} className="mt-8 rounded-2xl border border-amber-800/70 bg-amber-950/20 p-5">
          <label className="flex items-start gap-3 text-sm text-amber-50"><input type="checkbox" checked={checked} onChange={(e) => setChecked(e.target.checked)} className="mt-1" /> I confirm I own the target systems or have explicit written permission to assess them, and I will keep all tests within the authorized scope.</label>
          <label className="mt-4 block text-sm font-medium text-slate-200">Session authorization reference<textarea value={authorizationReference} onChange={(e) => setAuthorizationReference(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white" /></label>
          {error ? <p className="mt-3 text-sm text-rose-300" role="alert">{error}</p> : null}
          <button disabled={saving} className="mt-4 rounded-lg bg-rift px-5 py-3 font-bold text-white hover:bg-violet-500 disabled:opacity-60">{saving ? "Recording…" : "Acknowledge and enter"}</button>
        </form>
      </section>
    </main>
  );
}
