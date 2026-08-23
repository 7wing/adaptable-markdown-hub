import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/partner/requests")({
  component: Requests,
});

function Requests() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { matches, waste, clients, quotes } = useAfadhali();

  const myRequests = matches.filter((m) => m.partnerId === orgId && m.status !== "rejected");
  const entry = (id: string) => waste.find((w) => w.id === id);
  const clientName = (id?: string) => clients.find((c) => c.id === id)?.company ?? "Client";

  return (
    <AppShell
      role="partner"
      title="MATERIAL REQUESTS"
      subtitle="Streams Afadhali routed to you, with volumes and locations"
      actions={<Stat label="Open" value={String(myRequests.length)} accent />}
    >
      <Panel title="Incoming requests">
        {myRequests.length === 0 ? (
          <p className="text-sm opacity-50">No requests routed to you yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {myRequests.map((m) => {
              const e = entry(m.entryAId);
              const quoted = quotes.some((q) => q.partnerId === orgId && q.matchId === m.id);
              return (
                <li key={m.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <div className="text-sm font-bold">
                        {e?.material ?? "Material"}{" "}
                        <span className="opacity-40">· {clientName(e?.clientId)}</span>
                      </div>
                      <dl className="mt-2 grid gap-4 font-mono text-[10px] uppercase tracking-widest opacity-40 sm:grid-cols-3">
                        <div>
                          <dt>Volume</dt>
                          <dd className="mt-1 opacity-100">{e?.volume ?? "—"}</dd>
                        </div>
                        <div>
                          <dt>Frequency</dt>
                          <dd className="mt-1 opacity-100">{e?.frequency ?? "—"}</dd>
                        </div>
                        <div>
                          <dt>Distance</dt>
                          <dd className="mt-1 opacity-100">{m.distanceKm} km</dd>
                        </div>
                      </dl>
                      <p className="mt-3 text-xs opacity-60">{m.reasoning}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone={quoted ? "ok" : "warn"}>{quoted ? "quoted" : "awaiting quote"}</Tag>
                      {!quoted ? (
                        <Link
                          to="/partner/quote"
                          search={{ matchId: m.id }}
                          className="bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground"
                        >
                          Submit quote
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}
