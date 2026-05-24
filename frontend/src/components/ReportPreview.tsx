import type { GeneratedReport } from "../types";
import { formatDate } from "../utils/formatters";
import StatusView from "./StatusView";

export default function ReportPreview({ report, loading, onGenerate }: { report: GeneratedReport | null; loading: boolean; onGenerate: () => Promise<void> }) {
  if (loading) return <StatusView title="Generating report" message="The backend is building the Markdown report preview." tone="loading" />;
  if (!report) return <StatusView title="No report generated" message="Generate a Markdown report from the latest assessment data." actionLabel="Generate report" onAction={() => void onGenerate()} />;
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center"><div><h2 className="text-lg font-bold text-white">Markdown report</h2><p className="text-sm text-slate-400">Generated {formatDate(report.generatedAt)}</p></div><button onClick={() => void onGenerate()} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Refresh preview</button></div>
      <pre className="max-h-[680px] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-950 p-4 text-sm leading-6 text-slate-200">{report.content}</pre>
    </section>
  );
}
