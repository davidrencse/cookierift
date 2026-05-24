import AuthorizationBanner from "./AuthorizationBanner";

interface HeaderProps {
  onNavigate: (path: string) => void;
  authorized: boolean;
}

export default function Header({ onNavigate, authorized }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <button onClick={() => onNavigate(authorized ? "/assessments" : "/")} className="text-left" aria-label="CookieRift home">
          <div className="text-xl font-black tracking-tight text-white">CookieRift</div>
          <div className="text-xs text-slate-400">Session handling assessment workspace</div>
        </button>
        <nav className="flex items-center gap-2 text-sm">
          <button onClick={() => onNavigate("/")} className="rounded-lg px-3 py-2 text-slate-200 hover:bg-slate-800">Authorization</button>
          {authorized ? <button onClick={() => onNavigate("/assessments")} className="rounded-lg bg-rift px-3 py-2 font-semibold text-white hover:bg-violet-500">Assessments</button> : null}
        </nav>
      </div>
      <AuthorizationBanner />
    </header>
  );
}
