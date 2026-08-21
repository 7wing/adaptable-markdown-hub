import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team and open roles — Afadhali" },
      {
        name: "description",
        content:
          "The people running Afadhali audits, matching and partner delivery — plus the roles we are currently hiring for.",
      },
      { property: "og:title", content: "The Afadhali team" },
      {
        property: "og:description",
        content: "Who does the measuring, the matching and the partner delivery.",
      },
    ],
  }),
  component: Team,
});

const team = [
  {
    name: "Founder & Managing Director",
    role: "Strategy, client relationships, policy",
    bio: "Background in industrial operations and resource efficiency across East African manufacturing and agro-processing. Runs client engagements end to end.",
  },
  {
    name: "Lead Energy Auditor",
    role: "Audit delivery",
    bio: "Certified energy auditor. Owns the on-site protocol: load measurement, machine efficiency assessment and scorecard methodology.",
  },
  {
    name: "Materials & Matching Analyst",
    role: "Waste registry, match review",
    bio: "Maintains the waste registry and reviews every candidate match for material compatibility, volume and distance before it reaches a client.",
  },
  {
    name: "Partner Network Lead",
    role: "Swap delivery",
    bio: "Vets and manages installers and suppliers, and keeps quotes and job status moving through the partner portal.",
  },
];

const roles = [
  { title: "Energy auditor", detail: "Field role. Nairobi-based with regional travel." },
  { title: "Business development lead", detail: "Client acquisition across manufacturing and hospitality." },
];

export default function Team() {
  return (
    <div className="min-h-screen">
      <SiteHeader />

      <header className="mx-auto max-w-7xl border-b border-border px-6 pb-20 pt-24">
        <span className="label-mono mb-6 block text-primary">[ Who is behind this ]</span>
        <h1 className="max-w-[24ch] text-balance text-5xl font-extrabold leading-[0.9] tracking-tighter md:text-7xl">
          SMALL TEAM. MEASURED WORK.
        </h1>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid border-t border-border md:grid-cols-2">
          {team.map((member) => (
            <article key={member.name} className="border-b border-border p-8 md:odd:border-r">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-primary">
                {member.role}
              </div>
              <h2 className="mb-4 text-2xl font-extrabold tracking-tighter">{member.name}</h2>
              <p className="text-sm leading-relaxed text-foreground/60">{member.bio}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-foreground py-20 text-background">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-3xl font-extrabold tracking-tight">OPEN ROLES</h2>
          <ul className="divide-y divide-background/10 border-y border-background/10">
            {roles.map((role) => (
              <li key={role.title} className="flex flex-wrap items-center justify-between gap-4 py-6">
                <div>
                  <div className="text-xl font-bold">{role.title}</div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-widest opacity-50">
                    {role.detail}
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="border border-background/20 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  Apply
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
