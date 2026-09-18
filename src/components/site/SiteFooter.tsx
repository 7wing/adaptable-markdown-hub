import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-6 py-12 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      <div>Afadhali — Audit. Match. Swap. © 2026</div>
      <div className="flex gap-8">
        <Link to="/how-it-works" className="hover:text-primary">
          Method
        </Link>
        <Link to="/collaborations" className="hover:text-primary">
          Policy alignment
        </Link>
        <Link to="/contact" className="hover:text-primary">
          Contact
        </Link>
      </div>
    </footer>
  );
}
