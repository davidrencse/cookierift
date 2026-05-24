import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { CookieAttributeTable, FlowMapTable, HeaderMutationPanel, ReplayScenarioList, TimelineView, TokenComparisonPanel } from "../components/DataPanels";
import EvidenceViewer from "../components/EvidenceViewer";
import ExportActions from "../components/ExportActions";
import FindingsTable from "../components/FindingsTable";
import ReportPreview from "../components/ReportPreview";
import RunControls from "../components/RunControls";
import StatusView from "../components/StatusView";
import TargetConfigPanel from "../components/TargetConfigPanel";
import WorkspaceTabs, { type WorkspaceTab } from "../components/WorkspaceTabs";
import type { AssessmentDetailResponse, Finding, RunStatusResponse } from "../types";
import { formatDate, statusClass } from "../utils/formatters";

interface Props { assessmentId: string; onNavigate: (path: string) => void; }

export default function AssessmentWorkspacePage({ assessmentId, onNavigate }: Props) {
  const [detail, setDetail] = useState<AssessmentDetailResponse | null>(null);
  const [status, setStatus] = useState<RunStatusResponse | null>(null);
  const [tab, setTab] = useState<WorkspaceTab>("target");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [action, setAction] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const isActiveRun = status?.status === "queued" || status?.status === "running";

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const [assessment, runStatus] = await Promise.all([api.getAssessment(assessmentId), api.getStatus(assessmentId).catch(() => null)]);
      setDetail(assessment);
      setStatus(runStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load assessment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [assessmentId]);
  useEffect(() => {
    if (!isActiveRun) return;
    const timer = window.setInterval(async () => {
      try {
        const next = await api.getStatus(assessmentId);
        setStatus(next);
        if (!["queued", "running"].includes(next.status)) void load();
      } catch (err) {
        setStatus((current) => current ? { ...current, error: err instanceof Error ? err.message : "Unable to refresh run status." } : current);
      }
    }, 2000);
    return () => window.clearInterval(timer);
  }, [assessmentId, isActiveRun]);

  const title = useMemo(() => detail?.assessment.name || "Assessment", [detail]);

  async function run() {
    setAction(true);
    try {
      await api.startRun(assessmentId);
      setStatus(await api.getStatus(assessmentId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start run.");
    } finally {
      setAction(false);
    }
  }

  async function stop() {
    setAction(true);
    try {
      await api.stopRun(assessmentId);
      setStatus(await api.getStatus(assessmentId));
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to stop run.");
    } finally {
      setAction(false);
    }
  }

  async function generateReport() {
    setReportLoading(true);
    try {
      const response = await api.getReport(assessmentId);
      setDetail((current) => current ? { ...current, report: response.report } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to generate report.");
    } finally {
      setReportLoading(false);
    }
  }

  async function saveFinding(finding: Finding) {
    const response = await api.updateFinding(assessmentId, finding.id, {
      status: finding.status,
      severity: finding.severity,
      confidence: finding.confidence,
      title: finding.title,
      analystNotes: finding.analystNotes,
      remediation: finding.remediation,
      evidenceIds: finding.evidenceIds
    });
    setDetail((current) => current ? { ...current, findings: current.findings.map((item) => item.id === response.finding.id ? response.finding : item) } : current);
  }

  if (loading) return <main className="mx-auto max-w-7xl px-4 py-8"><StatusView title="Loading assessment workspace" tone="loading" /></main>;
  if (error && !detail) return <main className="mx-auto max-w-7xl px-4 py-8"><StatusView title="Unable to load workspace" message={error} tone="error" actionLabel="Retry" onAction={() => void load()} /></main>;
  if (!detail) return <main className="mx-auto max-w-7xl px-4 py-8"><StatusView title="Assessment not found" message="The backend did not return an assessment for this identifier." actionLabel="Back to assessments" onAction={() => onNavigate("/assessments")} /></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <button onClick={() => onNavigate("/assessments")} className="mb-4 text-sm text-violet-300 hover:text-violet-200">← Back to assessments</button>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end"><div><div className="flex flex-wrap items-center gap-2"><h1 className="text-3xl font-black text-white">{title}</h1><span className={`rounded-full border px-2 py-1 text-xs ${statusClass(detail.assessment.status)}`}>{detail.assessment.status}</span></div><p className="mt-1 text-sm text-slate-400">{detail.assessment.baseUrl} · updated {formatDate(detail.assessment.updatedAt)}</p><p className="mt-2 max-w-3xl text-sm text-slate-300">{detail.assessment.scopeNotes}</p></div><button onClick={() => onNavigate(`/assessments/${assessmentId}/report`)} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Open report page</button></div>
      {error ? <div className="mb-4 rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-sm text-rose-200" role="alert">{error}</div> : null}
      <div className="grid gap-5"><RunControls status={status} onRun={run} onStop={stop} runningAction={action} /><WorkspaceTabs active={tab} onChange={setTab} />
        {tab === "target" ? <TargetConfigPanel config={detail.config} onSave={async (config) => { const response = await api.updateConfig(assessmentId, config); setDetail({ ...detail, config: response.config }); }} /> : null}
        {tab === "flow" ? <FlowMapTable events={detail.flowEvents} /> : null}
        {tab === "cookies" ? <CookieAttributeTable cookies={detail.cookieObservations} /> : null}
        {tab === "tokens" ? <TokenComparisonPanel analyses={detail.tokenAnalyses} /> : null}
        {tab === "replay" ? <ReplayScenarioList results={detail.replayResults} /> : null}
        {tab === "headers" ? <HeaderMutationPanel results={detail.headerTestResults} /> : null}
        {tab === "timeline" ? <TimelineView events={detail.timeline} /> : null}
        {tab === "findings" ? <FindingsTable findings={detail.findings} onSave={saveFinding} /> : null}
        {tab === "evidence" ? <EvidenceViewer evidence={detail.evidence} /> : null}
        {tab === "report" ? <><ExportActions assessmentName={detail.assessment.name} report={detail.report} onExportJson={() => api.exportAssessment(assessmentId)} /><ReportPreview report={detail.report} loading={reportLoading} onGenerate={generateReport} /></> : null}
      </div>
    </main>
  );
}
