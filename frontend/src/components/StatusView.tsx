interface StatusViewProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "loading" | "error" | "empty" | "success";
}

export default function StatusView({ title, message, actionLabel, onAction, tone = "empty" }: StatusViewProps) {
  const toneClass = tone === "error" ? "border-rose-800 bg-rose-950/40" : tone === "success" ? "border-emerald-800 bg-emerald-950/30" : "border-slate-800 bg-slate-900/70";
  return (
    <div className={`rounded-2xl border p-6 text-center ${toneClass}`} role={tone === "error" ? "alert" : "status"}>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {message ? <p className="mt-2 text-sm text-slate-300">{message}</p> : null}
      {tone === "loading" ? <div className="mx-auto mt-4 h-8 w-8 animate-spin rounded-full border-2 border-rift border-t-transparent" aria-label="Loading" /> : null}
      {actionLabel && onAction ? <button onClick={onAction} className="mt-4 rounded-lg bg-rift px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">{actionLabel}</button> : null}
    </div>
  );
}
