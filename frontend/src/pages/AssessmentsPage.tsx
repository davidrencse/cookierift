import { useEffect, useState } from "react";
import { api } from "../api/client";
import AssessmentList from "../components/AssessmentList";
import NewAssessmentForm from "../components/NewAssessmentForm";
import StatusView from "../components/StatusView";
import type { AssessmentSummary } from "../types";

interface Props { onNavigate: (path: string) => void; }

export default function AssessmentsPage({ onNavigate }: Props) {
  const [items, setItems] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const response = await api.listAssessments();
      setItems(response.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load assessments.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function create(payload: { name: string; baseUrl: string; scopeNotes: string; authorizationReference: string }) {
    const response = await api.createAssessment(payload);
    onNavigate(`/assessments/${response.assessment.id}`);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this assessment and related artifacts?")) return;
    await api.deleteAssessment(id);
    await load();
  }

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[420px_1fr]">
      <NewAssessmentForm onCreate={create} />
      <section>
        <div className="mb-4 flex items-center justify-between"><div><h1 className="text-2xl font-black text-white">Assessment history</h1><p className="text-sm text-slate-400">Saved local assessments from the backend API.</p></div><button onClick={() => void load()} className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700">Retry / refresh</button></div>
        {loading ? <StatusView title="Loading assessments" tone="loading" /> : error ? <StatusView title="Unable to load assessments" message={error} tone="error" actionLabel="Retry" onAction={() => void load()} /> : <AssessmentList items={items} onOpen={(id) => onNavigate(`/assessments/${id}`)} onDelete={remove} />}
      </section>
    </main>
  );
}
