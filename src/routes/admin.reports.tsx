import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Stat, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const { reports, clients, audits, waste, matches, addReport, markReportSent } = useAfadhali();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");

  const clientName = (id: string) => clients.find((c) => c.id === id)?.company ?? "Unknown";
  const diverted = waste.filter((w) => w.status !== "unmatched").length;

  return (
    <AppShell
      role="admin"
      title="REPORTS"
      subtitle="Client-facing audit reports and programme totals"
      actions={
        <div className="flex gap-4">
          <Stat label="Reports" value={String(reports.length)} />
          <Stat label="Streams diverted" value={String(diverted)} accent />
        </div>
      }
    >
      <div className="space-y-6">
        <Panel title="Programme totals">
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Clients audited" value={String(new Set(audits.map((a) => a.clientId)).size)} />
            <Stat label="Audits" value={String(audits.length)} />
            <Stat label="Matches approved" value={String(matches.filter((m) => m.status !== "proposed").length)} />
            <Stat
              label="Avg. overall score"
              value={
                audits.length
                  ? String(Math.round(audits.reduce((s, a) => s + a.overallScore, 0) / audits.length))
                  : "—"
              }
            />
          </div>
        </Panel>

        <Panel title="Generate a report">
          <form
            className="flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO(api): POST /reports — render the PDF server-side
              addReport(
                clientId,
                audits.filter((a) => a.clientId === clientId).map((a) => a.id),
              );
              toast.success("Report generated");
            }}
          >
            <div className="min-w-[240px]">
              <Field label="Client">
                <select className={inputClass} value={clientId} onChange={(e) => setClientId(e.target.value)}>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <ActionButton type="submit">Generate</ActionButton>
          </form>
        </Panel>

        <Panel title="Report archive">
          {reports.length === 0 ? (
            <p className="text-sm opacity-50">No reports yet.</p>
          ) : (
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-3">Client</th>
                  <th className="py-3">Generated</th>
                  <th className="py-3">Audits</th>
                  <th className="py-3 text-right">Delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                {reports.map((r) => (
                  <tr key={r.id}>
                    <td className="py-3">{clientName(r.clientId)}</td>
                    <td className="py-3">{r.generatedAt}</td>
                    <td className="py-3">{r.auditIds.length}</td>
                    <td className="py-3 text-right">
                      {r.sent ? (
                        <Tag tone="ok">sent</Tag>
                      ) : (
                        <button
                          className="uppercase tracking-widest text-primary"
                          onClick={() => {
                            // TODO(email): send via your transactional email provider
                            markReportSent(r.id);
                            toast.success("Report emailed to the client");
                          }}
                        >
                          Send to client
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
