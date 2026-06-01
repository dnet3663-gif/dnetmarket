import { MobileNav } from "./MobileNav";
import { DesktopNav } from "./DesktopNav";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div
      className="min-h-[100dvh] bg-background text-foreground flex flex-col font-sans selection:bg-primary/30 selection:text-primary overflow-x-hidden w-full"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <DesktopNav />
      <main className="flex-1 pb-[calc(64px+env(safe-area-inset-bottom))] md:pb-0 relative flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </main>
      <MobileNav />
    </div>
  );
}
