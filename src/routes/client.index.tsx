import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/")({
  component: ClientHome,
});

function ClientHome() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { clients, audits, waste, matches, recommendations, reports } = useAfadhali();

  const client = clients.find((c) => c.id === orgId);
  const myAudits = audits.filter((a) => a.clientId === orgId);
  const latest = myAudits[0];
  const myWaste = waste.filter((w) => w.clientId === orgId);
  const myWasteIds = myWaste.map((w) => w.id);
  const myMatches = matches.filter(
    (m) =>
      (myWasteIds.includes(m.entryAId) || (m.entryBId && myWasteIds.includes(m.entryBId))) &&
      m.status !== "proposed" &&
      m.status !== "rejected",
  );
  const openRecs = recommendations.filter((r) => r.clientId === orgId && r.status === "suggested");
  const myReports = reports.filter((r) => r.clientId === orgId);

  return (
    <AppShell
      role="client"
      title={(client?.company ?? "YOUR SITE").toUpperCase()}
      subtitle={client ? `${client.sector} · ${client.location}` : "Waiting for your first audit"}
      actions={<Stat label="Overall score" value={latest ? String(latest.overallScore) : "—"} accent />}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Audits" value={String(myAudits.length)} />
          <Stat label="Waste streams" value={String(myWaste.length)} />
          <Stat label="Live matches" value={String(myMatches.length)} accent />
          <Stat label="Open actions" value={String(openRecs.length)} />
        </div>

        <Panel
          title="Latest audit summary"
          actions={
            <Link to="/client/scorecard" className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Full scorecard →
            </Link>
          }
        >
          {latest ? (
            <div>
              <div className="mb-4 flex flex-wrap gap-4">
                <Stat label="Energy" value={String(latest.energyScore)} />
                <Stat label="Waste" value={String(latest.wasteScore)} />
                <Stat label="Overall" value={String(latest.overallScore)} accent />
              </div>
              <p className="max-w-2xl text-sm opacity-70">{latest.summary}</p>
            </div>
          ) : (
            <p className="text-sm opacity-50">
              Your audit has not been recorded yet. Our team will publish results here after the site visit.
            </p>
          )}
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel
            title="Matches for your materials"
            actions={
              <Link to="/client/matches" className="font-mono text-[10px] uppercase tracking-widest text-primary">
                Review →
              </Link>
            }
          >
            {myMatches.length === 0 ? (
              <p className="text-sm opacity-50">No matches shared with you yet.</p>
            ) : (
              <ul className="divide-y divide-background/10">
                {myMatches.slice(0, 4).map((m) => (
                  <li key={m.id} className="py-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs opacity-70">{m.reasoning}</span>
                      <Tag tone={m.status === "accepted_by_client" ? "ok" : "warn"}>
                        {m.status.replace(/_/g, " ")}
                      </Tag>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recommended next steps"
            actions={
              <Link
                to="/client/recommendations"
                className="font-mono text-[10px] uppercase tracking-widest text-primary"
              >
                All actions →
              </Link>
            }
          >
            {openRecs.length === 0 ? (
              <p className="text-sm opacity-50">Nothing outstanding.</p>
            ) : (
              <ul className="divide-y divide-background/10">
                {openRecs.slice(0, 4).map((r) => (
                  <li key={r.id} className="py-3">
                    <div className="text-sm font-bold">{r.title}</div>
                    <p className="mt-1 text-xs opacity-60">{r.benefit}</p>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <Panel title="Your reports">
          {myReports.length === 0 ? (
            <p className="text-sm opacity-50">No reports issued yet.</p>
          ) : (
            <ul className="divide-y divide-background/10 font-mono text-[11px]">
              {myReports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <span>Audit report · {r.generatedAt}</span>
                  <Tag tone={r.sent ? "ok" : "warn"}>{r.sent ? "available" : "in preparation"}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
