import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { roleHome, useAuth } from "@/lib/afadhali/auth";

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

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const inputClass =
    "w-full border border-background/20 bg-background/5 px-3 py-2.5 text-sm text-background outline-none placeholder:text-background/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-foreground text-background">
      <header className="border-b border-background/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-mono text-sm font-bold tracking-tighter"
          >
            <span className="size-4 bg-primary" />
            AFADHALI
          </Link>
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-widest opacity-50 hover:opacity-100"
          >
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
        </div>

        <form
          className="space-y-6 border border-background/10 bg-background/[0.03] p-8"
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const user = await signIn(email, password);
              toast.success(`Signed in as ${user.role}`);
              navigate({ to: roleHome[user.role] as never });
            } catch (err) {
              toast.error("Sign in failed. Check your email and password.");
              console.error(err);
            }
          }}
        >
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
