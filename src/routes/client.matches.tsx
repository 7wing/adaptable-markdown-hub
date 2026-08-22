import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import { ActionButton, AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/matches")({
  component: ClientMatches,
});

function ClientMatches() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { waste, matches, partners, setMatchStatus } = useAfadhali();

  const myWasteIds = waste.filter((w) => w.clientId === orgId).map((w) => w.id);
  const visible = matches.filter(
    (m) =>
      (myWasteIds.includes(m.entryAId) || (m.entryBId && myWasteIds.includes(m.entryBId))) &&
      m.status !== "proposed" &&
      m.status !== "rejected",
  );
  const materialOf = (id?: string) => (id ? (waste.find((w) => w.id === id)?.material ?? "—") : "—");

  return (
    <AppShell
      role="client"
      title="MATCHES"
      subtitle="Reuse and offtake options our team approved for your materials"
      actions={
        <Stat
          label="Awaiting your decision"
          value={String(visible.filter((m) => m.status === "approved").length)}
          accent
        />
      }
    >
      <Panel title="Approved options">
        {visible.length === 0 ? (
          <p className="text-sm opacity-50">Nothing shared with you yet. We publish matches once verified.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {visible.map((m) => (
              <li key={m.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="text-sm font-bold">
                      {materialOf(m.entryAId)}
                      <span className="mx-2 text-ochre">→</span>
                      {m.partnerId
                        ? (partners.find((p) => p.id === m.partnerId)?.company ?? "Partner")
                        : materialOf(m.entryBId)}
                    </div>
                    <p className="mt-2 text-xs opacity-60">{m.reasoning}</p>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                      {m.distanceKm} km from your site
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={m.status === "accepted_by_client" ? "ok" : m.status === "declined_by_client" ? "bad" : "warn"}>
                      {m.status.replace(/_/g, " ")}
                    </Tag>
                    {m.status === "approved" ? (
                      <>
                        <ActionButton
                          onClick={() => {
                            setMatchStatus(m.id, "accepted_by_client");
                            toast.success("Accepted — we will coordinate the pickup");
                          }}
                        >
                          Accept
                        </ActionButton>
                        <ActionButton variant="ghost" onClick={() => setMatchStatus(m.id, "declined_by_client")}>
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
