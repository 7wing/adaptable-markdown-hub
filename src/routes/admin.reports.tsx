import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import {
  ActionButton,
  AppShell,
  Field,
  Panel,
  Stat,
  Tag,
  inputClass,
} from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/reports")({
  component: Reports,
});

function Reports() {
  const { reports, clients, audits, waste, matches, addReport, markReportSent } = useAfadhali();
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [previewing, setPreviewing] = useState<string | null>(null);

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
            <Stat
              label="Clients audited"
              value={String(new Set(audits.map((a) => a.clientId)).size)}
            />
            <Stat label="Audits" value={String(audits.length)} />
            <Stat
              label="Matches approved"
              value={String(matches.filter((m) => m.status !== "proposed").length)}
            />
            <Stat
              label="Avg. overall score"
              value={
                audits.length
                  ? String(
                      Math.round(audits.reduce((s, a) => s + a.overallScore, 0) / audits.length),
                    )
                  : "N/A"
              }
            />
          </div>
        </Panel>

        <Panel title="Generate a report">
          <form
            className="flex flex-wrap items-end gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              addReport(
                clientId,
                audits.filter((a) => a.clientId === clientId).map((a) => a.id),
              );
              toast.success("Report generated, preview it before sending");
            }}
          >
            <div className="min-w-[240px]">
              <Field label="Client">
                <select
                  className={inputClass}
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                >
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
            <ul className="divide-y divide-background/10">
              {reports.map((r) => {
                const reportAudits = audits.filter((a) => r.auditIds.includes(a.id));
                return (
                  <li key={r.id} className="py-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px]">
                      <span>
                        {clientName(r.clientId)} · {r.generatedAt} · {r.auditIds.length} audit(s)
                      </span>
                      <div className="flex items-center gap-2">
                        {r.sent ? (
                          <Tag tone="ok">sent</Tag>
                        ) : (
                          <>
                            <Tag tone="warn">not sent</Tag>
                            <ActionButton
                              variant="ghost"
                              onClick={() => setPreviewing(previewing === r.id ? null : r.id)}
                            >
                              {previewing === r.id ? "Close preview" : "Preview"}
                            </ActionButton>
                          </>
                        )}
                      </div>
                    </div>

                    {previewing === r.id ? (
                      <div className="mt-4 border border-background/10 bg-background/5 p-6">
                        <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-ochre">
                          Report preview: {clientName(r.clientId)}
                        </div>
                        {reportAudits.length === 0 ? (
                          <p className="text-sm opacity-50">No audits attached to this report.</p>
                        ) : (
                          <div className="space-y-4">
                            {reportAudits.map((a) => (
                              <div key={a.id} className="border-l-2 border-ochre pl-4">
                                <div className="font-mono text-[10px] uppercase tracking-widest opacity-40">
                                  {a.date} · Overall {a.overallScore}/100
                                </div>
                                <p className="mt-1 text-sm opacity-80">{a.summary}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="mt-6 flex gap-3">
                          <ActionButton
                            onClick={() => {
                              markReportSent(r.id);
                              setPreviewing(null);
                              toast.success("Report marked as sent");
                            }}
                          >
                            Confirm &amp; send
                          </ActionButton>
                          <ActionButton variant="ghost" onClick={() => setPreviewing(null)}>
                            Cancel
                          </ActionButton>
                        </div>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}
