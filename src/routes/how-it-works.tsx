import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Audit, Match, Swap | Afadhali" },
      {
        name: "description",
        content:
          "The Afadhali model in three steps: an on-site audit of energy, water and waste, a match between businesses, and a swap for cleaner alternatives.",
      },
      { property: "og:title", content: "How Afadhali works: Audit, Match, Swap" },
      {
        property: "og:description",
        content: "What we measure, what you provide, and what you receive back at each step.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    tag: "(01) AUDIT",
    title: "We measure what your site actually consumes and discards.",
    happens:
      "An auditor visits your site and records your energy source, monthly cost, machine age and efficiency, water use, and every waste stream you produce — material type, estimated volume, how often it is produced, and how it is handled today.",
    provide:
      "Site access, recent utility bills, and someone who knows the production floor for half a day.",
    receive:
      "A scorecard with an energy score, a waste score and an overall sustainability score, plus a plain-language summary of the findings.",
  },
  {
    tag: "(02) MATCH",
    title: "Your waste is compared against every other stream in the registry.",
    happens:
      "Each measured stream enters the Afadhali waste registry. We look for pairings where material type, volume and distance line up — your by-product being another business's input. Every candidate match is reviewed by an Afadhali analyst before either side sees it.",
    provide: "A decision: accept interest in a proposed match, or decline it.",
    receive:
      "Reviewed match proposals describing what the waste is, what it could be used for, and the general profile of the other business — with an introduction once both sides agree.",
  },
  {
    tag: "(03) SWAP",
    title: "What cannot be matched gets a cleaner alternative.",
    happens:
      "Some streams have no local taker, and some findings are about consumption rather than waste. For those we recommend a swap — solar sizing, an efficient equipment replacement, biogas conversion, or a packaging alternative — and route it to a vetted delivery partner.",
    provide: "A quote request when a recommendation is worth pricing.",
    receive:
      "Partner quotes with price, timeline and conditions, and job status tracked from scheduled through to completion.",
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <header className="mx-auto max-w-7xl border-b border-border px-6 pb-20 pt-24">
        <span className="label-mono mb-6 block text-primary">[ The method ]</span>
        <h1 className="max-w-[24ch] text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
          AUDIT. MATCH. SWAP.
        </h1>
        <p className="mt-8 max-w-[55ch] text-lg leading-relaxed text-foreground/70">
          Three steps, run in order. Nothing is recommended before it has been measured, and nothing
          is proposed to a client before an analyst has reviewed it.
        </p>
      </header>

      {steps.map((step, i) => (
        <section
          key={step.tag}
          className={`mx-auto max-w-7xl border-b border-border px-6 py-20 ${
            i % 2 === 1 ? "bg-muted/40" : ""
          }`}
        >
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="mb-6 font-mono text-xs text-primary">{step.tag}</div>
              <h2 className="text-3xl font-extrabold tracking-tighter">{step.title}</h2>
            </div>
            <div className="grid gap-8 lg:col-span-7">
              <div>
                <div className="label-mono mb-3 opacity-50">What happens</div>
                <p className="text-sm leading-relaxed text-foreground/80">{step.happens}</p>
              </div>
              <div className="grid gap-8 border-t border-border pt-8 sm:grid-cols-2">
                <div>
                  <div className="label-mono mb-3 opacity-50">What you provide</div>
                  <p className="text-sm leading-relaxed text-foreground/70">{step.provide}</p>
                </div>
                <div>
                  <div className="label-mono mb-3 opacity-50">What you receive</div>
                  <p className="text-sm leading-relaxed text-foreground/70">{step.receive}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-wrap items-center justify-between gap-6 bg-foreground p-10 text-background">
          <p className="max-w-[38ch] text-2xl font-extrabold tracking-tighter">
            Start with the audit. Everything else follows from the measurement.
          </p>
          <Link
            to="/contact"
            className="bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-primary-foreground"
          >
            Request an audit
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
