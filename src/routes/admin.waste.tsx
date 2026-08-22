import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Stat, Tag, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/waste")({
  component: WasteRegistry,
});

function WasteRegistry() {
  const { waste, clients, setWasteStatus, addWasteNote } = useAfadhali();
  const [material, setMaterial] = useState("all");
  const [status, setStatus] = useState("all");
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const materials = useMemo(() => Array.from(new Set(waste.map((w) => w.material))), [waste]);
  const clientName = (id: string) => clients.find((c) => c.id === id)?.company ?? "Unknown";
  const filtered = waste.filter(
    (w) => (material === "all" || w.material === material) && (status === "all" || w.status === status),
  );

  return (
    <AppShell
      role="admin"
      title="WASTE REGISTRY"
      subtitle="Every material stream recorded across all audits"
      actions={
        <div className="flex gap-4">
          <Stat label="Streams" value={String(waste.length)} />
          <Stat label="Unmatched" value={String(waste.filter((w) => w.status === "unmatched").length)} accent />
        </div>
      }
    >
      <Panel title="All streams">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <Field label="Material">
            <select className={inputClass} value={material} onChange={(e) => setMaterial(e.target.value)}>
              <option value="all">All materials</option>
              {materials.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Status">
            <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">Any status</option>
              <option value="unmatched">Unmatched</option>
              <option value="matched">Matched</option>
              <option value="resolved">Resolved</option>
            </select>
          </Field>
        </div>

        <ul className="divide-y divide-background/10">
          {filtered.map((w) => (
            <li key={w.id} className="py-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-bold">
                    {w.material} <span className="opacity-40">· {clientName(w.clientId)}</span>
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-40">
                    {w.volume} · {w.frequency} · {w.handling}
                  </div>
                  {w.notes ? <p className="mt-2 text-xs opacity-60">{w.notes}</p> : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Tag tone={w.status === "unmatched" ? "warn" : w.status === "resolved" ? "ok" : "neutral"}>
                    {w.status}
                  </Tag>
                  <select
                    className="border border-background/15 bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                    value={w.status}
                    onChange={(e) => setWasteStatus(w.id, e.target.value as typeof w.status)}
                  >
                    <option value="unmatched">unmatched</option>
                    <option value="matched">matched</option>
                    <option value="resolved">resolved</option>
                  </select>
                  <ActionButton
                    variant="ghost"
                    onClick={() => {
                      setOpenNote(openNote === w.id ? null : w.id);
                      setNote("");
                    }}
                  >
                    Note
                  </ActionButton>
                </div>
              </div>
              {openNote === w.id ? (
                <form
                  className="mt-3 flex flex-wrap items-end gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addWasteNote(w.id, note);
                    setOpenNote(null);
                    toast.success("Note added");
                  }}
                >
                  <div className="min-w-[240px] flex-1">
                    <Field label="Internal note">
                      <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
                    </Field>
                  </div>
                  <ActionButton type="submit">Save note</ActionButton>
                </form>
              ) : null}
            </li>
          ))}
        </ul>
        {filtered.length === 0 ? <p className="py-6 text-sm opacity-50">No streams match.</p> : null}
      </Panel>
    </AppShell>
  );
}
