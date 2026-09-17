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

export const Route = createFileRoute("/admin/matches")({
  component: Matches,
});

function Matches() {
  const { matches, waste, clients, partners, setMatchStatus, addMatch, updateMatch, deleteMatch } =
    useAfadhali();
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({
    entryAId: "",
    entryBId: "",
    partnerId: "",
    reasoning: "",
    distanceKm: "",
  });

  const entryLabel = (id?: string) => {
    if (!id) return "—";
    const entry = waste.find((w) => w.id === id);
    if (!entry) return "—";
    const company = clients.find((c) => c.id === entry.clientId)?.company ?? "Unknown";
    return `${entry.material} · ${company}`;
  };

  return (
    <AppShell
      role="admin"
      title="MATCHES"
      subtitle="Candidate reuse pairings between clients and partners"
      actions={
        <div className="flex flex-wrap items-center gap-4">
          <Stat
            label="Proposed"
            value={String(matches.filter((m) => m.status === "proposed").length)}
            accent
          />
          <ActionButton onClick={() => setCreating((v) => !v)}>
            {creating ? "Close" : "Create match"}
          </ActionButton>
        </div>
      }
    >
      <div className="space-y-6">
        {creating ? (
          <Panel title="Manual match">
            <form
              className="grid gap-4 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(api): POST /matches
                addMatch({
                  entryAId: draft.entryAId,
                  ...(draft.entryBId ? { entryBId: draft.entryBId } : {}),
                  ...(draft.partnerId ? { partnerId: draft.partnerId } : {}),
                  status: "proposed",
                  reasoning: draft.reasoning,
                  distanceKm: Number(draft.distanceKm) || 0,
                });
                setCreating(false);
                toast.success("Match proposed");
              }}
            >
              <Field label="Waste stream A">
                <select
                  required
                  className={inputClass}
                  value={draft.entryAId}
                  onChange={(e) => setDraft({ ...draft, entryAId: e.target.value })}
                >
                  <option value="">Select a stream</option>
                  {waste.map((w) => (
                    <option key={w.id} value={w.id}>
                      {entryLabel(w.id)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Waste stream B (optional)">
                <select
                  className={inputClass}
                  value={draft.entryBId}
                  onChange={(e) => setDraft({ ...draft, entryBId: e.target.value })}
                >
                  <option value="">None</option>
                  {waste.map((w) => (
                    <option key={w.id} value={w.id}>
                      {entryLabel(w.id)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Partner (optional)">
                <select
                  className={inputClass}
                  value={draft.partnerId}
                  onChange={(e) => setDraft({ ...draft, partnerId: e.target.value })}
                >
                  <option value="">None</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.company}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Distance (km)">
                <input
                  type="number"
                  className={inputClass}
                  value={draft.distanceKm}
                  onChange={(e) => setDraft({ ...draft, distanceKm: e.target.value })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Reasoning shown to the client">
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={draft.reasoning}
                    onChange={(e) => setDraft({ ...draft, reasoning: e.target.value })}
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <ActionButton type="submit">Propose match</ActionButton>
              </div>
            </form>
          </Panel>
        ) : null}

        <Panel title="Match queue">
          <ul className="divide-y divide-background/10">
            {matches.map((m) => (
              <li key={m.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-bold">
                      {entryLabel(m.entryAId)}
                      <span className="mx-2 text-ochre">→</span>
                      {m.partnerId
                        ? (partners.find((p) => p.id === m.partnerId)?.company ?? "Partner")
                        : entryLabel(m.entryBId)}
                    </div>
                    <p className="mt-2 max-w-2xl text-xs opacity-60">{m.reasoning}</p>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-widest opacity-40">
                      {m.distanceKm} km apart
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag
                      tone={
                        m.status === "approved" || m.status === "accepted_by_client"
                          ? "ok"
                          : m.status === "rejected" || m.status === "declined_by_client"
                            ? "bad"
                            : "warn"
                      }
                    >
                      {m.status.replace(/_/g, " ")}
                    </Tag>
                    {m.status === "proposed" ? (
                      <>
                        <ActionButton
                          onClick={() => {
                            setMatchStatus(m.id, "approved");
                            toast.success("Match approved and shared with the client");
                          }}
                        >
                          Approve
                        </ActionButton>
                        <ActionButton
                          variant="ghost"
                          onClick={() => setMatchStatus(m.id, "rejected")}
                        >
                          Reject
                        </ActionButton>
                      </>
                    ) : null}
                    <ActionButton
                      variant="ghost"
                      onClick={() => setEditingId(editingId === m.id ? null : m.id)}
                    >
                      Edit
                    </ActionButton>
                    <ActionButton
                      variant="ghost"
                      onClick={async () => {
                        if (confirm("Delete this match? This cannot be undone.")) {
                          await deleteMatch(m.id);
                          toast.success("Match deleted");
                        }
                      }}
                    >
                      Delete
                    </ActionButton>
                  </div>
                </div>
                {editingId === m.id ? (
                  <form
                    className="mt-3 grid gap-3 border border-background/10 p-4 sm:grid-cols-2"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const data = new FormData(e.currentTarget);
                      await updateMatch(m.id, {
                        reasoning: String(data.get("reasoning") ?? m.reasoning),
                        distanceKm: Number(data.get("distanceKm") ?? m.distanceKm),
                      });
                      setEditingId(null);
                      toast.success("Match updated");
                    }}
                  >
                    <div className="sm:col-span-2">
                      <Field label="Reasoning">
                        <textarea
                          name="reasoning"
                          rows={2}
                          defaultValue={m.reasoning}
                          className={inputClass}
                        />
                      </Field>
                    </div>
                    <Field label="Distance (km)">
                      <input
                        name="distanceKm"
                        type="number"
                        defaultValue={m.distanceKm}
                        className={inputClass}
                      />
                    </Field>
                    <div className="flex items-end gap-3">
                      <ActionButton type="submit">Save</ActionButton>
                      <ActionButton variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </ActionButton>
                    </div>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
          {matches.length === 0 ? <p className="py-6 text-sm opacity-50">No matches yet.</p> : null}
        </Panel>
      </div>
    </AppShell>
  );
}
