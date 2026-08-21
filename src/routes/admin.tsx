import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RequireRole } from "@/components/platform/RequireRole";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin platform — Afadhali" },
      {
        name: "description",
        content: "Afadhali staff workspace: clients, audits, waste registry, matches and reports.",
      },
      { property: "og:title", content: "Afadhali admin platform" },
      { property: "og:description", content: "Staff workspace for audits, matching and delivery." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <RequireRole role="admin">
      <Outlet />
    </RequireRole>
  );
}
