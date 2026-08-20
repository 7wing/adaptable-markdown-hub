import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useAuth } from "@/lib/afadhali/auth";
import type { Role } from "@/lib/afadhali/types";

const navByRole: Record<Role, { to: string; label: string }[]> = {
  admin: [
    { to: "/admin", label: "Overview" },
    { to: "/admin/clients", label: "Clients" },
    { to: "/admin/audits/new", label: "New audit" },
    { to: "/admin/waste", label: "Waste registry" },
    { to: "/admin/matches", label: "Match review" },
    { to: "/admin/partners", label: "Partners" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/reports", label: "Reports" },
  ],
  client: [
    { to: "/client", label: "Overview" },
    { to: "/client/scorecard", label: "Our scorecard" },
    { to: "/client/waste", label: "Our waste" },
    { to: "/client/matches", label: "Our matches" },
    { to: "/client/recommendations", label: "Recommendations" },
    { to: "/client/account", label: "Account" },
  ],
  partner: [
    { to: "/partner", label: "Overview" },
    { to: "/partner/requests", label: "Match requests" },
    { to: "/partner/quote", label: "Submit a quote" },
    { to: "/partner/jobs", label: "Job status" },
  ],
};

export function AppShell({
  role,
  title,
  subtitle,
  actions,
  children,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-foreground text-background">
      <header className="border-b border-background/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tighter">
            <span className="size-4 bg-primary" />
            AFADHALI / {role.toUpperCase()}
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden font-mono text-[10px] uppercase tracking-widest opacity-50 sm:block">
              {user?.name} {user?.organisationName ? `· ${user.organisationName}` : ""}
            </span>
            <button
              onClick={async () => {
                await signOut();
                navigate({ to: "/login" });
              }}
              className="border border-background/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="mb-2 text-3xl font-extrabold tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="font-mono text-[10px] uppercase tracking-widest opacity-50">{subtitle}</p>
            ) : null}
          </div>
          {actions}
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1 lg:border-r lg:border-background/10 lg:pr-6">
            <ul className="space-y-1 font-mono text-[11px] uppercase tracking-widest">
              {navByRole[role].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeOptions={{ exact: item.to.split("/").length === 2 }}
                    activeProps={{ className: "bg-primary text-primary-foreground" }}
                    className="block px-3 py-2 transition-colors hover:bg-background/5"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
          <div className="lg:col-span-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Panel({
  title,
  actions,
  children,
  className = "",
}: {
  title?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`border border-background/10 bg-background/[0.03] ${className}`}>
      {title ? (
        <div className="flex items-center justify-between border-b border-background/10 px-6 py-4">
          <h2 className="font-mono text-[11px] uppercase tracking-widest opacity-60">{title}</h2>
          {actions}
        </div>
      ) : null}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="border border-background/10 bg-background/5 px-4 py-3">
      <div className="font-mono text-[9px] uppercase tracking-widest opacity-40">{label}</div>
      <div className={`text-xl font-bold ${accent ? "text-ochre" : ""}`}>{value}</div>
    </div>
  );
}

export function Tag({ tone = "neutral", children }: { tone?: "neutral" | "warn" | "ok" | "bad"; children: ReactNode }) {
  const tones = {
    neutral: "bg-background/10 text-background/50",
    warn: "bg-ochre/20 text-ochre",
    ok: "bg-signal-ok/20 text-signal-ok",
    bad: "bg-destructive/20 text-destructive",
  } as const;
  return (
    <span className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function ActionButton({
  children,
  onClick,
  variant = "solid",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "solid" | "ghost";
  type?: "button" | "submit";
}) {
  const styles =
    variant === "solid"
      ? "bg-primary text-primary-foreground hover:opacity-90"
      : "border border-background/20 hover:bg-background/5";
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors ${styles}`}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-widest opacity-50">
        {label}
      </span>
      {children}
    </label>
  );
}

export const inputClass =
  "w-full border border-background/20 bg-background/5 px-3 py-2 text-sm text-background outline-none placeholder:text-background/30 focus:border-primary";
