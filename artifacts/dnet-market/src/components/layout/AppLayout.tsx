import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary">
      <DesktopNav />
      <main className="flex-1 pb-16 md:pb-0 relative flex flex-col">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
