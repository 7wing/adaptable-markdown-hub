import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RequireRole } from "@/components/platform/RequireRole";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Client portal — Afadhali" },
      {
        name: "description",
        content: "Your audit scorecard, waste streams, matches and recommendations in one place.",
      },
      { property: "og:title", content: "Afadhali client portal" },
      { property: "og:description", content: "Track your audit results, matches and next actions." },
    ],
  }),
  component: ClientLayout,
});

function ClientLayout() {
  return (
    <RequireRole role="client">
      <Outlet />
    </RequireRole>
  );
}
