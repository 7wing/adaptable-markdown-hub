import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { roleHome, useAuth } from "@/lib/afadhali/auth";
import type { Role } from "@/lib/afadhali/types";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Platform login — Afadhali" },
      {
        name: "description",
        content:
          "Sign in to the Afadhali platform as staff, a client business, or a delivery partner.",
      },
      { property: "og:title", content: "Afadhali platform login" },
      {
        property: "og:description",
        content: "Admin, client and partner access to audits, the waste registry and matches.",
      },
    ],
  }),
  component: LoginPage,
});

const roles: { role: Role; label: string; blurb: string }[] = [
  { role: "admin", label: "Afadhali staff", blurb: "Full access: clients, audits, registry, matches, partners, users, reports." },
  { role: "client", label: "Client business", blurb: "Your scorecard, your waste registry, your matches and recommendations." },
  { role: "partner", label: "Delivery partner", blurb: "Requests relevant to you, quotes and job status." },
];

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputClass =
    "w-full border border-background/20 bg-background/5 px-3 py-2.5 text-sm text-background outline-none placeholder:text-background/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-foreground text-background">
      <header className="border-b border-background/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tighter">
            <span className="size-4 bg-primary" />
            AFADHALI
          </Link>
          <Link to="/" className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100">
            Back to site
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-5xl gap-12 px-6 py-24 lg:grid-cols-2">
        <div>
          <span className="label-mono mb-6 block text-ochre">[ Platform access ]</span>
          <h1 className="text-balance text-4xl font-extrabold leading-[0.95] tracking-tighter md:text-5xl">
            SIGN IN TO THE OPERATING PLATFORM.
          </h1>
          <p className="mt-6 max-w-[45ch] text-sm leading-relaxed opacity-60">
            Three roles, three views. Staff see everything; a client sees only their own data; a
            partner sees only the jobs relevant to what they offer.
          </p>
          <p className="mt-8 border border-ochre/30 bg-ochre/10 p-4 font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ochre">
            Demo auth — no password is checked. Wire your own provider in
            src/lib/afadhali/auth.tsx.
          </p>
        </div>

        <form
          className="space-y-6 border border-background/10 bg-background/[0.03] p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            // TODO(auth): call your real sign-in endpoint here.
            const user = await signIn(role, email || undefined);
            toast.success(`Signed in as ${user.role}`);
            navigate({ to: roleHome[user.role] as never });
          }}
        >
          <div>
            <span className="label-mono mb-3 block opacity-50">Sign in as</span>
            <div className="space-y-2">
              {roles.map((option) => (
                <button
                  key={option.role}
                  type="button"
                  onClick={() => setRole(option.role)}
                  className={`w-full border p-4 text-left transition-colors ${
                    role === option.role
                      ? "border-primary bg-primary/10"
                      : "border-background/15 hover:bg-background/5"
                  }`}
                >
                  <div className="font-mono text-[11px] uppercase tracking-widest">
                    {option.label}
                  </div>
                  <div className="mt-1 text-xs opacity-50">{option.blurb}</div>
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="label-mono mb-2 block opacity-50">Email</span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.co.ke"
            />
          </label>
          <label className="block">
            <span className="label-mono mb-2 block opacity-50">Password</span>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-primary px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-primary-foreground"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
