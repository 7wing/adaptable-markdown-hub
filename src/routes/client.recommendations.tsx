import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { ActionButton, AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/recommendations")({
  component: Recommendations,
});

const tone = {
  suggested: "warn",
  quote_requested: "neutral",
  dismissed: "bad",
  completed: "ok",
} as const;

function Recommendations() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { recommendations, partners, quotes, setRecommendationStatus } = useAfadhali();
  const mine = recommendations.filter((r) => r.clientId === orgId);

  return (
    <AppShell
      role="client"
      title="RECOMMENDATIONS"
      subtitle="Efficiency and swap actions ranked by our auditors"
      actions={<Stat label="Open" value={String(mine.filter((r) => r.status === "suggested").length)} accent />}
    >
      <Panel title="Suggested actions">
        {mine.length === 0 ? (
          <p className="text-sm opacity-50">No recommendations yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {mine.map((r) => {
              const partner = partners.find((p) => p.id === r.partnerId);
              const quote = quotes.find((q) => q.recommendationId === r.id);
              return (
                <li key={r.id} className="py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <div className="text-sm font-bold">{r.title}</div>
                      <p className="mt-2 text-xs opacity-60">{r.description}</p>
                      <p className="mt-2 border-l-2 border-ochre pl-3 text-xs opacity-70">{r.benefit}</p>
                      {partner ? (
                        <div className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                          Suggested partner · {partner.company}
                        </div>
                      ) : null}
                      {quote ? (
                        <div className="mt-3 border border-background/10 p-3 font-mono text-[10px] uppercase tracking-widest">
                          Quote · KES {quote.price.toLocaleString()} · {quote.timeline}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Tag tone={tone[r.status]}>{r.status.replace(/_/g, " ")}</Tag>
                      {r.status === "suggested" ? (
                        <>
                          <ActionButton
                            onClick={() => {
                              // TODO(api): POST /quote-requests — notifies the partner
                              setRecommendationStatus(r.id, "quote_requested");
                              toast.success("Quote requested");
                            }}
                          >
                            Request quote
                          </ActionButton>
                          <ActionButton variant="ghost" onClick={() => setRecommendationStatus(r.id, "dismissed")}>
                            Not now
                          </ActionButton>
                        </>
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
