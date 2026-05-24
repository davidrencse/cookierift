import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import AssessmentsPage from "./pages/AssessmentsPage";
import AssessmentWorkspacePage from "./pages/AssessmentWorkspacePage";
import AuthorizedUsePage from "./pages/AuthorizedUsePage";
import NotFoundPage from "./pages/NotFoundPage";
import ReportPreviewPage from "./pages/ReportPreviewPage";

const STORAGE_KEY = "cookierift.authorizedUseAcceptedAt";
const BASE = "/cookierift";

function normalizePath(pathname: string): string {
  const stripped = pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return stripped || "/";
}

export default function App() {
  const [path, setPath] = useState(() => normalizePath(window.location.pathname));
  const [acceptedAt, setAcceptedAt] = useState<string | null>(() => window.localStorage.getItem(STORAGE_KEY));
  const authorized = Boolean(acceptedAt);

  function navigate(nextPath: string) {
    const clean = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
    window.history.pushState({}, "", `${BASE}${clean}`);
    setPath(clean);
  }

  useEffect(() => {
    const handler = () => setPath(normalizePath(window.location.pathname));
    window.addEventListener("popstate", handler);
    return () => window.removeEventListener("popstate", handler);
  }, []);

  function accept(value: string) {
    window.localStorage.setItem(STORAGE_KEY, value);
    setAcceptedAt(value);
    navigate("/assessments");
  }

  const route = useMemo(() => {
    if (!authorized && path !== "/") return <AuthorizedUsePage onAccepted={accept} />;
    if (path === "/") return <AuthorizedUsePage onAccepted={accept} />;
    if (path === "/assessments") return <AssessmentsPage onNavigate={navigate} />;
    const reportMatch = path.match(/^\/assessments\/([^/]+)\/report$/);
    if (reportMatch) return <ReportPreviewPage assessmentId={decodeURIComponent(reportMatch[1])} onNavigate={navigate} />;
    const workspaceMatch = path.match(/^\/assessments\/([^/]+)$/);
    if (workspaceMatch) return <AssessmentWorkspacePage assessmentId={decodeURIComponent(workspaceMatch[1])} onNavigate={navigate} />;
    return <NotFoundPage onNavigate={navigate} />;
  }, [path, authorized]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.22),transparent_35%),#020617]">
      <Header onNavigate={navigate} authorized={authorized} />
      {route}
    </div>
  );
}
