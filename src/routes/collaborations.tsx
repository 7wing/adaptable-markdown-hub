import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/collaborations")({
  head: () => ({
    meta: [
      { title: "Collaborations and funders — Afadhali" },
      {
        name: "description",
        content:
          "Afadhali works with delivery partners, green funds and policy bodies on industrial symbiosis, off-grid energy targets and single-use plastic reduction.",
      },
      { property: "og:title", content: "Afadhali collaborations and funders" },
      {
        property: "og:description",
        content: "Who we deliver with, and how the Audit-Match-Swap model aligns to national policy goals.",
      },
    ],
  }),
  component: Collaborations,
});

const partnerTypes = [
  {
    label: "Delivery partners",
    body: "Solar installers, biogas engineers, EV suppliers and packaging manufacturers who execute the Swap step and quote through the platform.",
  },
  {
    label: "Funders and green finance",
    body: "Climate funds and lenders who use audit scorecards as underwriting evidence for efficiency and off-grid investments.",
  },
  {
    label: "Policy and institutional",
    body: "Government bodies and industry associations working on industrial symbiosis and waste policy, where registry data supports reporting.",
  },
];

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

      <header className="mx-auto max-w-7xl border-b border-border px-6 pb-20 pt-24">
        <span className="label-mono mb-6 block text-primary">[ Who we work with ]</span>
        <h1 className="max-w-[26ch] text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
          A SWAP NEEDS SOMEONE TO DELIVER IT.
        </h1>
        <p className="mt-8 max-w-[55ch] text-lg leading-relaxed text-foreground/70">
          Afadhali measures and matches. Installation, haulage and finance come from partners, and
          the registry is designed to be legible to funders and policy bodies.
        </p>
      </header>

      <section className="mx-auto grid max-w-7xl gap-0 border-b border-border px-6 py-20 md:grid-cols-3">
        {partnerTypes.map((type, i) => (
          <div key={type.label} className={`p-8 ${i < 2 ? "md:border-r md:border-border" : ""}`}>
            <div className="mb-6 font-mono text-xs text-primary">
              ({String(i + 1).padStart(2, "0")})
            </div>
            <h2 className="mb-4 text-xl font-bold tracking-tight">{type.label}</h2>
            <p className="text-sm leading-relaxed text-foreground/60">{type.body}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="label-mono mb-8 opacity-50">Partner and funder register</div>
        <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {["Jua Solar Systems", "Biogas Kenya Engineering", "PakaPack Alternatives", "Coast EV Logistics"].map(
            (name) => (
              <div
                key={name}
                className="flex h-28 items-center justify-center bg-background px-6 text-center font-mono text-[11px] uppercase tracking-widest"
              >
                {name}
              </div>
            ),
          )}
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Register updated as agreements are signed. Logos replace names once supplied.
        </p>
      </section>

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
          <div className="mt-12 flex flex-wrap items-center justify-between gap-6 border border-primary/30 bg-primary/10 p-8">
            <p className="max-w-[40ch] text-lg font-bold">
              Partnership, funding or data-sharing enquiry?
            </p>
            <Link
              to="/contact"
              className="bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-primary-foreground"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
