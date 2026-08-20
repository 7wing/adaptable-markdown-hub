// Core data model for Afadhali (see platform specification, section 3).
// These types are the contract your real API should satisfy — keep them as-is
// and swap the mock implementation in `store.tsx` for real network calls.

export type Role = "admin" | "client" | "partner";

export type AuditStatus = "not_started" | "in_progress" | "completed";
export type WasteStatus = "unmatched" | "matched" | "resolved";
export type MatchStatus =
  | "proposed"
  | "approved"
  | "rejected"
  | "accepted_by_client"
  | "declined_by_client";
export type RecommendationStatus = "suggested" | "quote_requested" | "dismissed" | "completed";
export type JobStatus = "scheduled" | "in_progress" | "completed";

export interface Client {
  id: string;
  company: string;
  sector: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  auditStatus: AuditStatus;
  lastActivity: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organisationId?: string;
  organisationName?: string;
  status: "active" | "inactive";
}

export interface Audit {
  id: string;
  clientId: string;
  date: string;
  status: "draft" | "complete";
  energySource: string;
  energyCostMonthly: number;
  machineNotes: string;
  waterUseNotes: string;
  energyScore: number;
  wasteScore: number;
  overallScore: number;
  summary: string;
}

export interface WasteEntry {
  id: string;
  auditId: string;
  clientId: string;
  material: string;
  volume: string;
  frequency: string;
  handling: string;
  status: WasteStatus;
  notes: string;
}

export interface Match {
  id: string;
  entryAId: string;
  entryBId?: string;
  partnerId?: string;
  status: MatchStatus;
  reasoning: string;
  distanceKm: number;
}

export interface Partner {
  id: string;
  company: string;
  offers: string[];
  serviceArea: string;
  contactPerson: string;
  email: string;
  status: "active" | "inactive";
}

export interface Recommendation {
  id: string;
  clientId: string;
  title: string;
  description: string;
  benefit: string;
  partnerId?: string;
  status: RecommendationStatus;
}

export interface Quote {
  id: string;
  partnerId: string;
  recommendationId?: string;
  matchId?: string;
  clientId: string;
  price: number;
  timeline: string;
  conditions: string;
  status: "submitted" | "accepted" | "declined";
}

export interface Job {
  id: string;
  partnerId: string;
  clientId: string;
  description: string;
  status: JobStatus;
  notes: string;
}

export interface Report {
  id: string;
  clientId: string;
  auditIds: string[];
  generatedAt: string;
  sent: boolean;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  sector: string;
  message: string;
  createdAt: string;
  converted: boolean;
}
