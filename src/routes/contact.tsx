import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Request an audit — Afadhali" },
      {
        name: "description",
        content:
          "Tell us what you produce and what you discard. We will come and measure it, then match what can be reused.",
      },
      { property: "og:title", content: "Request an Afadhali audit" },
      {
        property: "og:description",
        content: "Send your sector, what you produce and what you discard — we take it from there.",
      },
    ],
  }),
  component: Contact,
});

const sectors = [
  "Coffee and tea",
  "Manufacturing",
  "Hospitality",
  "Digital infrastructure",
  "Agriculture",
  "Healthcare",
  "Construction",
  "Transport",
  "Education",
  "Retail",
  "Textiles",
  "Mining",
  "Other",
];

const inputClass =
  "w-full border border-input bg-card px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-primary";

export default function Contact() {
  const { addLead } = useAfadhali();
  const [form, setForm] = useState({ name: "", company: "", sector: "Coffee and tea", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 pb-24 pt-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="label-mono mb-6 block text-primary">[ Request an audit ]</span>
          <h1 className="text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-6xl">
            TELL US WHAT YOU MAKE AND WHAT YOU THROW AWAY.
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-foreground/70">
            That is enough to start. We will follow up to arrange a site visit and confirm what the
            audit will cover.
          </p>
          <dl className="mt-10 space-y-6 border-t border-border pt-8 font-mono text-[11px] uppercase tracking-widest">
            <div>
              <dt className="mb-1 opacity-50">Email</dt>
              <dd>
                <a href="mailto:hello@afadhali.co" className="text-primary hover:underline">
                  hello@afadhali.co
                </a>
              </dd>
            </div>
            <div>
              <dt className="mb-1 opacity-50">Partnerships</dt>
              <dd>
                <a href="mailto:partners@afadhali.co" className="text-primary hover:underline">
                  partners@afadhali.co
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="border border-primary/40 bg-primary/5 p-10">
              <div className="label-mono mb-4 text-primary">Lead recorded</div>
              <h2 className="text-2xl font-extrabold tracking-tighter">
                Thank you — your request is in the queue.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                An Afadhali admin now sees this as a lead and can convert it into a client record
                once the audit is scheduled.
              </p>
              <button
                onClick={() => setSent(false)}
                className="mt-8 border border-input px-4 py-2 font-mono text-[10px] uppercase tracking-widest hover:text-primary"
              >
                Submit another
              </button>
            </div>
          ) : (
            <form
              className="space-y-6 border border-border p-8"
              onSubmit={(e) => {
                e.preventDefault();
                // TODO(api): POST this to your leads endpoint instead of the mock store.
                addLead(form);
                setSent(true);
                toast.success("Audit request received");
              }}
            >
              <label className="block">
                <span className="label-mono mb-2 block opacity-60">Your name</span>
                <input
                  required
                  className={inputClass}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Grace Wanjiku"
                />
              </label>
              <label className="block">
                <span className="label-mono mb-2 block opacity-60">Company or cooperative</span>
                <input
                  required
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  placeholder="Thika Textiles"
                />
              </label>
              <label className="block">
                <span className="label-mono mb-2 block opacity-60">Sector</span>
                <select
                  className={inputClass}
                  value={form.sector}
                  onChange={(e) => setForm({ ...form, sector: e.target.value })}
                >
                  {sectors.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="label-mono mb-2 block opacity-60">
                  What do you produce, and what do you discard?
                </span>
                <textarea
                  required
                  rows={6}
                  className={inputClass}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="We spin and dye cotton. Offcuts go to a skip and dye water goes to the drain."
                />
              </label>
              <button
                type="submit"
                className="bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background transition-colors hover:bg-primary"
              >
                Submit request
              </button>
            </form>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
