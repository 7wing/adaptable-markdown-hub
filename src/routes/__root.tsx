import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/afadhali/auth";
import { AfadhaliStoreProvider } from "@/lib/afadhali/store";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-extrabold tracking-tighter text-foreground">404</h1>
        <h2 className="mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          Page not found
        </h2>
        <p className="mt-4 text-sm text-muted-foreground">
          This record or page does not exist in the Afadhali registry.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center bg-foreground px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-background transition-colors hover:bg-primary"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-bold tracking-tight text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-primary-foreground"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-input px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-foreground"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Afadhali — Audit. Match. Swap." },
      {
        name: "description",
        content:
          "Afadhali audits industrial energy, water and waste, matches waste streams between businesses, and swaps what cannot be matched for cleaner alternatives.",
      },
      { name: "author", content: "Afadhali" },
      { property: "og:title", content: "Afadhali — Audit. Match. Swap." },
      {
        property: "og:description",
        content: "Measure what you have. Match what you waste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AfadhaliStoreProvider>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
          <Toaster />
        </AfadhaliStoreProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
