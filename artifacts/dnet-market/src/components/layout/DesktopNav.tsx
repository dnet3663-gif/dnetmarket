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

  return (
    <header className="hidden md:flex sticky top-0 z-50 w-full h-20 items-center justify-between px-8 bg-background/80 backdrop-blur-xl border-b border-white/5 shadow-sm">
      <div className="flex items-center gap-12 flex-1">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.5)] transition-all duration-300">
            <span className="text-primary-foreground font-bold text-xl tracking-tighter">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight">DNET</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="/explore" className={cn("text-sm font-medium transition-colors hover:text-primary", location.startsWith("/explore") ? "text-primary" : "text-muted-foreground")}>Explore</Link>
          <Link href="/vendors" className={cn("text-sm font-medium transition-colors hover:text-primary", location.startsWith("/vendors") ? "text-primary" : "text-muted-foreground")}>Vendors</Link>
          <Link href="/products" className={cn("text-sm font-medium transition-colors hover:text-primary", location === "/products" ? "text-primary" : "text-muted-foreground")}>Products</Link>
        </div>

        <div className="flex-1 max-w-xl ml-8">
          <VoiceSearch onSearch={handleSearch} className="w-full" />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-8">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
        </Button>
        
        <Link href="/cart">
          <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5">
            <ShoppingBag className="w-5 h-5" />
            {cart && cart.itemCount && cart.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.5)] animate-in zoom-in">
                {cart.itemCount}
              </span>
            )}
          </Button>
        </Link>

        <div className="w-px h-8 bg-white/10 mx-2" />

        <Link href="/account">
          <Button variant="ghost" className="rounded-full hover:bg-white/5 flex items-center gap-2 pl-2 pr-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Account</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
