import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Tag, inputClass } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/partner/quote")({
  validateSearch: (search: Record<string, unknown>) => ({
    matchId: typeof search["matchId"] === "string" ? (search["matchId"] as string) : undefined,
  }),
  component: QuoteForm,
});

function QuoteForm() {
  const { matchId } = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { matches, waste, clients, quotes, addQuote } = useAfadhali();

  const myRequests = matches.filter((m) => m.partnerId === orgId && m.status !== "rejected");
  const [form, setForm] = useState({
    matchId: matchId ?? myRequests[0]?.id ?? "",
    price: "",
    timeline: "",
    conditions: "",
  });

  const selected = matches.find((m) => m.id === form.matchId);
  const entry = waste.find((w) => w.id === selected?.entryAId);
  const myQuotes = quotes.filter((q) => q.partnerId === orgId);

  return (
    <AppShell
      role="partner"
      title="SUBMIT A QUOTE"
      subtitle="Price, timeline and conditions for a routed request"
    >
      <div className="space-y-6">
        <Panel title="Quote details">
          {myRequests.length === 0 ? (
            <p className="text-sm opacity-50">You have no open requests to quote on.</p>
          ) : (
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (!entry) return;
                // TODO(api): POST /quotes
                addQuote({
                  partnerId: orgId,
                  matchId: form.matchId,
                  clientId: entry.clientId,
                  price: Number(form.price) || 0,
                  timeline: form.timeline,
                  conditions: form.conditions,
                });
                toast.success("Quote submitted to Afadhali");
                navigate({ to: "/partner/requests" });
              }}
            >
              <Field label="Request">
                <select
                  className={inputClass}
                  value={form.matchId}
                  onChange={(e) => setForm({ ...form, matchId: e.target.value })}
                >
                  {myRequests.map((m) => {
                    const we = waste.find((w) => w.id === m.entryAId);
                    const company = clients.find((c) => c.id === we?.clientId)?.company ?? "Client";
                    return (
                      <option key={m.id} value={m.id}>
                        {we?.material ?? "Material"} · {company}
                      </option>
                    );
                  })}
                </select>
              </Field>
              <Field label="Price (KES)">
                <input
                  required
                  type="number"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </Field>
              <Field label="Timeline">
                <input
                  required
                  className={inputClass}
                  placeholder="Collection within 5 working days"
                  value={form.timeline}
                  onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                />
              </Field>
              <Field label="Conditions">
                <input
                  className={inputClass}
                  placeholder="Material must be dry and separated"
                  value={form.conditions}
                  onChange={(e) => setForm({ ...form, conditions: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Submit quote</ActionButton>
              </div>
            </form>
          )}
        </Panel>

        <Panel title="Your submitted quotes">
          {myQuotes.length === 0 ? (
            <p className="text-sm opacity-50">No quotes submitted yet.</p>
          ) : (
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-3">Client</th>
                  <th className="py-3">Price</th>
                  <th className="py-3">Timeline</th>
                  <th className="py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                {myQuotes.map((q) => (
                  <tr key={q.id}>
                    <td className="py-3">{clients.find((c) => c.id === q.clientId)?.company ?? "Client"}</td>
                    <td className="py-3">KES {q.price.toLocaleString()}</td>
                    <td className="py-3">{q.timeline}</td>
                    <td className="py-3 text-right">
                      <Tag tone={q.status === "accepted" ? "ok" : q.status === "declined" ? "bad" : "warn"}>
                        {q.status}
                      </Tag>
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
