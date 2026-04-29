import { ReactNode } from "react";
import { SiteHeader, SiteFooter } from "@/components/site/SiteChrome";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
