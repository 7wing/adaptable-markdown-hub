import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ActionButton, AppShell, Field, Panel, Stat, Tag, inputClass } from "@/components/platform/AppShell";
import { useAuth } from "@/lib/afadhali/auth";
import { useAfadhali } from "@/lib/afadhali/store";
import type { JobStatus } from "@/lib/afadhali/types";

export const Route = createFileRoute("/partner/jobs")({
  component: Jobs,
});

function Jobs() {
  const { user } = useAuth();
  const orgId = user?.organisationId ?? "";
  const { jobs, clients, setJobStatus } = useAfadhali();
  const myJobs = jobs.filter((j) => j.partnerId === orgId);
  const [openNote, setOpenNote] = useState<string | null>(null);
  const [note, setNote] = useState("");

  return (
    <AppShell
      role="partner"
      title="JOBS"
      subtitle="Collections and installations assigned to you"
      actions={
        <div className="flex gap-4">
          <Stat label="Active" value={String(myJobs.filter((j) => j.status !== "completed").length)} accent />
          <Stat label="Completed" value={String(myJobs.filter((j) => j.status === "completed").length)} />
        </div>
      }
    >
      <Panel title="Assigned jobs">
        {myJobs.length === 0 ? (
          <p className="text-sm opacity-50">Nothing assigned yet.</p>
        ) : (
          <ul className="divide-y divide-background/10">
            {myJobs.map((j) => (
              <li key={j.id} className="py-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-2xl">
                    <div className="text-sm font-bold">
                      {clients.find((c) => c.id === j.clientId)?.company ?? "Client"}
                    </div>
                    <p className="mt-2 text-xs opacity-60">{j.description}</p>
                    {j.notes ? (
                      <p className="mt-2 border-l-2 border-ochre pl-3 text-xs opacity-50">{j.notes}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag tone={j.status === "completed" ? "ok" : "warn"}>{j.status.replace("_", " ")}</Tag>
                    <select
                      className="border border-background/15 bg-transparent px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
                      value={j.status}
                      onChange={(e) => {
                        // TODO(api): PATCH /jobs/:id
                        setJobStatus(j.id, e.target.value as JobStatus);
                        toast.success("Job status updated");
                      }}
                    >
                      <option value="scheduled">scheduled</option>
                      <option value="in_progress">in progress</option>
                      <option value="completed">completed</option>
                    </select>
                    <ActionButton
                      variant="ghost"
                      onClick={() => {
                        setOpenNote(openNote === j.id ? null : j.id);
                        setNote("");
                      }}
                    >
                      Add note
                    </ActionButton>
                  </div>
                </div>
                {openNote === j.id ? (
                  <form
                    className="mt-3 flex flex-wrap items-end gap-3"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setJobStatus(j.id, j.status, note);
                      setOpenNote(null);
                      toast.success("Note saved");
                    }}
                  >
                    <div className="min-w-[240px] flex-1">
                      <Field label="Completion note">
                        <input className={inputClass} value={note} onChange={(e) => setNote(e.target.value)} />
                      </Field>
                    </div>
                    <ActionButton type="submit">Save note</ActionButton>
                  </form>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </AppShell>
  );
}
