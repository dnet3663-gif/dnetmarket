import { Link, useLocation } from "wouter";
import { Search, ShoppingBag, Bell, User, ChevronDown } from "lucide-react";
import { VoiceSearch } from "@/components/VoiceSearch";
import { useGetCart } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DesktopNav() {
  const [location, setLocation] = useLocation();
  const { data: cart } = useGetCart();

  // Hide on specific routes
  if (
    location.startsWith("/checkout") ||
    location.startsWith("/order-confirmation") ||
    location === "/login"
  ) {
    return null;
  }

  const handleSearch = (query: string) => {
    setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  const navLinks = [
    { href: "/explore", label: "Explore", match: (l: string) => l.startsWith("/explore") },
    { href: "/vendors", label: "Vendors", match: (l: string) => l.startsWith("/vendors") },
    { href: "/products", label: "Products", match: (l: string) => l.startsWith("/products") },
  ];

  return (
    <header className="hidden md:flex sticky top-0 z-50 w-full h-[68px] items-center justify-between px-8 bg-background/85 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04)]">
      <div className="flex items-center gap-10 flex-1">
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_14px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_24px_rgba(212,175,55,0.5)] transition-all duration-300">
            <span className="text-primary-foreground font-bold text-lg tracking-tighter">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DNET</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label, match }) => {
            const isActive = match(location);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-3.5 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
                  isActive
                    ? "text-primary bg-primary/8"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1 max-w-md">
          <VoiceSearch onSearch={handleSearch} className="w-full" />
        </div>
      </div>

      <div className="flex items-center gap-2 ml-6">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
        </Button>

        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <ShoppingBag className="w-5 h-5" />
            {cart && (cart.itemCount ?? 0) > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center px-1 shadow-[0_0_8px_rgba(212,175,55,0.6)] animate-in zoom-in duration-200">
                {(cart.itemCount ?? 0) > 9 ? "9+" : cart.itemCount}
              </span>
            )}
          </Button>
        </Link>

        <div className="w-px h-7 bg-white/8 mx-1" />

        <Link href="/account">
          <Button variant="ghost" className="rounded-full hover:bg-white/5 flex items-center gap-2 pl-1.5 pr-3.5 text-muted-foreground hover:text-foreground transition-colors">
            <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/20 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-primary" />
            </div>
            <span className="text-sm font-medium">Account</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
