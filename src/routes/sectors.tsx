import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/sectors")({
  head: () => ({
    meta: [
      { title: "Sectors we audit — Afadhali" },
      {
        name: "description",
        content:
          "Coffee and tea, manufacturing, hospitality, digital infrastructure, agriculture, healthcare, construction, transport, education, retail, textiles and mining — with the audit finding typical of each.",
      },
      { property: "og:title", content: "Sectors Afadhali audits" },
      {
        property: "og:description",
        content: "Twelve sectors, and the waste or energy finding we most often measure in each.",
      },
    ],
  }),
  component: Sectors,
});

const sectors = [
  { name: "Coffee and tea", finding: "Seasonal pulp and husk volumes heaped on site with no offtaker." },
  { name: "Manufacturing", finding: "Mill scale and metal offcuts sold below value; oversized motors." },
  { name: "Hospitality", finding: "Kitchen organics mixed with packaging; furnace-oil laundry boilers." },
  { name: "Digital infrastructure", finding: "Diesel backup runtime and cooling load far above design." },
  { name: "Agriculture", finding: "Crop residue burned in field while neighbours buy soil conditioner." },
  { name: "Healthcare", finding: "Non-hazardous packaging routed through costly clinical waste streams." },
  { name: "Construction", finding: "Rubble and formwork timber landfilled within reach of a re-user." },
  { name: "Transport", finding: "Used oil, tyres and batteries stored without a recovery channel." },
  { name: "Education", finding: "Canteen organics and paper volumes large enough to justify a digester." },
  { name: "Retail", finding: "Single-use plastic and cardboard flowing out daily, uncounted." },
  { name: "Textiles", finding: "Cotton offcuts and dye water discharged with no reuse pathway." },
  { name: "Mining", finding: "Tailings and scrap steel with unmeasured recovery potential." },
];

export default function Sectors() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <header className="mx-auto max-w-7xl border-b border-border px-6 pb-20 pt-24">
        <span className="label-mono mb-6 block text-primary">[ Where we work ]</span>
        <h1 className="max-w-[26ch] text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
          TWELVE SECTORS. ONE METHOD.
        </h1>
        <p className="mt-8 max-w-[55ch] text-lg leading-relaxed text-foreground/70">
          The audit does not change by industry — only what it finds does. Below is the finding we
          most often measure in each sector we work in.
        </p>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid border-l border-t border-border sm:grid-cols-2 lg:grid-cols-3">
          {sectors.map((sector, i) => (
            <article key={sector.name} className="border-b border-r border-border p-8">
              <div className="mb-6 font-mono text-[10px] tracking-widest text-primary">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h2 className="mb-3 text-xl font-bold tracking-tight">{sector.name}</h2>
              <p className="text-sm leading-relaxed text-foreground/60">{sector.finding}</p>
            </article>
          ))}
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border border-border p-8">
          <p className="max-w-[46ch] text-lg leading-relaxed">
            If your sector is not listed, the method still applies. Every business consumes energy
            and discards something — get in touch and we will measure it.
          </p>
          <Link
            to="/contact"
            className="bg-foreground px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-background transition-colors hover:bg-primary"
          >
            Talk to us
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
