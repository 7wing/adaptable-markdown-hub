import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/clients/")({
  component: ClientList,
});

const statusTone = {
  not_started: "neutral",
  in_progress: "warn",
  completed: "ok",
} as const;

function ClientList() {
  const { clients, leads, addClient, updateClient } = useAfadhali();
  const [query, setQuery] = useState("");
  const [sector, setSector] = useState("all");
  const [status, setStatus] = useState("all");
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    company: "",
    sector: "",
    location: "",
    contactPerson: "",
    email: "",
    phone: "",
  });

  const sectors = useMemo(() => Array.from(new Set(clients.map((c) => c.sector))), [clients]);
  const filtered = clients.filter(
    (c) =>
      (sector === "all" || c.sector === sector) &&
      (status === "all" || c.auditStatus === status) &&
      (c.company.toLowerCase().includes(query.toLowerCase()) ||
        c.location.toLowerCase().includes(query.toLowerCase())),
  );

  return (
    <AppShell
      role="admin"
      title="CLIENTS"
      subtitle={`${clients.length} businesses on the register`}
      actions={<ActionButton onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "Add client"}</ActionButton>}
    >
      <div className="space-y-6">
        {adding ? (
          <Panel title="New client record">
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(api): POST /clients
                addClient({ ...draft, status: "active", auditStatus: "not_started" });
                setAdding(false);
                setDraft({ company: "", sector: "", location: "", contactPerson: "", email: "", phone: "" });
                toast.success("Client added");
              }}
            >
              <Field label="Company">
                <input required className={inputClass} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
              </Field>
              <Field label="Sector">
                <input required className={inputClass} value={draft.sector} onChange={(e) => setDraft({ ...draft, sector: e.target.value })} />
              </Field>
              <Field label="Location">
                <input required className={inputClass} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} />
              </Field>
              <Field label="Contact person">
                <input required className={inputClass} value={draft.contactPerson} onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })} />
              </Field>
              <Field label="Email">
                <input required type="email" className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </Field>
              <Field label="Phone">
                <input className={inputClass} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Save client</ActionButton>
              </div>
            </form>
          </Panel>
        ) : null}

        {leads.filter((l) => !l.converted).length > 0 ? (
          <Panel title="Leads from the contact form">
            <ul className="divide-y divide-background/10">
              {leads
                .filter((l) => !l.converted)
                .map((lead) => (
                  <li key={lead.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                    <div>
                      <div className="text-sm font-bold">
                        {lead.company} <span className="opacity-40">· {lead.name}</span>
                      </div>
                      <div className="mt-1 text-xs opacity-50">{lead.message}</div>
                    </div>
                    <ActionButton
                      variant="ghost"
                      onClick={() => {
                        addClient({
                          company: lead.company,
                          sector: lead.sector,
                          location: "—",
                          contactPerson: lead.name,
                          email: "—",
                          phone: "—",
                          status: "active",
                          auditStatus: "not_started",
                        });
                        toast.success("Lead converted to client");
                      }}
                    >
                      Convert to client
                    </ActionButton>
                  </li>
                ))}
            </ul>
          </Panel>
        ) : null}

        <Panel title="Client register">
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Field label="Search">
              <input className={inputClass} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Company or town" />
            </Field>
            <Field label="Sector">
              <select className={inputClass} value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="all">All sectors</option>
                {sectors.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Audit status">
              <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="all">Any status</option>
                <option value="not_started">Not started</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </Field>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-3">Company</th>
                  <th className="py-3">Sector</th>
                  <th className="py-3">Audit status</th>
                  <th className="py-3">Last activity</th>
                  <th className="py-3 text-right">Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                {filtered.map((c) => (
                  <tr key={c.id}>
                    <td className="py-3">
                      <Link to="/admin/clients/$clientId" params={{ clientId: c.id }} className="text-primary">
                        {c.company}
                      </Link>
                    </td>
                    <td className="py-3">{c.sector}</td>
                    <td className="py-3">
                      <Tag tone={statusTone[c.auditStatus]}>{c.auditStatus.replace("_", " ")}</Tag>
                    </td>
                    <td className="py-3">{c.lastActivity}</td>
                    <td className="py-3 text-right">
                      <button
                        className="uppercase tracking-widest hover:text-primary"
                        onClick={() =>
                          updateClient(c.id, { status: c.status === "active" ? "inactive" : "active" })
                        }
                      >
                        {c.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 ? (
              <p className="py-6 text-sm opacity-50">No clients match those filters.</p>
            ) : null}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
