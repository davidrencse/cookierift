import { useEffect, useState } from "react";
import { api } from "../api/client";
import ExportActions from "../components/ExportActions";
import ReportPreview from "../components/ReportPreview";
import StatusView from "../components/StatusView";
import type { Assessment, GeneratedReport } from "../types";

interface Props { assessmentId: string; onNavigate: (path: string) => void; }

export default function ReportPreviewPage({ assessmentId, onNavigate }: Props) {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [report, setReport] = useState<GeneratedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportLoading, setReportLoading] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const detail = await api.getAssessment(assessmentId);
      setAssessment(detail.assessment);
      setReport(detail.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load report page.");
    } finally {
      setLoading(false);
    }
  }

  async function generate() {
    setReportLoading(true);
    try {
      const response = await api.getReport(assessmentId);
      setReport(response.report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate report.");
    } finally {
      setReportLoading(false);
    }
  }

  useEffect(() => { void load(); }, [assessmentId]);

  if (loading) return <main className="mx-auto max-w-5xl px-4 py-8"><StatusView title="Loading report" tone="loading" /></main>;
  if (error && !assessment) return <main className="mx-auto max-w-5xl px-4 py-8"><StatusView title="Unable to load report" message={error} tone="error" actionLabel="Retry" onAction={() => void load()} /></main>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <button onClick={() => onNavigate(`/assessments/${assessmentId}`)} className="mb-4 text-sm text-violet-300 hover:text-violet-200">← Back to workspace</button>
      <h1 className="mb-4 text-3xl font-black text-white">Report preview{assessment ? `: ${assessment.name}` : ""}</h1>
      {error ? <div className="mb-4 rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-200">{error}</div> : null}
      {assessment ? <div className="mb-4"><ExportActions assessmentName={assessment.name} report={report} onExportJson={() => api.exportAssessment(assessmentId)} /></div> : null}
      <ReportPreview report={report} loading={reportLoading} onGenerate={generate} />
    </main>
  );
}
