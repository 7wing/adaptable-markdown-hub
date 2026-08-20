import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import type {
  Audit,
  Client,
  Job,
  Lead,
  Match,
  Partner,
  Quote,
  Recommendation,
  Report,
  User,
  WasteEntry,
} from "./types";

/* ---------------------------------------------------------------------------
 * MOCK DATA LAYER
 * ---------------------------------------------------------------------------
 * Everything below is in-memory demo data so every page is navigable without a
 * backend. To plug in your own API:
 *   1. Keep the shapes in `./types.ts` as your API contract.
 *   2. Replace the `seed*` values with data fetched in a route loader or
 *      TanStack Query hook (e.g. `useQuery({ queryKey: ["clients"], ... })`).
 *   3. Replace each action below (addClient, approveMatch, ...) with a call to
 *      your endpoint, then invalidate the relevant query.
 * Nothing else in the UI needs to change.
 * ------------------------------------------------------------------------- */

const seedClients: Client[] = [
  {
    id: "cl-01",
    company: "Kisumu Steel Works",
    sector: "Manufacturing",
    location: "Kisumu",
    contactPerson: "Achieng Otieno",
    email: "ops@kisumusteel.co.ke",
    phone: "+254 700 111 222",
    status: "active",
    auditStatus: "completed",
    lastActivity: "2026-08-14",
  },
  {
    id: "cl-02",
    company: "Highland Coffee Cooperative",
    sector: "Coffee and tea",
    location: "Nyeri",
    contactPerson: "Peter Mwangi",
    email: "chair@highlandcoffee.coop",
    phone: "+254 701 333 444",
    status: "active",
    auditStatus: "in_progress",
    lastActivity: "2026-08-18",
  },
  {
    id: "cl-03",
    company: "Serena Bay Lodge",
    sector: "Hospitality",
    location: "Mombasa",
    contactPerson: "Fatuma Ali",
    email: "gm@serenabay.co.ke",
    phone: "+254 702 555 666",
    status: "active",
    auditStatus: "completed",
    lastActivity: "2026-08-02",
  },
  {
    id: "cl-04",
    company: "Rift Data Centre",
    sector: "Digital infrastructure",
    location: "Naivasha",
    contactPerson: "Brian Kimani",
    email: "facilities@riftdc.io",
    phone: "+254 703 777 888",
    status: "active",
    auditStatus: "not_started",
    lastActivity: "2026-07-29",
  },
];

const seedAudits: Audit[] = [
  {
    id: "au-01",
    clientId: "cl-01",
    date: "2026-08-14",
    status: "complete",
    energySource: "Grid + 250kVA diesel backup",
    energyCostMonthly: 1840000,
    machineNotes: "Induction furnace 14 years old, no variable speed drives on extraction fans.",
    waterUseNotes: "Closed-loop cooling, 8% make-up loss per shift.",
    energyScore: 74,
    wasteScore: 88,
    overallScore: 81,
    summary:
      "Mill scale and steel offcuts are fully recoverable through a local foundry. Largest single saving sits in furnace scheduling and off-peak tariff use.",
  },
  {
    id: "au-02",
    clientId: "cl-02",
    date: "2026-08-18",
    status: "draft",
    energySource: "Grid, single phase",
    energyCostMonthly: 210000,
    machineNotes: "Pulper motor oversized for current throughput.",
    waterUseNotes: "Wet processing discharges to settling ponds.",
    energyScore: 58,
    wasteScore: 64,
    overallScore: 61,
    summary: "Draft audit — second visit scheduled to weigh pulp volumes over a full picking week.",
  },
  {
    id: "au-03",
    clientId: "cl-03",
    date: "2026-08-02",
    status: "complete",
    energySource: "Grid + 40kW rooftop solar",
    energyCostMonthly: 940000,
    machineNotes: "Laundry boiler on furnace oil, no heat recovery.",
    waterUseNotes: "Greywater currently untreated.",
    energyScore: 69,
    wasteScore: 71,
    overallScore: 70,
    summary:
      "Kitchen organics are the strongest match candidate. Boiler switch to biogas is viable at current organic volumes.",
  },
];

const seedWaste: WasteEntry[] = [
  {
    id: "we-01",
    auditId: "au-01",
    clientId: "cl-01",
    material: "Steel offcuts",
    volume: "142.5 t / month",
    frequency: "Continuous",
    handling: "Sold to informal scrap dealers",
    status: "matched",
    notes: "Grade separated at source.",
  },
  {
    id: "we-02",
    auditId: "au-01",
    clientId: "cl-01",
    material: "Mill scale",
    volume: "18 t / month",
    frequency: "Weekly",
    handling: "Landfilled on site",
    status: "unmatched",
    notes: "High iron oxide content, cement industry interest likely.",
  },
  {
    id: "we-03",
    auditId: "au-02",
    clientId: "cl-02",
    material: "Coffee pulp",
    volume: "60 t / season",
    frequency: "Seasonal",
    handling: "Heaped behind wet mill",
    status: "unmatched",
    notes: "Odour complaints from neighbouring farm.",
  },
  {
    id: "we-04",
    auditId: "au-03",
    clientId: "cl-03",
    material: "Kitchen organics",
    volume: "3.2 t / month",
    frequency: "Daily",
    handling: "Municipal collection",
    status: "matched",
    notes: "Separated from packaging waste since June.",
  },
  {
    id: "we-05",
    auditId: "au-03",
    clientId: "cl-03",
    material: "Single-use plastic amenities",
    volume: "0.4 t / month",
    frequency: "Weekly",
    handling: "Municipal collection",
    status: "resolved",
    notes: "Replaced with refill dispensers in 62 of 90 rooms.",
  },
];

const seedMatches: Match[] = [
  {
    id: "ma-01",
    entryAId: "we-01",
    entryBId: "we-02",
    status: "approved",
    reasoning: "Ferrous streams consolidated for single collection run; volume compatible.",
    distanceKm: 4,
  },
  {
    id: "ma-02",
    entryAId: "we-03",
    partnerId: "pa-02",
    status: "proposed",
    reasoning: "Coffee pulp volume matches digester feedstock requirement for 45kW unit.",
    distanceKm: 31,
  },
  {
    id: "ma-03",
    entryAId: "we-04",
    partnerId: "pa-02",
    status: "accepted_by_client",
    reasoning: "Daily organics feed hotel-side biogas for kitchen use.",
    distanceKm: 12,
  },
];

const seedPartners: Partner[] = [
  {
    id: "pa-01",
    company: "Jua Solar Systems",
    offers: ["Solar PV", "Battery storage"],
    serviceArea: "Nationwide",
    contactPerson: "Njeri Waweru",
    email: "sales@juasolar.co.ke",
    status: "active",
  },
  {
    id: "pa-02",
    company: "Biogas Kenya Engineering",
    offers: ["Biodigesters", "Waste-to-energy"],
    serviceArea: "Central, Rift Valley",
    contactPerson: "Samuel Kariuki",
    email: "projects@biogaske.com",
    status: "active",
  },
  {
    id: "pa-03",
    company: "PakaPack Alternatives",
    offers: ["Compostable packaging"],
    serviceArea: "Nairobi, Coast",
    contactPerson: "Zawadi Mwende",
    email: "hello@pakapack.africa",
    status: "active",
  },
  {
    id: "pa-04",
    company: "Coast EV Logistics",
    offers: ["Electric fleet", "Last-mile haulage"],
    serviceArea: "Coast",
    contactPerson: "Ali Juma",
    email: "fleet@coastev.co.ke",
    status: "inactive",
  },
];

const seedRecommendations: Recommendation[] = [
  {
    id: "re-01",
    clientId: "cl-01",
    title: "Variable speed drives on extraction fans",
    description: "Retrofit VSDs on the four extraction fans running at fixed speed across shifts.",
    benefit: "Est. 11% cut in fan energy draw, payback under 14 months.",
    partnerId: "pa-01",
    status: "suggested",
  },
  {
    id: "re-02",
    clientId: "cl-03",
    title: "Biogas boiler conversion",
    description: "Replace furnace-oil laundry boiler with a biogas unit fed by kitchen organics.",
    benefit: "Removes 9,600 L of furnace oil per year.",
    partnerId: "pa-02",
    status: "quote_requested",
  },
  {
    id: "re-03",
    clientId: "cl-02",
    title: "Solar drying beds",
    description: "Shade-net drying beds sized for a 60 t seasonal pulp volume.",
    benefit: "Turns pulp liability into saleable soil conditioner.",
    partnerId: "pa-02",
    status: "suggested",
  },
];

const seedQuotes: Quote[] = [
  {
    id: "qu-01",
    partnerId: "pa-02",
    recommendationId: "re-02",
    clientId: "cl-03",
    price: 3850000,
    timeline: "8 weeks from deposit",
    conditions: "Excludes civil works for the digester slab.",
    status: "submitted",
  },
];

const seedJobs: Job[] = [
  {
    id: "jo-01",
    partnerId: "pa-02",
    clientId: "cl-03",
    description: "Biogas digester install — Serena Bay Lodge",
    status: "in_progress",
    notes: "Slab cured, dome delivery expected Friday.",
  },
  {
    id: "jo-02",
    partnerId: "pa-01",
    clientId: "cl-01",
    description: "VSD retrofit survey — Kisumu Steel Works",
    status: "scheduled",
    notes: "Site access confirmed for the 27th.",
  },
];

const seedReports: Report[] = [
  {
    id: "rp-01",
    clientId: "cl-01",
    auditIds: ["au-01"],
    generatedAt: "2026-08-15",
    sent: true,
  },
  {
    id: "rp-02",
    clientId: "cl-03",
    auditIds: ["au-03"],
    generatedAt: "2026-08-03",
    sent: false,
  },
];

const seedUsers: User[] = [
  {
    id: "us-01",
    name: "Afadhali Admin",
    email: "admin@afadhali.co",
    role: "admin",
    status: "active",
  },
  {
    id: "us-02",
    name: "Achieng Otieno",
    email: "ops@kisumusteel.co.ke",
    role: "client",
    organisationId: "cl-01",
    organisationName: "Kisumu Steel Works",
    status: "active",
  },
  {
    id: "us-03",
    name: "Samuel Kariuki",
    email: "projects@biogaske.com",
    role: "partner",
    organisationId: "pa-02",
    organisationName: "Biogas Kenya Engineering",
    status: "active",
  },
];

const seedLeads: Lead[] = [
  {
    id: "le-01",
    name: "Grace Wanjiku",
    company: "Thika Textiles",
    sector: "Textiles",
    message: "We produce cotton offcuts and dye water and have no idea where either goes.",
    createdAt: "2026-08-19",
    converted: false,
  },
];

interface Data {
  clients: Client[];
  audits: Audit[];
  waste: WasteEntry[];
  matches: Match[];
  partners: Partner[];
  recommendations: Recommendation[];
  quotes: Quote[];
  jobs: Job[];
  reports: Report[];
  users: User[];
  leads: Lead[];
}

interface StoreValue extends Data {
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "converted">) => void;
  addClient: (client: Omit<Client, "id" | "lastActivity">) => void;
  updateClient: (id: string, patch: Partial<Client>) => void;
  addAudit: (audit: Omit<Audit, "id">, entries: Omit<WasteEntry, "id" | "auditId">[]) => void;
  setWasteStatus: (id: string, status: WasteEntry["status"]) => void;
  addWasteNote: (id: string, note: string) => void;
  setMatchStatus: (id: string, status: Match["status"]) => void;
  addMatch: (match: Omit<Match, "id">) => void;
  addPartner: (partner: Omit<Partner, "id">) => void;
  updatePartner: (id: string, patch: Partial<Partner>) => void;
  addUser: (user: Omit<User, "id">) => void;
  updateUser: (id: string, patch: Partial<User>) => void;
  setRecommendationStatus: (id: string, status: Recommendation["status"]) => void;
  addQuote: (quote: Omit<Quote, "id" | "status">) => void;
  addReport: (clientId: string, auditIds: string[]) => void;
  markReportSent: (id: string) => void;
  setJobStatus: (id: string, status: Job["status"], notes?: string) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

let counter = 100;
const nextId = (prefix: string) => `${prefix}-${++counter}`;
const today = () => new Date().toISOString().slice(0, 10);

export function AfadhaliStoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Data>({
    clients: seedClients,
    audits: seedAudits,
    waste: seedWaste,
    matches: seedMatches,
    partners: seedPartners,
    recommendations: seedRecommendations,
    quotes: seedQuotes,
    jobs: seedJobs,
    reports: seedReports,
    users: seedUsers,
    leads: seedLeads,
  });

  const value = useMemo<StoreValue>(
    () => ({
      ...data,
      // TODO(api): POST /leads
      addLead: (lead) =>
        setData((d) => ({
          ...d,
          leads: [
            { ...lead, id: nextId("le"), createdAt: today(), converted: false },
            ...d.leads,
          ],
        })),
      // TODO(api): POST /clients
      addClient: (client) =>
        setData((d) => ({
          ...d,
          clients: [{ ...client, id: nextId("cl"), lastActivity: today() }, ...d.clients],
        })),
      // TODO(api): PATCH /clients/:id
      updateClient: (id, patch) =>
        setData((d) => ({
          ...d,
          clients: d.clients.map((c) =>
            c.id === id ? { ...c, ...patch, lastActivity: today() } : c,
          ),
        })),
      // TODO(api): POST /audits (with nested waste entries)
      addAudit: (audit, entries) =>
        setData((d) => {
          const auditId = nextId("au");
          return {
            ...d,
            audits: [{ ...audit, id: auditId }, ...d.audits],
            waste: [
              ...entries.map((e) => ({ ...e, id: nextId("we"), auditId })),
              ...d.waste,
            ],
            clients: d.clients.map((c) =>
              c.id === audit.clientId
                ? {
                    ...c,
                    auditStatus: audit.status === "complete" ? "completed" : "in_progress",
                    lastActivity: today(),
                  }
                : c,
            ),
          };
        }),
      setWasteStatus: (id, status) =>
        setData((d) => ({
          ...d,
          waste: d.waste.map((w) => (w.id === id ? { ...w, status } : w)),
        })),
      addWasteNote: (id, note) =>
        setData((d) => ({
          ...d,
          waste: d.waste.map((w) =>
            w.id === id ? { ...w, notes: w.notes ? `${w.notes} — ${note}` : note } : w,
          ),
        })),
      setMatchStatus: (id, status) =>
        setData((d) => ({
          ...d,
          matches: d.matches.map((m) => (m.id === id ? { ...m, status } : m)),
        })),
      addMatch: (match) =>
        setData((d) => ({ ...d, matches: [{ ...match, id: nextId("ma") }, ...d.matches] })),
      addPartner: (partner) =>
        setData((d) => ({ ...d, partners: [{ ...partner, id: nextId("pa") }, ...d.partners] })),
      updatePartner: (id, patch) =>
        setData((d) => ({
          ...d,
          partners: d.partners.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        })),
      addUser: (user) =>
        setData((d) => ({ ...d, users: [{ ...user, id: nextId("us") }, ...d.users] })),
      updateUser: (id, patch) =>
        setData((d) => ({
          ...d,
          users: d.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),
      setRecommendationStatus: (id, status) =>
        setData((d) => ({
          ...d,
          recommendations: d.recommendations.map((r) => (r.id === id ? { ...r, status } : r)),
        })),
      addQuote: (quote) =>
        setData((d) => ({
          ...d,
          quotes: [{ ...quote, id: nextId("qu"), status: "submitted" }, ...d.quotes],
        })),
      addReport: (clientId, auditIds) =>
        setData((d) => ({
          ...d,
          reports: [
            { id: nextId("rp"), clientId, auditIds, generatedAt: today(), sent: false },
            ...d.reports,
          ],
        })),
      markReportSent: (id) =>
        setData((d) => ({
          ...d,
          reports: d.reports.map((r) => (r.id === id ? { ...r, sent: true } : r)),
        })),
      setJobStatus: (id, status, notes) =>
        setData((d) => ({
          ...d,
          jobs: d.jobs.map((j) => (j.id === id ? { ...j, status, notes: notes ?? j.notes } : j)),
        })),
    }),
    [data],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAfadhali() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAfadhali must be used inside AfadhaliStoreProvider");
  return ctx;
}
