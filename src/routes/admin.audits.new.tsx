import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, inputClass } from "@/components/platform/AppShell";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/admin/audits/new")({
  validateSearch: (search: Record<string, unknown>) => ({
    clientId: typeof search["clientId"] === "string" ? (search["clientId"] as string) : undefined,
  }),
  component: NewAudit,
});

type Entry = {
  material: string;
  volume: string;
  frequency: string;
  handling: string;
  notes: string;
};

const emptyEntry: Entry = { material: "", volume: "", frequency: "", handling: "", notes: "" };

function NewAudit() {
  const { clientId } = Route.useSearch();
  const navigate = useNavigate();
  const { clients, addAudit } = useAfadhali();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    clientId: clientId ?? clients[0]?.id ?? "",
    date: new Date().toISOString().slice(0, 10),
    energySource: "",
    energyCostMonthly: "",
    machineNotes: "",
    waterUseNotes: "",
    energyScore: "60",
    wasteScore: "60",
    summary: "",
  });
  const [entries, setEntries] = useState<Entry[]>([{ ...emptyEntry }]);

  const overall = Math.round((Number(form.energyScore) + Number(form.wasteScore)) / 2);

  const submit = (status: "draft" | "complete") => {
    // TODO(api): POST /audits with the nested waste entries
    addAudit(
      {
        clientId: form.clientId,
        date: form.date,
        status,
        energySource: form.energySource,
        energyCostMonthly: Number(form.energyCostMonthly) || 0,
        machineNotes: form.machineNotes,
        waterUseNotes: form.waterUseNotes,
        energyScore: Number(form.energyScore),
        wasteScore: Number(form.wasteScore),
        overallScore: overall,
        summary: form.summary,
      },
      entries
        .filter((e) => e.material.trim() !== "")
        .map((e) => ({ ...e, clientId: form.clientId, status: "unmatched" as const })),
    );
    toast.success(status === "complete" ? "Audit completed" : "Draft saved");
    navigate({ to: "/admin/clients/$clientId", params: { clientId: form.clientId } });
  };

  return (
    <AppShell
      role="admin"
      title="NEW AUDIT"
      subtitle={`Step ${step} of 3 — site visit capture form`}
      actions={
        <ActionButton variant="ghost" onClick={() => submit("draft")}>
          Save draft
        </ActionButton>
      }
    >
      <div className="space-y-6">
        <div className="flex gap-2 font-mono text-[10px] uppercase tracking-widest">
          {["Client & energy", "Waste streams", "Scoring"].map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i + 1)}
              className={`border px-4 py-2 ${
                step === i + 1
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-background/15 opacity-50"
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {step === 1 ? (
          <Panel title="Client, energy and process">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Client">
                <select
                  className={inputClass}
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.company}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Audit date">
                <input
                  type="date"
                  className={inputClass}
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </Field>
              <Field label="Energy source">
                <input
                  className={inputClass}
                  placeholder="Grid + diesel generator"
                  value={form.energySource}
                  onChange={(e) => setForm({ ...form, energySource: e.target.value })}
                />
              </Field>
              <Field label="Monthly energy cost (KES)">
                <input
                  type="number"
                  className={inputClass}
                  value={form.energyCostMonthly}
                  onChange={(e) => setForm({ ...form, energyCostMonthly: e.target.value })}
                />
              </Field>
              <Field label="Machine and equipment notes">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={form.machineNotes}
                  onChange={(e) => setForm({ ...form, machineNotes: e.target.value })}
                />
              </Field>
              <Field label="Water use notes">
                <textarea
                  rows={4}
                  className={inputClass}
                  value={form.waterUseNotes}
                  onChange={(e) => setForm({ ...form, waterUseNotes: e.target.value })}
                />
              </Field>
            </div>
            <div className="mt-6">
              <ActionButton onClick={() => setStep(2)}>Continue to waste streams</ActionButton>
            </div>
          </Panel>
        ) : null}

        {step === 2 ? (
          <Panel
            title="Waste streams observed"
            actions={
              <ActionButton variant="ghost" onClick={() => setEntries([...entries, { ...emptyEntry }])}>
                Add stream
              </ActionButton>
            }
          >
            <div className="space-y-6">
              {entries.map((entry, i) => (
                <div key={i} className="grid gap-4 border border-background/10 p-4 sm:grid-cols-2">
                  <Field label={`Material ${i + 1}`}>
                    <input
                      className={inputClass}
                      value={entry.material}
                      onChange={(e) =>
                        setEntries(entries.map((x, j) => (i === j ? { ...x, material: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <Field label="Volume">
                    <input
                      className={inputClass}
                      placeholder="2.4 t / month"
                      value={entry.volume}
                      onChange={(e) =>
                        setEntries(entries.map((x, j) => (i === j ? { ...x, volume: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <Field label="Frequency">
                    <input
                      className={inputClass}
                      placeholder="Weekly"
                      value={entry.frequency}
                      onChange={(e) =>
                        setEntries(entries.map((x, j) => (i === j ? { ...x, frequency: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <Field label="Current handling">
                    <input
                      className={inputClass}
                      placeholder="Landfill via private hauler"
                      value={entry.handling}
                      onChange={(e) =>
                        setEntries(entries.map((x, j) => (i === j ? { ...x, handling: e.target.value } : x)))
                      }
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Notes">
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={entry.notes}
                        onChange={(e) =>
                          setEntries(entries.map((x, j) => (i === j ? { ...x, notes: e.target.value } : x)))
                        }
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <ActionButton variant="ghost" onClick={() => setStep(1)}>
                Back
              </ActionButton>
              <ActionButton onClick={() => setStep(3)}>Continue to scoring</ActionButton>
            </div>
          </Panel>
        ) : null}

        {step === 3 ? (
          <Panel title="Scores and summary">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Energy efficiency score — ${form.energyScore}`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.energyScore}
                  onChange={(e) => setForm({ ...form, energyScore: e.target.value })}
                  className="w-full accent-ochre"
                />
              </Field>
              <Field label={`Waste management score — ${form.wasteScore}`}>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={form.wasteScore}
                  onChange={(e) => setForm({ ...form, wasteScore: e.target.value })}
                  className="w-full accent-ochre"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Auditor summary">
                  <textarea
                    rows={5}
                    className={inputClass}
                    value={form.summary}
                    onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  />
                </Field>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="font-mono text-[11px] uppercase tracking-widest opacity-50">
                Overall score {overall}
              </div>
              <ActionButton variant="ghost" onClick={() => setStep(2)}>
                Back
              </ActionButton>
              <ActionButton onClick={() => submit("complete")}>Complete audit</ActionButton>
            </div>
          </Panel>
        ) : null}
      </div>
    </AppShell>
  );
}
