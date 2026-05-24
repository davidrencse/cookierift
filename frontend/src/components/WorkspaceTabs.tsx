export type WorkspaceTab = "target" | "flow" | "cookies" | "tokens" | "replay" | "headers" | "timeline" | "findings" | "evidence" | "report";

const tabs: { id: WorkspaceTab; label: string }[] = [
  { id: "target", label: "Target config" },
  { id: "flow", label: "Flow map" },
  { id: "cookies", label: "Cookies" },
  { id: "tokens", label: "Tokens" },
  { id: "replay", label: "Replay" },
  { id: "headers", label: "Headers" },
  { id: "timeline", label: "Timeline" },
  { id: "findings", label: "Findings" },
  { id: "evidence", label: "Evidence" },
  { id: "report", label: "Report" }
];

interface Props { active: WorkspaceTab; onChange: (tab: WorkspaceTab) => void; }

export default function WorkspaceTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-2">
      {tabs.map((tab) => <button key={tab.id} onClick={() => onChange(tab.id)} className={`whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium ${active === tab.id ? "bg-rift text-white" : "text-slate-300 hover:bg-slate-800"}`}>{tab.label}</button>)}
    </div>
  );
}
