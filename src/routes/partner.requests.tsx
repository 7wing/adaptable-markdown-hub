import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/partner/requests")({
  component: Requests,
});

type RequestItem = {
  key: string;
  kind: "Match" | "Recommendation";
  title: string;
  clientName: string;
  detail: string;
  quoted: boolean;
  linkSearch: { matchId: string | undefined; recommendationId: string | undefined };
};

function Requests() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { matches, waste, clients, quotes, recommendations } = useAfadhali();

  const clientName = (id?: string) => clients.find((c) => c.id === id)?.company ?? "Client";

  const matchItems: RequestItem[] = matches
    .filter((m) => m.partnerId === orgId && m.status !== "rejected")
    .map((m) => {
      const e = waste.find((w) => w.id === m.entryAId);
      return {
        key: `match:${m.id}`,
        kind: "Match",
        title: e?.material ?? "Material",
        clientName: clientName(e?.clientId),
        detail: `${e?.volume ?? "N/A"} · ${e?.frequency ?? "N/A"} · ${m.distanceKm} km · ${m.reasoning}`,
        quoted: quotes.some((q) => q.partnerId === orgId && q.matchId === m.id),
        linkSearch: { matchId: m.id, recommendationId: undefined },
      };
    });

  const recommendationItems: RequestItem[] = recommendations
    .filter((r) => r.partnerId === orgId && r.status === "quote_requested")
    .map((r) => ({
      key: `rec:${r.id}`,
      kind: "Recommendation",
      title: r.title,
      clientName: clientName(r.clientId),
      detail: `${r.description}, ${r.benefit}`,
      quoted: quotes.some((q) => q.partnerId === orgId && q.recommendationId === r.id),
      linkSearch: { matchId: undefined, recommendationId: r.id },
    }));

  const allItems = [...matchItems, ...recommendationItems];

  return (
    <AppShell
      role="partner"
      title="REQUESTS"
      subtitle="Everything routed to you: material matches and client-requested recommendations"
      actions={<Stat label="Open" value={String(allItems.length)} accent />}
    >
      <Panel title="Incoming requests">
        {allItems.length === 0 ? (
          <p className="text-sm opacity-50">No requests routed to you yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {allItems.map((item) => (
              <li key={item.key} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone={item.kind === "Match" ? "neutral" : "warn"}>{item.kind}</Tag>
                      <span className="text-sm font-bold">
                        {item.title} <span className="opacity-40">· {item.clientName}</span>
                      </span>
                    </div>
                    <p className="mt-3 text-xs opacity-60">{item.detail}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={item.quoted ? "ok" : "warn"}>
                      {item.quoted ? "quoted" : "awaiting quote"}
                    </Tag>
                    {!item.quoted ? (
                      <Link
                        to="/partner/quote"
                        search={item.linkSearch}
                        className="bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground"
                      >
                        Submit quote
                      </Link>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}
