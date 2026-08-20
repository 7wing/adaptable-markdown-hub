import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Afadhali — Measure what you have. Match what you waste." },
      {
        name: "description",
        content:
          "Afadhali audits energy, water and waste at your site, matches your waste streams to businesses that need them, and swaps the rest for cleaner alternatives.",
      },
      { property: "og:title", content: "Afadhali — Audit. Match. Swap." },
      {
        property: "og:description",
        content: "Industrial audits, waste matching and clean-tech swaps for East African businesses.",
      },
    ],
  }),
  component: Home,
});

const steps = [
  {
    tag: "(01) AUDIT",
    title: "On-site measurement of energy, water and waste.",
    body: "Our auditors record your energy source and cost, machine age and efficiency, water use, and every waste stream you produce — volume, frequency and how it is handled today.",
  },
  {
    tag: "(02) MATCH",
    title: "Your waste paired with a business that needs it.",
    body: "Every measured stream enters the Afadhali registry. Where material type, volume and distance line up, we propose a swap between two businesses and broker the introduction.",
  },
  {
    tag: "(03) SWAP",
    title: "Cleaner alternatives for what cannot be matched.",
    body: "Solar sizing, efficient equipment, biogas conversion or packaging alternatives — costed by vetted delivery partners and tracked to completion.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <header className="mx-auto grid max-w-7xl gap-12 border-b border-border px-6 pb-32 pt-24 lg:grid-cols-12">
        <div className="animate-reveal lg:col-span-7">
          <span className="label-mono mb-6 block text-primary">[ Phase 01: Measurement ]</span>
          <h1 className="mb-8 text-balance text-6xl font-extrabold leading-[0.9] tracking-tighter md:text-8xl">
            MEASURE WHAT YOU HAVE.{" "}
            <span className="text-muted-foreground opacity-50">MATCH WHAT YOU WASTE.</span>
          </h1>
          <p className="mb-10 max-w-[45ch] text-lg leading-relaxed text-foreground/80">
            Afadhali — Swahili for better — audits what your business consumes and discards, matches
            the waste to businesses that can use it, and swaps the remainder for cleaner
            alternatives.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/contact"
              className="bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background transition-colors hover:bg-primary"
            >
              Request an audit
            </Link>
            <Link
              to="/how-it-works"
              className="border border-input px-6 py-3 font-mono text-[11px] uppercase tracking-widest transition-colors hover:text-primary"
            >
              How it works
            </Link>
          </div>
        </div>

        <div className="animate-reveal flex flex-col justify-end [animation-delay:150ms] lg:col-span-5">
          <div className="bg-foreground p-8 text-background">
            <div className="label-mono mb-4 opacity-50">Sample scorecard · Kisumu Steel Works</div>
            <div className="mb-2 text-5xl font-extrabold tracking-tighter">
              81<span className="font-mono text-lg font-normal">/100</span>
            </div>
            <div className="mb-8 font-mono text-[10px] uppercase tracking-widest opacity-50">
              Overall sustainability score
            </div>
            <div className="space-y-5">
              {[
                { label: "Energy", value: 74 },
                { label: "Waste", value: 88 },
                { label: "Water", value: 66 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-widest">
                    <span>{row.label}</span>
                    <span>{row.value}%</span>
                  </div>
                  <div className="h-1 w-full bg-background/10">
                    <div
                      className="animate-fill h-full bg-ochre"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-background/10 pt-6 font-mono text-[10px] uppercase tracking-tighter">
              <div>Streams logged: 2</div>
              <div className="text-right">Matched: 1</div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-0 border-b border-border px-6 py-24 md:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.tag} className={`p-8 ${i < 2 ? "md:border-r md:border-border" : ""}`}>
            <div className="mb-6 font-mono text-xs text-primary">{step.tag}</div>
            <h2 className="mb-4 text-xl font-bold tracking-tight">{step.title}</h2>
            <p className="text-sm leading-relaxed text-foreground/60">{step.body}</p>
          </div>
        ))}
      </section>

      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight">THE REGISTRY</h2>
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">
                Every measured stream, searchable across all clients
              </p>
            </div>
            <div className="flex gap-4">
              <div className="border border-background/10 bg-background/5 px-4 py-2">
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-40">
                  Streams logged
                </div>
                <div className="text-xl font-bold">5</div>
              </div>
              <div className="border border-background/10 bg-background/5 px-4 py-2">
                <div className="font-mono text-[9px] uppercase tracking-widest opacity-40">
                  Match rate
                </div>
                <div className="text-xl font-bold text-ochre">60%</div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-[11px]">
              <thead>
                <tr className="border-b border-background/10 uppercase tracking-tighter opacity-40">
                  <th className="py-4">Stream</th>
                  <th className="py-4">Site</th>
                  <th className="py-4">Volume</th>
                  <th className="py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-background/5">
                <tr>
                  <td className="py-4 text-primary">Steel offcuts</td>
                  <td className="py-4">Kisumu Steel Works</td>
                  <td className="py-4">142.5 t / month</td>
                  <td className="py-4">
                    <span className="bg-signal-ok/20 px-2 py-0.5 text-signal-ok">MATCHED</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 text-primary">Coffee pulp</td>
                  <td className="py-4">Highland Coffee Cooperative</td>
                  <td className="py-4">60 t / season</td>
                  <td className="py-4">
                    <span className="bg-ochre/20 px-2 py-0.5 text-ochre">UNMATCHED</span>
                  </td>
                </tr>
                <tr>
                  <td className="py-4 text-primary">Kitchen organics</td>
                  <td className="py-4">Serena Bay Lodge</td>
                  <td className="py-4">3.2 t / month</td>
                  <td className="py-4">
                    <span className="bg-signal-ok/20 px-2 py-0.5 text-signal-ok">MATCHED</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border border-primary/30 bg-primary/10 p-8">
            <div>
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ochre">
                Already working with us?
              </div>
              <p className="text-lg font-bold">
                Admin, client and partner portals live on the platform.
              </p>
            </div>
            <Link
              to="/login"
              className="bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-primary-foreground"
            >
              Platform login
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
