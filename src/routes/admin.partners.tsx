import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Stat, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/partners")({
  component: Partners,
});

function Partners() {
  const { partners, quotes, jobs, addPartner, updatePartner } = useAfadhali();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({
    company: "",
    offers: "",
    serviceArea: "",
    contactPerson: "",
    email: "",
  });

  return (
    <AppShell
      role="admin"
      title="PARTNERS"
      subtitle="Recyclers, haulers and clean-energy suppliers"
      actions={
        <div className="flex flex-wrap items-center gap-4">
          <Stat label="Active" value={String(partners.filter((p) => p.status === "active").length)} />
          <ActionButton onClick={() => setAdding((v) => !v)}>{adding ? "Close" : "Add partner"}</ActionButton>
        </div>
      }
    >
      <div className="space-y-6">
        {adding ? (
          <Panel title="New partner">
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(api): POST /partners
                addPartner({
                  company: draft.company,
                  offers: draft.offers.split(",").map((s) => s.trim()).filter(Boolean),
                  serviceArea: draft.serviceArea,
                  contactPerson: draft.contactPerson,
                  email: draft.email,
                  status: "active",
                });
                setAdding(false);
                setDraft({ company: "", offers: "", serviceArea: "", contactPerson: "", email: "" });
                toast.success("Partner added");
              }}
            >
              <Field label="Company">
                <input required className={inputClass} value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} />
              </Field>
              <Field label="Service area">
                <input required className={inputClass} value={draft.serviceArea} onChange={(e) => setDraft({ ...draft, serviceArea: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="What they take or offer (comma separated)">
                  <input required className={inputClass} value={draft.offers} onChange={(e) => setDraft({ ...draft, offers: e.target.value })} />
                </Field>
              </div>
              <Field label="Contact person">
                <input required className={inputClass} value={draft.contactPerson} onChange={(e) => setDraft({ ...draft, contactPerson: e.target.value })} />
              </Field>
              <Field label="Email">
                <input required type="email" className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </Field>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Save partner</ActionButton>
              </div>
            </form>
          </Panel>
        ) : null}

        <Panel title="Partner directory">
          <ul className="divide-y divide-background/10">
            {partners.map((p) => (
              <li key={p.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">{p.company}</div>
                    <div className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
                      {p.serviceArea} · {p.contactPerson} · {p.email}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {p.offers.map((o) => (
                        <Tag key={o}>{o}</Tag>
                      ))}
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                      {quotes.filter((q) => q.partnerId === p.id).length} quote(s) ·{" "}
                      {jobs.filter((j) => j.partnerId === p.id).length} job(s)
                    </div>
                  </div>
                  <ActionButton
                    variant="ghost"
                    onClick={() =>
                      updatePartner(p.id, { status: p.status === "active" ? "inactive" : "active" })
                    }
                  >
                    {p.status === "active" ? "Deactivate" : "Activate"}
                  </ActionButton>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}
