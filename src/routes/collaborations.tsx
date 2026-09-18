import { createFileRoute } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Policy alignment: Afadhali" },
      {
        name: "description",
        content:
          "How the Afadhali model connects to industrial symbiosis, clean energy targets and single-use plastic reduction.",
      },
      { property: "og:title", content: "Afadhali policy alignment" },
      {
        property: "og:description",
        content: "How the Audit-Match-Swap model aligns to national policy goals.",
      },
    ],
  }),
  component: Collaborations,
});

const alignment = [
  {
    goal: "Industrial symbiosis",
    body: "The waste registry makes one firm's by-product visible as another firm's input, which is the practical unit of a circular industrial economy.",
  },
  {
    goal: "Off-grid and clean energy targets",
    body: "Audits quantify diesel runtime and energy cost per site, producing the load data solar and biogas sizing actually needs.",
  },
  {
    goal: "Single-use plastic reduction",
    body: "Packaging streams are measured before alternatives are recommended, so substitution is costed against real volumes.",
  },
];

export default function Collaborations() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <header className="mx-auto max-w-7xl border-b border-border px-6 pb-20 pt-16">
        <span className="label-mono mb-6 block text-primary">[ Policy alignment ]</span>
        <h1 className="max-w-[26ch] text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
          BETTER RESOURCE USE STARTS WITH MEASUREMENT.
        </h1>
        <p className="mt-8 max-w-[55ch] text-lg leading-relaxed text-foreground/70">
          Afadhali measures and matches what businesses consume and discard. The model supports
          practical progress toward a more circular, efficient economy.
        </p>
      </header>

      <section className="bg-foreground py-24 text-background">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-3xl font-extrabold tracking-tight">POLICY ALIGNMENT</h2>
          <div className="grid gap-px bg-background/10 md:grid-cols-3">
            {alignment.map((item) => (
              <div key={item.goal} className="bg-foreground p-8">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-ochre">
                  {item.goal}
                </div>
                <p className="text-sm leading-relaxed opacity-70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
