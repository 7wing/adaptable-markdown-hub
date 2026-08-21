import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  const { clients, audits, matches, quotes, leads } = useAfadhali();
  const auditsThisMonth = audits.filter((a) => a.date.startsWith(new Date().toISOString().slice(0, 7)));
  const pendingMatches = matches.filter((m) => m.status === "proposed");
  const pendingQuotes = quotes.filter((q) => q.status === "submitted");

  return (
    <AppShell
      role="admin"
      title="ADMIN OVERVIEW"
      subtitle="Daily state of the audit, match and swap pipeline"
      actions={
        <div className="flex gap-4">
          <Stat label="Clients" value={String(clients.length)} />
          <Stat label="Audits this mo." value={String(auditsThisMonth.length)} accent />
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total clients" value={String(clients.length)} />
          <Stat label="Audits completed" value={String(audits.filter((a) => a.status === "complete").length)} />
          <Stat label="Matches pending" value={String(pendingMatches.length)} accent />
          <Stat label="Quotes to review" value={String(pendingQuotes.length)} accent />
        </div>

        <Panel
          title="Matches awaiting approval"
          actions={
            <Link to="/admin/matches" className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Review →
            </Link>
          }
        >
          {pendingMatches.length === 0 ? (
            <p className="text-sm opacity-50">Nothing waiting. All candidate matches are decided.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {pendingMatches.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-4 py-3">
                  <span className="font-mono text-[11px]">{m.reasoning}</span>
                  <Tag tone="warn">{m.distanceKm} km</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="New leads from the website"
          actions={
            <Link to="/admin/clients" className="font-mono text-[10px] uppercase tracking-widest text-primary">
              Convert →
            </Link>
          }
        >
          {leads.filter((l) => !l.converted).length === 0 ? (
            <p className="text-sm opacity-50">No unconverted leads.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {leads
                .filter((l) => !l.converted)
                .map((lead) => (
                  <li key={lead.id} className="py-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold">{lead.company}</span>
                      <Tag>{lead.sector}</Tag>
                    </div>
                    <p className="mt-1 text-xs opacity-50">{lead.message}</p>
                  </li>
                ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent client activity">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                <th className="py-3">Client</th>
                <th className="py-3">Sector</th>
                <th className="py-3">Audit</th>
                <th className="py-3 text-right">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background/5">
              {clients.map((c) => (
                <tr key={c.id}>
                  <td className="py-3">
                    <Link to="/admin/clients/$clientId" params={{ clientId: c.id }} className="text-primary">
                      {c.company}
                    </Link>
                  </td>
                  <td className="py-3">{c.sector}</td>
                  <td className="py-3">{c.auditStatus.replace("_", " ")}</td>
                  <td className="py-3 text-right">{c.lastActivity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
