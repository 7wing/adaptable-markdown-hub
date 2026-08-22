import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, inputClass } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/client/account")({
  component: Account,
});

function Account() {
  const { user, signOut } = useAuth();
  const { clients, updateClient } = useAfadhali();
  const client = clients.find((c) => c.id === user?.organisationId);
  const [form, setForm] = useState({
    contactPerson: client?.contactPerson ?? "",
    email: client?.email ?? "",
    phone: client?.phone ?? "",
    location: client?.location ?? "",
  });

  return (
    <AppShell role="client" title="ACCOUNT" subtitle="Contact details and access">
      <div className="space-y-6">
        <Panel title="Company contact">
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO(api): PATCH /clients/:id
              if (client) updateClient(client.id, form);
              toast.success("Details saved");
            }}
          >
            <Field label="Contact person">
              <input className={inputClass} value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </Field>
            <Field label="Site location">
              <input className={inputClass} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <ActionButton type="submit">Save changes</ActionButton>
            </div>
          </form>
        </Panel>

        <Panel title="Sign-in and security">
          <div className="space-y-4 font-mono text-[11px]">
            <div>
              <div className="mb-1 uppercase tracking-widest opacity-40">Signed in as</div>
              <div>{user?.email}</div>
            </div>
            <p className="max-w-xl text-xs opacity-50">
              {/* TODO(auth): wire password reset to your auth provider, e.g.
                  supabase.auth.resetPasswordForEmail(email, { redirectTo: origin + "/reset-password" }) */}
              Password changes are handled by your authentication provider once connected.
            </p>
            <div className="flex gap-3">
              <ActionButton variant="ghost" onClick={() => toast.info("Connect an auth provider to enable this")}>
                Change password
              </ActionButton>
              <ActionButton variant="ghost" onClick={signOut}>
                Sign out
              </ActionButton>
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
