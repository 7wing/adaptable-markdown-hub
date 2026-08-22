import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/partner/")({
  component: PartnerHome,
});

function PartnerHome() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { partners, matches, quotes, jobs, clients } = useAfadhali();
  const partner = partners.find((p) => p.id === orgId);

  const myRequests = matches.filter((m) => m.partnerId === orgId && m.status !== "rejected");
  const myQuotes = quotes.filter((q) => q.partnerId === orgId);
  const myJobs = jobs.filter((j) => j.partnerId === orgId);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.company ?? "Client";

  return (
    <AppShell
      role="partner"
      title={(partner?.company ?? "PARTNER").toUpperCase()}
      subtitle={partner ? `${partner.serviceArea} · ${partner.offers.join(", ")}` : "Partner workspace"}
      actions={<Stat label="Open requests" value={String(myRequests.length)} accent />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Requests" value={String(myRequests.length)} />
          <Stat label="Quotes submitted" value={String(myQuotes.length)} />
          <Stat label="Quotes accepted" value={String(myQuotes.filter((q) => q.status === "accepted").length)} accent />
          <Stat label="Jobs in progress" value={String(myJobs.filter((j) => j.status !== "completed").length)} />
        </div>

        <Panel
          title="Latest material requests"
          actions={
            <Link to="/partner/requests" className="font-mono text-[10px] uppercase tracking-widest text-primary">
              All requests →
            </Link>
          }
        >
          {myRequests.length === 0 ? (
            <p className="text-sm opacity-50">No requests routed to you yet.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {myRequests.slice(0, 4).map((m) => (
                <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span className="text-xs opacity-70">{m.reasoning}</span>
                  <Tag tone="warn">{m.distanceKm} km</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Scheduled jobs"
          actions={
            <Link to="/partner/jobs" className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Manage →
            </Link>
          }
        >
          {myJobs.length === 0 ? (
            <p className="text-sm opacity-50">Nothing scheduled.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {myJobs.map((j) => (
                <li key={j.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <span className="text-xs opacity-70">
                    {clientName(j.clientId)} · {j.description}
                  </span>
                  <Tag tone={j.status === "completed" ? "ok" : "warn"}>{j.status.replace("_", " ")}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
