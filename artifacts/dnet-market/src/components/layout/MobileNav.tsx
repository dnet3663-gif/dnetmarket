import { Link, useLocation } from "wouter";
import { Home, Compass, ShoppingBag, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetCart } from "@workspace/api-client-react";

export function MobileNav() {
  const [location] = useLocation();
  const { data: cart } = useGetCart();

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

  const cartCount = cart?.itemCount ?? 0;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom)]">
      {/* Glassmorphism bar */}
      <div className="bg-background/88 backdrop-blur-2xl border-t border-white/[0.07] shadow-[0_-8px_32px_rgba(0,0,0,0.4)] h-16 flex items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = item.href === "/"
            ? location === "/"
            : location.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2 group"
            >
              {/* Active pill background */}
              {isActive && (
                <div className="absolute inset-x-1 top-1 bottom-1 rounded-xl bg-primary/10 -z-10" />
              )}

              <div className="relative">
                <item.icon className={cn(
                  "w-[22px] h-[22px] transition-all duration-300",
                  isActive
                    ? "text-primary scale-110 drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]"
                    : "text-muted-foreground group-hover:text-foreground group-hover:scale-105"
                )} />

                {/* Cart badge */}
                {item.href === "/cart" && cartCount > 0 && (
                  <div className={cn(
                    "absolute -top-1.5 -right-2 min-w-[17px] h-[17px] rounded-full text-[9px] font-bold flex items-center justify-center px-1 transition-all",
                    isActive
                      ? "bg-primary/80 text-primary-foreground"
                      : "bg-primary text-primary-foreground shadow-[0_0_8px_rgba(212,175,55,0.5)]"
                  )}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </div>
                )}

                {/* Active dot */}
                {isActive && item.href !== "/cart" && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.9)]" />
                )}
              </div>

              <span className={cn(
                "text-[10px] font-semibold transition-colors duration-300",
                isActive ? "text-primary" : "text-muted-foreground/70 group-hover:text-muted-foreground"
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
