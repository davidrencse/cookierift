import StatusView from "../components/StatusView";

export default function NotFoundPage({ onNavigate }: { onNavigate: (path: string) => void }) {
  return <main className="mx-auto max-w-4xl px-4 py-12"><StatusView title="Page not found" message="The requested CookieRift route does not exist." actionLabel="Go to assessments" onAction={() => onNavigate("/assessments")} /></main>;
}
