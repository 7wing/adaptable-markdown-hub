/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuth } from "./auth";
import { supabase } from "./supabase";
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
  refetch: () => Promise<void>;
  addLead: (lead: Omit<Lead, "id" | "createdAt" | "converted">) => Promise<void>;
  addClient: (client: Omit<Client, "id" | "lastActivity">) => Promise<void>;
  updateClient: (id: string, patch: Partial<Client>) => Promise<void>;
  addAudit: (
    audit: Omit<Audit, "id">,
    entries: Omit<WasteEntry, "id" | "auditId">[],
  ) => Promise<void>;
  setWasteStatus: (id: string, status: WasteEntry["status"]) => Promise<void>;
  addWasteNote: (id: string, note: string) => Promise<void>;
  setMatchStatus: (id: string, status: Match["status"]) => Promise<void>;
  addMatch: (match: Omit<Match, "id">) => Promise<void>;
  updateMatch: (id: string, patch: Partial<Match>) => Promise<void>;
  deleteMatch: (id: string) => Promise<void>;
  addPartner: (partner: Omit<Partner, "id">) => Promise<void>;
  updatePartner: (id: string, patch: Partial<Partner>) => Promise<void>;
  addUser: (user: Omit<User, "id">) => Promise<void>;
  updateUser: (id: string, patch: Partial<User>) => Promise<void>;
  setRecommendationStatus: (id: string, status: Recommendation["status"]) => Promise<void>;
  addRecommendation: (rec: Omit<Recommendation, "id" | "status">) => Promise<void>;
  addQuote: (quote: Omit<Quote, "id" | "status">) => Promise<void>;
  setQuoteStatus: (id: string, status: "declined") => Promise<void>;
  acceptQuoteAndCreateJob: (id: string, description: string) => Promise<void>;
  addReport: (clientId: string, auditIds: string[]) => Promise<void>;
  markReportSent: (id: string) => Promise<void>;
  setJobStatus: (id: string, status: Job["status"], notes?: string) => Promise<void>;
}

const StoreContext = createContext<StoreValue | null>(null);
const today = () => new Date().toISOString().slice(0, 10);

// --- row <-> app-shape mappers (snake_case DB columns -> camelCase types) ---
const mapClient = (r: any): Client => ({
  id: r.id,
  company: r.company,
  sector: r.sector,
  location: r.location,
  contactPerson: r.contact_person,
  email: r.email,
  phone: r.phone,
  status: r.status,
  auditStatus: r.audit_status,
  lastActivity: r.last_activity,
});
const mapAudit = (r: any): Audit => ({
  id: r.id,
  clientId: r.client_id,
  date: r.date,
  status: r.status,
  energySource: r.energy_source,
  energyCostMonthly: r.energy_cost_monthly,
  machineNotes: r.machine_notes,
  waterUseNotes: r.water_use_notes,
  energyScore: r.energy_score,
  wasteScore: r.waste_score,
  overallScore: r.overall_score,
  summary: r.summary,
});
const mapWaste = (r: any): WasteEntry => ({
  id: r.id,
  auditId: r.audit_id,
  clientId: r.client_id,
  material: r.material,
  volume: r.volume,
  frequency: r.frequency,
  handling: r.handling,
  status: r.status,
  notes: r.notes ?? "",
});
const mapMatch = (r: any): Match => ({
  id: r.id,
  entryAId: r.entry_a_id,
  entryBId: r.entry_b_id ?? undefined,
  partnerId: r.partner_id ?? undefined,
  status: r.status,
  reasoning: r.reasoning,
  distanceKm: r.distance_km,
});
const mapPartner = (r: any): Partner => ({
  id: r.id,
  company: r.company,
  offers: r.offers,
  serviceArea: r.service_area,
  contactPerson: r.contact_person,
  email: r.email,
  status: r.status,
});
const mapRecommendation = (r: any): Recommendation => ({
  id: r.id,
  clientId: r.client_id,
  title: r.title,
  description: r.description,
  benefit: r.benefit,
  partnerId: r.partner_id ?? undefined,
  status: r.status,
});
const mapQuote = (r: any): Quote => ({
  id: r.id,
  partnerId: r.partner_id,
  recommendationId: r.recommendation_id ?? undefined,
  matchId: r.match_id ?? undefined,
  clientId: r.client_id,
  price: r.price,
  timeline: r.timeline,
  conditions: r.conditions,
  status: r.status,
});
const mapJob = (r: any): Job => ({
  id: r.id,
  partnerId: r.partner_id,
  clientId: r.client_id,
  description: r.description,
  status: r.status,
  notes: r.notes ?? "",
});
const mapReport = (r: any): Report => ({
  id: r.id,
  clientId: r.client_id,
  auditIds: r.audit_ids,
  generatedAt: r.generated_at,
  sent: r.sent,
});
const mapLead = (r: any): Lead => ({
  id: r.id,
  name: r.name,
  company: r.company,
  sector: r.sector,
  message: r.message,
  createdAt: r.created_at,
  converted: r.converted,
});
const mapUser = (r: any): User => ({
  id: r.id,
  name: r.name,
  email: r.email,
  role: r.role,
  organisationId: r.organisation_id ?? undefined,
  organisationName: r.organisation_name ?? undefined,
  status: r.status,
});

export function AfadhaliStoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<Data>({
    clients: [],
    audits: [],
    waste: [],
    matches: [],
    partners: [],
    recommendations: [],
    quotes: [],
    jobs: [],
    reports: [],
    users: [],
    leads: [],
  });

  const refetch = async () => {
    const [
      clients,
      audits,
      waste,
      matches,
      partners,
      recommendations,
      quotes,
      jobs,
      reports,
      users,
      leads,
    ] = await Promise.all([
      supabase.from("clients").select("*"),
      supabase.from("audits").select("*"),
      supabase.from("waste_entries").select("*"),
      supabase.from("matches").select("*"),
      supabase.from("partners").select("*"),
      supabase.from("recommendations").select("*"),
      supabase.from("quotes").select("*"),
      supabase.from("jobs").select("*"),
      supabase.from("reports").select("*"),
      supabase.from("profiles").select("*"),
      supabase.from("leads").select("*"),
    ]);

    setData({
      clients: (clients.data ?? []).map(mapClient),
      audits: (audits.data ?? []).map(mapAudit),
      waste: (waste.data ?? []).map(mapWaste),
      matches: (matches.data ?? []).map(mapMatch),
      partners: (partners.data ?? []).map(mapPartner),
      recommendations: (recommendations.data ?? []).map(mapRecommendation),
      quotes: (quotes.data ?? []).map(mapQuote),
      jobs: (jobs.data ?? []).map(mapJob),
      reports: (reports.data ?? []).map(mapReport),
      users: (users.data ?? []).map(mapUser),
      leads: (leads.data ?? []).map(mapLead),
    });
  };

  useEffect(() => {
    refetch();
  }, [user?.id]);

  const value: StoreValue = {
    ...data,
    refetch,

    addLead: async (lead) => {
      await supabase.from("leads").insert({
        name: lead.name,
        company: lead.company,
        sector: lead.sector,
        message: lead.message,
      });
      await refetch();
    },

    addClient: async (client) => {
      await supabase.from("clients").insert({
        company: client.company,
        sector: client.sector,
        location: client.location,
        contact_person: client.contactPerson,
        email: client.email,
        phone: client.phone,
        status: client.status,
        audit_status: client.auditStatus,
      });
      await refetch();
    },

    updateClient: async (id, patch) => {
      const row: Record<string, unknown> = { last_activity: today() };
      if (patch.company !== undefined) row["company"] = patch.company;
      if (patch.sector !== undefined) row["sector"] = patch.sector;
      if (patch.location !== undefined) row["location"] = patch.location;
      if (patch.contactPerson !== undefined) row["contact_person"] = patch.contactPerson;
      if (patch.email !== undefined) row["email"] = patch.email;
      if (patch.phone !== undefined) row["phone"] = patch.phone;
      if (patch.status !== undefined) row["status"] = patch.status;
      if (patch.auditStatus !== undefined) row["audit_status"] = patch.auditStatus;
      await supabase.from("clients").update(row).eq("id", id);
      await refetch();
    },

    addAudit: async (audit, entries) => {
      const { data: inserted, error } = await supabase
        .from("audits")
        .insert({
          client_id: audit.clientId,
          date: audit.date,
          status: audit.status,
          energy_source: audit.energySource,
          energy_cost_monthly: audit.energyCostMonthly,
          machine_notes: audit.machineNotes,
          water_use_notes: audit.waterUseNotes,
          energy_score: audit.energyScore,
          waste_score: audit.wasteScore,
          overall_score: audit.overallScore,
          summary: audit.summary,
        })
        .select()
        .single();
      if (error || !inserted) throw error;

      if (entries.length > 0) {
        await supabase.from("waste_entries").insert(
          entries.map((e) => ({
            audit_id: inserted.id,
            client_id: e.clientId,
            material: e.material,
            volume: e.volume,
            frequency: e.frequency,
            handling: e.handling,
            status: e.status,
            notes: e.notes,
          })),
        );
      }
      await supabase
        .from("clients")
        .update({
          audit_status: audit.status === "complete" ? "completed" : "in_progress",
          last_activity: today(),
        })
        .eq("id", audit.clientId);
      await refetch();
    },

    setWasteStatus: async (id, status) => {
      await supabase.from("waste_entries").update({ status }).eq("id", id);
      await refetch();
    },

    addWasteNote: async (id, note) => {
      const current = data.waste.find((w) => w.id === id);
      const notes = current?.notes ? `${current.notes} — ${note}` : note;
      await supabase.from("waste_entries").update({ notes }).eq("id", id);
      await refetch();
    },

    setMatchStatus: async (id, status) => {
      await supabase.from("matches").update({ status }).eq("id", id);
      await refetch();
    },

    addMatch: async (match) => {
      await supabase.from("matches").insert({
        entry_a_id: match.entryAId,
        entry_b_id: match.entryBId ?? null,
        partner_id: match.partnerId ?? null,
        status: match.status,
        reasoning: match.reasoning,
        distance_km: match.distanceKm,
      });
      await refetch();
    },

    updateMatch: async (id, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.reasoning !== undefined) row["reasoning"] = patch.reasoning;
      if (patch.distanceKm !== undefined) row["distance_km"] = patch.distanceKm;
      if (patch.status !== undefined) row["status"] = patch.status;
      if (patch.partnerId !== undefined) row["partner_id"] = patch.partnerId;
      await supabase.from("matches").update(row).eq("id", id);
      await refetch();
    },

    deleteMatch: async (id) => {
      await supabase.from("matches").delete().eq("id", id);
      await refetch();
    },

    addPartner: async (partner) => {
      await supabase.from("partners").insert({
        company: partner.company,
        offers: partner.offers,
        service_area: partner.serviceArea,
        contact_person: partner.contactPerson,
        email: partner.email,
        status: partner.status,
      });
      await refetch();
    },

    updatePartner: async (id, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.company !== undefined) row["company"] = patch.company;
      if (patch.offers !== undefined) row["offers"] = patch.offers;
      if (patch.serviceArea !== undefined) row["service_area"] = patch.serviceArea;
      if (patch.contactPerson !== undefined) row["contact_person"] = patch.contactPerson;
      if (patch.email !== undefined) row["email"] = patch.email;
      if (patch.status !== undefined) row["status"] = patch.status;
      await supabase.from("partners").update(row).eq("id", id);
      await refetch();
    },

    addUser: async () => {
      // Real invites happen via Supabase Auth admin API (server-side / edge function),
      // not a direct table insert. See Phase 5 (user invites) for the edge function that does this.
      console.warn("addUser: wire this to the invite-user edge function from Phase 5");
    },

    updateUser: async (id, patch) => {
      const row: Record<string, unknown> = {};
      if (patch.status !== undefined) row["status"] = patch.status;
      if (patch.name !== undefined) row["name"] = patch.name;
      await supabase.from("profiles").update(row).eq("id", id);
      await refetch();
    },

    setRecommendationStatus: async (id, status) => {
      await supabase.from("recommendations").update({ status }).eq("id", id);
      await refetch();
    },

    addRecommendation: async (rec) => {
      await supabase.from("recommendations").insert({
        client_id: rec.clientId,
        title: rec.title,
        description: rec.description,
        benefit: rec.benefit,
        partner_id: rec.partnerId ?? null,
        status: "suggested",
      });
      await refetch();
    },

    addQuote: async (quote) => {
      await supabase.from("quotes").insert({
        partner_id: quote.partnerId,
        recommendation_id: quote.recommendationId ?? null,
        match_id: quote.matchId ?? null,
        client_id: quote.clientId,
        price: quote.price,
        timeline: quote.timeline,
        conditions: quote.conditions,
        status: "submitted",
      });
      await refetch();
    },

    setQuoteStatus: async (id, status) => {
      await supabase.from("quotes").update({ status }).eq("id", id);
      await refetch();
    },

    acceptQuoteAndCreateJob: async (id, description) => {
      const quote = data.quotes.find((q) => q.id === id);
      if (!quote) return;
      await supabase.from("quotes").update({ status: "accepted" }).eq("id", id);
      await supabase.from("jobs").insert({
        partner_id: quote.partnerId,
        client_id: quote.clientId,
        description,
        status: "scheduled",
        notes: "",
      });
      await refetch();
    },

    addReport: async (clientId, auditIds) => {
      await supabase.from("reports").insert({
        client_id: clientId,
        audit_ids: auditIds,
        generated_at: today(),
        sent: false,
      });
      await refetch();
    },

    markReportSent: async (id) => {
      await supabase.from("reports").update({ sent: true }).eq("id", id);
      await refetch();
    },

    setJobStatus: async (id, status, notes) => {
      const row: Record<string, unknown> = { status };
      if (notes !== undefined) row["notes"] = notes;
      await supabase.from("jobs").update(row).eq("id", id);
      await refetch();
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAfadhali() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAfadhali must be used inside AfadhaliStoreProvider");
  return ctx;
}
