import { Outlet, createFileRoute } from "@tanstack/react-router";

import { RequireRole } from "@/components/platform/RequireRole";

export const Route = createFileRoute("/partner")({
  head: () => ({
    meta: [
      { title: "Partner portal — Afadhali" },
      {
        name: "description",
        content: "Incoming material requests, quotes and scheduled collection jobs for Afadhali partners.",
      },
      { property: "og:title", content: "Afadhali partner portal" },
      { property: "og:description", content: "Respond to requests, submit quotes and track jobs." },
    ],
  }),
  component: PartnerLayout,
});

function PartnerLayout() {
  return (
    <RequireRole role="partner">
      <Outlet />
    </RequireRole>
  );
}
