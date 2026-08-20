import { Link } from "@tanstack/react-router";

const nav = [
  { to: "/how-it-works", label: "How it works" },
  { to: "/sectors", label: "Sectors" },
  { to: "/collaborations", label: "Collaborations" },
  { to: "/team", label: "Team" },
] as const;

export function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-mono text-sm font-bold tracking-tighter">
          <span className="size-4 bg-primary" />
          AFADHALI
        </Link>
        <div className="hidden gap-8 font-mono text-[11px] uppercase tracking-widest md:flex">
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
          <Link to="/login" className="transition-colors hover:text-primary">
            Platform
          </Link>
        </div>
        <Link
          to="/contact"
          className="bg-foreground px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-background transition-colors hover:bg-primary"
        >
          Request Audit
        </Link>
      </div>
    </nav>
  );
}
