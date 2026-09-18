import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { ActionButton, AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/quotes")({
  component: Quotes,
});

function Quotes() {
  const {
    quotes,
    clients,
    partners,
    matches,
    recommendations,
    acceptQuoteAndCreateJob,
    setQuoteStatus,
  } = useAfadhali();

  const clientName = (id: string) => clients.find((c) => c.id === id)?.company ?? "Client";
  const partnerName = (id: string) => partners.find((p) => p.id === id)?.company ?? "Partner";

  const descriptionFor = (quoteId: string) => {
    const q = quotes.find((x) => x.id === quoteId);
    if (!q) return "Scheduled work";
    if (q.recommendationId) {
      return recommendations.find((r) => r.id === q.recommendationId)?.title ?? "Scheduled work";
    }
    if (q.matchId) {
      return matches.find((m) => m.id === q.matchId)?.reasoning ?? "Scheduled collection";
    }
    return "Scheduled work";
  };

  const pending = quotes.filter((q) => q.status === "submitted");

  return (
    <AppShell
      role="admin"
      title="QUOTES"
      subtitle="Partner quotes waiting on a decision"
      actions={<Stat label="Pending" value={String(pending.length)} accent />}
    >
      <Panel title="All quotes">
        {quotes.length === 0 ? (
          <p className="text-sm opacity-50">No quotes submitted yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {quotes.map((q) => (
              <li key={q.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">
                      {clientName(q.clientId)}{" "}
                      <span className="opacity-40">· {partnerName(q.partnerId)}</span>
                    </div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
                      KES {q.price.toLocaleString()} · {q.timeline}
                    </div>
                    {q.conditions ? (
                      <p className="mt-2 text-xs opacity-60">{q.conditions}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag
                      tone={
                        q.status === "accepted" ? "ok" : q.status === "declined" ? "bad" : "warn"
                      }
                    >
                      {q.status}
                    </Tag>
                    {q.status === "submitted" ? (
                      <>
                        <ActionButton
                          onClick={async () => {
                            await acceptQuoteAndCreateJob(q.id, descriptionFor(q.id));
                            toast.success("Quote accepted, job created");
                          }}
                        >
                          Accept
                        </ActionButton>
                        <ActionButton
                          variant="ghost"
                          onClick={async () => {
                            await setQuoteStatus(q.id, "declined");
                            toast.success("Quote declined");
                          }}
                        >
                          Decline
                        </ActionButton>
                      </>
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
