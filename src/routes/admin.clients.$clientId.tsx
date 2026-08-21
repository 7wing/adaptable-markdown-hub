import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Stat, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/clients/$clientId")({
  component: ClientProfile,
});

function ClientProfile() {
  const { clientId } = Route.useParams();
  const { clients, audits, waste, matches, recommendations, reports, updateClient, addReport } =
    useAfadhali();
  const client = clients.find((c) => c.id === clientId);
  const [editing, setEditing] = useState(false);

  if (!client) throw notFound();

  const clientAudits = audits.filter((a) => a.clientId === client.id);
  const clientWaste = waste.filter((w) => w.clientId === client.id);
  const clientWasteIds = clientWaste.map((w) => w.id);
  const clientMatches = matches.filter(
    (m) => clientWasteIds.includes(m.entryAId) || (m.entryBId && clientWasteIds.includes(m.entryBId)),
  );
  const clientRecs = recommendations.filter((r) => r.clientId === client.id);
  const clientReports = reports.filter((r) => r.clientId === client.id);

  return (
    <AppShell
      role="admin"
      title={client.company.toUpperCase()}
      subtitle={`${client.sector} · ${client.location}`}
      actions={
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/audits/new"
            search={{ clientId: client.id }}
            className="bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground"
          >
            Start new audit
          </Link>
          <ActionButton variant="ghost" onClick={() => setEditing((v) => !v)}>
            {editing ? "Close" : "Edit details"}
          </ActionButton>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-4">
          <Stat label="Audits" value={String(clientAudits.length)} />
          <Stat label="Waste streams" value={String(clientWaste.length)} />
          <Stat label="Matches" value={String(clientMatches.length)} accent />
          <Stat
            label="Latest score"
            value={clientAudits[0] ? String(clientAudits[0].overallScore) : "—"}
          />
        </div>

        <Panel title="Company details">
          {editing ? (
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                setEditing(false);
                toast.success("Client details updated");
              }}
            >
              <Field label="Company">
                <input
                  className={inputClass}
                  value={client.company}
                  onChange={(e) => updateClient(client.id, { company: e.target.value })}
                />
              </Field>
              <Field label="Sector">
                <input
                  className={inputClass}
                  value={client.sector}
                  onChange={(e) => updateClient(client.id, { sector: e.target.value })}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={client.location}
                  onChange={(e) => updateClient(client.id, { location: e.target.value })}
                />
              </Field>
              <Field label="Contact person">
                <input
                  className={inputClass}
                  value={client.contactPerson}
                  onChange={(e) => updateClient(client.id, { contactPerson: e.target.value })}
                />
              </Field>
              <Field label="Email">
                <input
                  className={inputClass}
                  value={client.email}
                  onChange={(e) => updateClient(client.id, { email: e.target.value })}
                />
              </Field>
              <Field label="Phone">
                <input
                  className={inputClass}
                  value={client.phone}
                  onChange={(e) => updateClient(client.id, { phone: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Save</ActionButton>
              </div>
            </form>
          ) : (
            <dl className="grid gap-6 font-mono text-[11px] sm:grid-cols-3">
              {[
                ["Contact person", client.contactPerson],
                ["Email", client.email],
                ["Phone", client.phone],
                ["Sector", client.sector],
                ["Location", client.location],
                ["Account status", client.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="mb-1 uppercase tracking-widest opacity-40">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </Panel>

        <Panel title="Audit history">
          {clientAudits.length === 0 ? (
            <p className="text-sm opacity-50">No audits recorded yet.</p>
          ) : (
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Energy</th>
                  <th className="py-3">Waste</th>
                  <th className="py-3 text-right">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                {clientAudits.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3">{a.date}</td>
                    <td className="py-3">
                      <Tag tone={a.status === "complete" ? "ok" : "warn"}>{a.status}</Tag>
                    </td>
                    <td className="py-3">{a.energyScore}</td>
                    <td className="py-3">{a.wasteScore}</td>
                    <td className="py-3 text-right font-bold">{a.overallScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        <Panel title="Waste registry entries">
          {clientWaste.length === 0 ? (
            <p className="text-sm opacity-50">No waste streams recorded.</p>
          ) : (
            <ul className="divide-y divide-background/10">
              {clientWaste.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <div>
                    <div className="text-sm font-bold">{w.material}</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                      {w.volume} · {w.frequency} · {w.handling}
                    </div>
                  </div>
                  <Tag tone={w.status === "unmatched" ? "warn" : "ok"}>{w.status}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Matches and swap recommendations">
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <div className="label-mono mb-3 opacity-40">Matches</div>
              {clientMatches.length === 0 ? (
                <p className="text-sm opacity-50">No matches yet.</p>
              ) : (
                <ul className="space-y-3">
                  {clientMatches.map((m) => (
                    <li key={m.id} className="border border-background/10 p-3">
                      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
                        {m.status.replace(/_/g, " ")} · {m.distanceKm} km
                      </div>
                      <p className="text-xs opacity-70">{m.reasoning}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <div className="label-mono mb-3 opacity-40">Recommendations</div>
              {clientRecs.length === 0 ? (
                <p className="text-sm opacity-50">No recommendations yet.</p>
              ) : (
                <ul className="space-y-3">
                  {clientRecs.map((r) => (
                    <li key={r.id} className="border border-background/10 p-3">
                      <div className="text-sm font-bold">{r.title}</div>
                      <p className="mt-1 text-xs opacity-60">{r.benefit}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Panel>

        <Panel
          title="Reports"
          actions={
            <ActionButton
              variant="ghost"
              onClick={() => {
                addReport(
                  client.id,
                  clientAudits.map((a) => a.id),
                );
                toast.success("Report generated");
              }}
            >
              Generate report
            </ActionButton>
          }
        >
          {clientReports.length === 0 ? (
            <p className="text-sm opacity-50">No reports generated for this client.</p>
          ) : (
            <ul className="divide-y divide-background/10 font-mono text-[11px]">
              {clientReports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-3">
                  <span>
                    {r.generatedAt} · {r.auditIds.length} audit(s)
                  </span>
                  <Tag tone={r.sent ? "ok" : "warn"}>{r.sent ? "sent" : "not sent"}</Tag>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
