import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";
import type { Role } from "@/lib/afadhali/types";

export const Route = createFileRoute("/admin/users")({
  component: Users,
});

function Users() {
  const { users, clients, partners, addUser, updateUser } = useAfadhali();
  const [inviting, setInviting] = useState(false);
  const [draft, setDraft] = useState<{ name: string; email: string; role: Role; organisationId: string }>({
    name: "",
    email: "",
    role: "client",
    organisationId: "",
  });

  const orgOptions =
    draft.role === "client"
      ? clients.map((c) => ({ id: c.id, name: c.company }))
      : draft.role === "partner"
        ? partners.map((p) => ({ id: p.id, name: p.company }))
        : [];

  return (
    <AppShell
      role="admin"
      title="USERS & ACCESS"
      subtitle="Who can sign in, and which portal they land on"
      actions={<ActionButton onClick={() => setInviting((v) => !v)}>{inviting ? "Close" : "Invite user"}</ActionButton>}
    >
      <div className="space-y-6">
        {inviting ? (
          <Panel title="Invite a user">
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(auth): replace with your provider's invite call
                // (e.g. supabase.auth.admin.inviteUserByEmail) and store the
                // role in a dedicated user_roles table, never on the profile.
                const org = orgOptions.find((o) => o.id === draft.organisationId);
                addUser({
                  name: draft.name,
                  email: draft.email,
                  role: draft.role,
                  status: "active",
                  ...(org ? { organisationId: org.id, organisationName: org.name } : {}),
                });
                setInviting(false);
                setDraft({ name: "", email: "", role: "client", organisationId: "" });
                toast.success("Invitation queued");
              }}
            >
              <Field label="Full name">
                <input required className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </Field>
              <Field label="Email">
                <input required type="email" className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </Field>
              <Field label="Role">
                <select
                  className={inputClass}
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value as Role, organisationId: "" })}
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="partner">Partner</option>
                </select>
              </Field>
              <Field label="Organisation">
                <select
                  className={inputClass}
                  value={draft.organisationId}
                  onChange={(e) => setDraft({ ...draft, organisationId: e.target.value })}
                  disabled={orgOptions.length === 0}
                >
                  <option value="">{orgOptions.length === 0 ? "Not applicable" : "Select organisation"}</option>
                  {orgOptions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Send invitation</ActionButton>
              </div>
            </form>
          </Panel>
        ) : null}

        <Panel title="All users">
          <table className="w-full text-left font-mono text-[11px]">
            <thead>
              <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                <th className="py-3">Name</th>
                <th className="py-3">Email</th>
                <th className="py-3">Role</th>
                <th className="py-3">Organisation</th>
                <th className="py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-background/5">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <Tag>{u.role}</Tag>
                  </td>
                  <td className="py-3">{u.organisationName ?? "—"}</td>
                  <td className="py-3 text-right">
                    <button
                      className="uppercase tracking-widest hover:text-primary"
                      onClick={() => updateUser(u.id, { status: u.status === "active" ? "inactive" : "active" })}
                    >
                      {u.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </AppShell>
  );
}
