import { Link, useLocation } from "wouter";
import { Home, Compass, ShoppingBag, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [location] = useLocation();

  // Hide on specific routes
  if (
    location.startsWith("/checkout") ||
    location.startsWith("/order-confirmation") ||
    location === "/login"
  ) {
    return null;
  }

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Cart", href: "/cart", icon: ShoppingBag },
    { name: "Support", href: "/support", icon: MessageSquare },
    { name: "Account", href: "/account", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-white/5 pb-[env(safe-area-inset-bottom)] px-2 h-16 flex items-center justify-around shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
      {navItems.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        
        return (
          <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-1 relative py-2">
            <div className={cn(
              "p-1.5 rounded-xl transition-all duration-300 relative",
              isActive ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}>
              <item.icon className={cn(
                "w-6 h-6 transition-transform duration-300",
                isActive && "scale-110"
              )} />
              {isActive && (
                <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
              )}
            </div>
            <span className={cn(
              "text-[10px] font-medium transition-colors duration-300",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
