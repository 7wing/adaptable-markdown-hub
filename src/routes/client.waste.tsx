import { createFileRoute } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/waste")({
  component: ClientWaste,
});

function ClientWaste() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { waste } = useAfadhali();
  const myWaste = waste.filter((w) => w.clientId === orgId);

  return (
    <AppShell
      role="client"
      title="YOUR WASTE STREAMS"
      subtitle="What our auditors recorded on site, and where each stream stands"
      actions={
        <div className="flex gap-4">
          <Stat label="Streams" value={String(myWaste.length)} />
          <Stat label="Matched" value={String(myWaste.filter((w) => w.status !== "unmatched").length)} accent />
        </div>
      }
    >
      <Panel title="Recorded streams">
        {myWaste.length === 0 ? (
          <p className="text-sm opacity-50">Nothing recorded yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {myWaste.map((w) => (
              <li key={w.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{w.material}</div>
                    <dl className="mt-2 grid gap-4 font-mono text-[10px] uppercase tracking-widest opacity-40 sm:grid-cols-3">
                      <div>
                        <dt>Volume</dt>
                        <dd className="mt-1 opacity-100">{w.volume}</dd>
                      </div>
                      <div>
                        <dt>Frequency</dt>
                        <dd className="mt-1 opacity-100">{w.frequency}</dd>
                      </div>
                      <div>
                        <dt>Current handling</dt>
                        <dd className="mt-1 opacity-100">{w.handling}</dd>
                      </div>
                    </dl>
                  </div>
                  <Tag tone={w.status === "unmatched" ? "warn" : "ok"}>{w.status}</Tag>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}
