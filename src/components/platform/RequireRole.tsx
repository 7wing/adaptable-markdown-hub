import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { roleHome, useAuth } from "@/lib/afadhali/auth";
import type { Role } from "@/lib/afadhali/types";

/**
 * UI-level role gate for the three portals.
 * TODO(auth): enforce the same rule server-side once a real backend is wired —
 * this only hides the screen, it does not protect data.
 */
export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-foreground text-background">
        <span className="label-mono opacity-50">Checking session…</span>
      </div>
    );
  }

  if (!user) {
    return (
      <Gate
        title="Sign in required"
        body="This area of the platform needs an account."
        to="/login"
        cta="Go to login"
      />
    );
  }

  if (user.role !== role) {
    return (
      <Gate
        title="Wrong portal"
        body={`You are signed in as ${user.role}. Continue to your own portal.`}
        to={roleHome[user.role]}
        cta={`Open ${user.role} portal`}
      />
    );
  }

  return <>{children}</>;
}

function Gate({
  title,
  body,
  to,
  cta,
}: {
  title: string;
  body: string;
  to: string;
  cta: string;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground px-6 text-background">
      <div className="max-w-md border border-background/10 bg-background/[0.03] p-10 text-center">
        <div className="label-mono mb-4 text-ochre">Access</div>
        <h1 className="text-2xl font-extrabold tracking-tighter">{title}</h1>
        <p className="mt-3 text-sm opacity-60">{body}</p>
        <Link
          to={to as never}
          className="mt-8 inline-block bg-primary px-6 py-3 font-mono text-[10px] uppercase tracking-widest text-primary-foreground"
        >
          {cta}
        </Link>
      </div>
    </div>
  );
}
