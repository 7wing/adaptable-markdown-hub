import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/sectors", label: "Sectors" },
  { to: "/collaborations", label: "Policy alignment" },
] as const;

export function SiteHeader() {
  return (
    <nav className="sticky top-4 z-50 mx-4 rounded-full border border-border bg-background/90 shadow-[0_10px_30px_oklch(0.297_0_0/8%)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_14px_36px_oklch(0.297_0_0/12%)] md:mx-auto md:max-w-6xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 font-mono text-sm font-bold tracking-tighter"
        >
          <img src="/afadhali-logo.svg" alt="" className="h-6 w-7 object-contain" />
          AFADHALI
        </Link>
        <div className="hidden gap-7 font-mono text-[11px] uppercase tracking-widest md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="transition-colors hover:text-primary"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <Link
          to="/contact"
          className="shrink-0 rounded-md bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background transition-[background-color,transform] duration-200 hover:-translate-y-0.5 hover:bg-primary"
        >
          Join the waitlist
        </Link>
      </div>
    </nav>
  );
}
