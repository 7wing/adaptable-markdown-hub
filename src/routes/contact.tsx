import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { useAfadhali } from "@/lib/afadhali/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Join the waitlist: Afadhali" },
      {
        name: "description",
        content:
          "Join the Afadhali waitlist with your company, sector, and the materials you produce or discard.",
      },
      { property: "og:title", content: "Join the Afadhali waitlist" },
      {
        property: "og:description",
        content:
          "Tell us about your company, sector, and material streams as we prepare to open Afadhali.",
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
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    sector: "Coffee and tea",
    message: "",
  });
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <div className="animate-fade-in mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="label-mono mb-6 block text-primary">[ Join the waitlist ]</span>
          <h1 className="text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-6xl">
            BE FIRST IN LINE FOR BETTER USE OF WHAT YOUR BUSINESS HAS.
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-foreground/70">
            We are preparing the first release. Tell us what your company makes, uses, and discards
            so we can shape the opening around real businesses.
          </p>
          <dl className="mt-10 space-y-6 border-t border-border pt-8 font-mono text-[11px] uppercase tracking-widest">
            <div>
              <dt className="mb-1 opacity-50">Email</dt>
              <dd>
                <a href="mailto:afadhali.ltd@gmail.com" className="text-primary hover:underline">
                  afadhali.ltd@gmail.com
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          {sent ? (
            <div className="border border-primary/40 bg-primary/5 p-10">
              <div className="label-mono mb-4 text-primary">You are on the list</div>
              <h2 className="text-2xl font-extrabold tracking-tighter">
                Thank you, your company is on the Afadhali waitlist.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                We will be in touch when the first places open. Your answers help us understand
                which sectors and material streams to support first.
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
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await addLead({
                    name: form.name,
                    company: form.company,
                    sector: form.sector,
                    message: `Contact email: ${form.email}\nContact number: ${form.phone}\n\n${form.message}`,
                  });
                  setSent(true);
                  toast.success("Added to the waitlist");
                } catch (error) {
                  console.error(error);
                  toast.error("We could not complete your signup. Please try again.");
                }
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
                <span className="label-mono mb-2 block opacity-60">Company email</span>
                <input
                  required
                  type="email"
                  className={inputClass}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="hello@thikatextiles.co.ke"
                />
              </label>
              <label className="block">
                <span className="label-mono mb-2 block opacity-60">Contact number</span>
                <input
                  required
                  type="tel"
                  className={inputClass}
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+254 700 000 000"
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
                  What does your company produce or discard?
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
                Join the waitlist
              </button>
            </form>
          )}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
