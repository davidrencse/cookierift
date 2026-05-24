import type { ExportArtifact, GeneratedReport } from "../types";
import { downloadText } from "../utils/download";

interface Props { assessmentName: string; report: GeneratedReport | null; onExportJson: () => Promise<ExportArtifact>; }

function safeName(name: string) { return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "assessment"; }

export default function ExportActions({ assessmentName, report, onExportJson }: Props) {
  async function exportJson() {
    const artifact = await onExportJson();
    downloadText(`${safeName(assessmentName)}-cookierift-export.json`, JSON.stringify(artifact, null, 2), "application/json");
  }

  return (
    <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <button disabled={!report} onClick={() => report && downloadText(`${safeName(assessmentName)}-report.md`, report.content, "text/markdown")} className="rounded-lg bg-rift px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50">Download Markdown</button>
      <button onClick={() => void exportJson()} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Download JSON artifact</button>
    </div>
  );
}
