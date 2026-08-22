import { createFileRoute } from "@tanstack/react-router";

import { AppShell, Panel, Stat, Tag } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/scorecard")({
  component: Scorecard,
});

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-widest opacity-50">
        <span>{label}</span>
        <span>{value}/100</span>
      </div>
      <div className="h-3 w-full bg-background/10">
        <div className="h-3 bg-ochre" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function Scorecard() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { audits, reports } = useAfadhali();
  const myAudits = audits.filter((a) => a.clientId === orgId);
  const latest = myAudits[0];
  const myReports = reports.filter((r) => r.clientId === orgId);

  return (
    <AppShell role="client" title="AUDIT SCORECARD" subtitle="How your site scores, and why">
      {!latest ? (
        <Panel title="No audit yet">
          <p className="text-sm opacity-50">Your scorecard appears here once your audit is completed.</p>
        </Panel>
      ) : (
        <div className="space-y-6">
          <Panel title={`Audit of ${latest.date}`}>
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <Bar label="Energy efficiency" value={latest.energyScore} />
                <Bar label="Waste management" value={latest.wasteScore} />
                <Bar label="Overall" value={latest.overallScore} />
              </div>
              <div className="space-y-4 font-mono text-[11px]">
                <div>
                  <div className="mb-1 uppercase tracking-widest opacity-40">Energy source</div>
                  <div>{latest.energySource}</div>
                </div>
                <div>
                  <div className="mb-1 uppercase tracking-widest opacity-40">Monthly energy cost</div>
                  <div>KES {latest.energyCostMonthly.toLocaleString()}</div>
                </div>
                <div>
                  <div className="mb-1 uppercase tracking-widest opacity-40">Equipment notes</div>
                  <div className="opacity-70">{latest.machineNotes}</div>
                </div>
                <div>
                  <div className="mb-1 uppercase tracking-widest opacity-40">Water use</div>
                  <div className="opacity-70">{latest.waterUseNotes}</div>
                </div>
              </div>
            </div>
            <p className="mt-8 max-w-3xl border-l-2 border-ochre pl-4 text-sm opacity-70">{latest.summary}</p>
          </Panel>

          <Panel title="Score history">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-3">Date</th>
                  <th className="py-3">Energy</th>
                  <th className="py-3">Waste</th>
                  <th className="py-3 text-right">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                {myAudits.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3">{a.date}</td>
                    <td className="py-3">{a.energyScore}</td>
                    <td className="py-3">{a.wasteScore}</td>
                    <td className="py-3 text-right font-bold">{a.overallScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>

          <Panel title="Downloadable reports">
            {myReports.length === 0 ? (
              <p className="text-sm opacity-50">No reports issued yet.</p>
            ) : (
              <ul className="divide-y divide-background/10 font-mono text-[11px]">
                {myReports.map((r) => (
                  <li key={r.id} className="flex items-center justify-between py-3">
                    <span>Audit report · {r.generatedAt}</span>
                    {/* TODO(api): link to the generated PDF returned by your backend */}
                    <Tag tone={r.sent ? "ok" : "warn"}>{r.sent ? "available" : "in preparation"}</Tag>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      )}
    </AppShell>
  );
}
