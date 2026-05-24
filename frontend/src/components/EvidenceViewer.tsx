import type { EvidenceRecord } from "../types";
import { formatDate } from "../utils/formatters";
import StatusView from "./StatusView";

export default function EvidenceViewer({ evidence }: { evidence: EvidenceRecord[] }) {
  if (!evidence.length) return <StatusView title="No evidence records" message="Redacted request, response, cookie, token, and header evidence will appear after a run." />;
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {evidence.map((record) => <article key={record.id} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-white">{record.title}</h3><p className="text-xs text-slate-500">{record.kind} · {formatDate(record.createdAt)}</p></div><span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{record.response.status}</span></div><div className="mt-3 rounded-xl bg-slate-950 p-3 text-xs"><div className="font-semibold text-violet-200">Request</div><div>{record.request.method} {record.request.url}</div><pre className="mt-2 overflow-auto text-slate-400">{JSON.stringify(record.request.headersRedacted, null, 2)}</pre></div><div className="mt-3 rounded-xl bg-slate-950 p-3 text-xs"><div className="font-semibold text-violet-200">Response</div><pre className="mt-2 overflow-auto text-slate-400">{JSON.stringify(record.response.headersRedacted, null, 2)}</pre>{record.bodyPreview ? <p className="mt-2 whitespace-pre-wrap text-slate-300">{record.bodyPreview}</p> : null}</div></article>)}
    </div>
  );
}
