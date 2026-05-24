import type { AssessmentSummary } from "../types";
import { formatDate, statusClass } from "../utils/formatters";
import StatusView from "./StatusView";

interface Props {
  items: AssessmentSummary[];
  onOpen: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
}

export default function AssessmentList({ items, onOpen, onDelete }: Props) {
  if (items.length === 0) return <StatusView title="No assessments yet" message="Create an assessment with a permitted target URL and authorization reference." />;
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/70">
      <div className="grid grid-cols-12 border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <div className="col-span-5">Target</div><div className="col-span-2">Status</div><div className="col-span-2">Findings</div><div className="col-span-2">Updated</div><div className="col-span-1 text-right">Actions</div>
      </div>
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-12 items-center gap-2 border-b border-slate-800/70 px-4 py-4 last:border-0">
          <button onClick={() => onOpen(item.id)} className="col-span-5 text-left"><div className="font-semibold text-white hover:text-violet-200">{item.name}</div><div className="text-xs text-slate-400">{item.baseUrl}</div></button>
          <div className="col-span-2"><span className={`rounded-full border px-2 py-1 text-xs ${statusClass(item.status)}`}>{item.status}</span></div>
          <div className="col-span-2 text-sm text-slate-200">{item.findingCount}</div>
          <div className="col-span-2 text-xs text-slate-400">{formatDate(item.updatedAt)}</div>
          <div className="col-span-1 text-right"><button onClick={() => void onDelete(item.id)} className="rounded-lg px-2 py-1 text-xs text-rose-300 hover:bg-rose-950">Delete</button></div>
        </div>
      ))}
    </div>
  );
}
