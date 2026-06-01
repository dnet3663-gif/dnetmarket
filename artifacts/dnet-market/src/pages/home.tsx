import { useMemo } from "react";
import { useLocation } from "wouter";
import { Bell, ArrowRight, Clock, TrendingUp, Flame, Sparkles, Coffee, Zap, Moon } from "lucide-react";
import { useGetHomepageSummary, useGetCart } from "@workspace/api-client-react";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function getTimeContext() {
  const hour = new Date().getHours();
  if (hour < 12) return {
    greeting: "Good morning",
    emoji: "☀️",
    tagline: "Start your day right.",
    bannerTheme: "from-amber-900/40 to-orange-900/20",
    icon: Coffee,
    pill: "Morning Picks",
    pillColor: "text-amber-400 bg-amber-400/10 border-amber-400/25",
  };
  if (hour < 17) return {
    greeting: "Good afternoon",
    emoji: "🌤️",
    tagline: "Deals dropping right now.",
    bannerTheme: "from-blue-900/30 to-zinc-900/40",
    icon: Zap,
    pill: "Afternoon Deals",
    pillColor: "text-blue-400 bg-blue-400/10 border-blue-400/25",
  };
  return {
    greeting: "Good evening",
    emoji: "🌙",
    tagline: "Evening delivery at your door.",
    bannerTheme: "from-purple-900/40 to-zinc-900/50",
    icon: Moon,
    pill: "Evening Specials",
    pillColor: "text-purple-400 bg-purple-400/10 border-purple-400/25",
  };
}

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: summary, isLoading } = useGetHomepageSummary();
  const { data: cart } = useGetCart();
  const timeCtx = useMemo(() => getTimeContext(), []);

  const handleSearch = (query: string) => {
    setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  const hasCartItems = cart && (cart.itemCount ?? 0) > 0;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8">
        <div className="flex justify-between items-center">
          <Skeleton className="w-32 h-10 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="w-full h-14 rounded-full" />
        <Skeleton className="w-full h-52 rounded-3xl" />
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1,2,3,4].map(i => <Skeleton key={i} className="min-w-[155px] h-52 rounded-2xl flex-shrink-0" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto md:px-8 py-4 space-y-7 page-enter">

      {/* ── Mobile Header ─────────────────────────────── */}
      <div className="md:hidden px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.35)]">
            <span className="text-primary-foreground font-bold text-sm tracking-tighter">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DNET</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
        </Button>
      </div>

      {/* ── Greeting + Search ─────────────────────────── */}
      <div className="px-4 md:px-0 space-y-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            {timeCtx.greeting} <span className="font-normal">{timeCtx.emoji}</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">{timeCtx.tagline}</p>
        </div>
        <div className="md:hidden">
          <VoiceSearch onSearch={handleSearch} placeholder="Search products, vendors..." />
        </div>
      </div>

      {/* ── "Continue Where You Left Off" ─────────────── */}
      {hasCartItems && (
        <div className="px-4 md:px-0">
          <Card
            onClick={() => setLocation('/cart')}
            className="p-4 bg-primary/8 border-primary/25 hover:border-primary/50 cursor-pointer transition-all flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">Continue where you left off</p>
              <p className="text-xs text-muted-foreground">
                {cart.itemCount} item{(cart.itemCount ?? 0) > 1 ? 's' : ''} waiting in your cart
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </Card>
        </div>
      )}

      {/* ── Hero Banner ───────────────────────────────── */}
      <div className="px-4 md:px-0">
        <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${timeCtx.bannerTheme} from-zinc-900 border border-white/8 shadow-2xl`}>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-12 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-primary/5 rounded-full blur-2xl translate-y-1/2" />

          <div className="relative z-10 p-6 md:p-12 flex items-center min-h-[220px] md:min-h-[280px]">
            <div className="w-full md:w-3/5 space-y-4">
              <div className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${timeCtx.pillColor}`}>
                <timeCtx.icon className="w-3 h-3" />
                {timeCtx.pill}
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                Africa's Luxury<br />
                <span className="gold-shimmer">Marketplace.</span>
              </h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-sm leading-relaxed">
                Curated products, handpicked vendors, ultra-fast delivery — right to your door.
              </p>
              <Button
                onClick={() => setLocation('/explore')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-7 py-5 h-auto text-sm font-semibold shadow-[0_0_24px_rgba(212,175,55,0.35)] transition-all active:scale-[0.97]"
              >
                Explore Now <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Flash Deals Strip ─────────────────────────── */}
      <div className="px-4 md:px-0">
        <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-red-900/30 to-orange-900/20 border border-red-500/15 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold text-orange-400">Flash Deals</span>
            <div className="flex items-center gap-1 bg-black/30 border border-orange-500/20 rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold text-orange-300">
              <Clock className="w-3 h-3" />
              04:32:11
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded-full px-3"
            onClick={() => setLocation('/products')}
          >
            See All <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </div>

      {/* ── Categories ────────────────────────────────── */}
      {summary?.categories && summary.categories.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Shop by Category</h3>
            <Button variant="link" className="text-primary text-xs h-auto p-0 gap-1" onClick={() => setLocation('/explore')}>
              All <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {summary.categories.slice(0, 8).map((category, i) => (
              <div
                key={category.id}
                onClick={() => setLocation(`/products?category=${category.slug}`)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden transition-all duration-300 group-hover:scale-[1.05] group-hover:border-primary/40 group-hover:shadow-[0_0_18px_rgba(212,175,55,0.18)] relative">
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <div className="w-6 h-6 rounded-full bg-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-[11px] font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors duration-200 line-clamp-1 leading-tight">{category.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Personalized Section (Time-based) ─────────── */}
      <section className="px-4 md:px-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recommended for You</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Fast Food & Drinks", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80", tag: "Delivery in 20min" },
            { label: "Tech & Gadgets", img: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80", tag: "Top Picks" },
            { label: "Fashion & Style", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", tag: "New Arrivals" },
            { label: "Home & Living", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80", tag: "Premium" },
          ].map((item) => (
            <Card
              key={item.label}
              onClick={() => setLocation('/explore')}
              className="relative overflow-hidden aspect-[4/3] cursor-pointer group border-white/5 hover:border-primary/30 transition-all"
            >
              <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white text-xs font-bold leading-tight">{item.label}</p>
                <p className="text-[10px] text-primary font-medium mt-0.5">{item.tag}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Trending Now ──────────────────────────────── */}
      {summary?.trendingProducts && summary.trendingProducts.length > 0 && (
        <section className="px-4 md:px-0 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Trending Now
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> LIVE
              </span>
            </h3>
            <Button variant="link" className="text-primary text-xs h-auto p-0 gap-1" onClick={() => setLocation('/products')}>
              See All <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
          <div className="flex overflow-x-auto gap-3 pb-3 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {summary.trendingProducts.map(product => (
              <Card
                key={product.id}
                onClick={() => setLocation(`/products/${product.id}`)}
                className="min-w-[155px] md:min-w-[195px] snap-start bg-card/60 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] transition-all duration-300 group flex-shrink-0"
              >
                <div className="aspect-square bg-white/5 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
                  />
                  {product.isTrending && (
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-primary text-[9px] font-bold px-2 py-0.5 rounded-full border border-primary/25 tracking-wide">
                      HOT
                    </div>
                  )}
                  {product.originalPrice && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
                      SALE
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-[13px] font-medium line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">{product.name}</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-[11px] text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Vendor Spotlight ──────────────────────────── */}
      <section className="px-4 md:px-0 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Vendor Spotlight</h3>
          <Button variant="link" className="text-primary text-xs h-auto p-0" onClick={() => setLocation('/vendors')}>
            All Vendors <ArrowRight className="w-3 h-3 ml-0.5" />
          </Button>
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-r from-primary/8 to-transparent p-5 flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-primary">D</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-base">DNET Premium Stores</h4>
              <span className="text-[9px] font-bold bg-primary/15 text-primary border border-primary/25 px-1.5 py-0.5 rounded-full">VERIFIED</span>
            </div>
            <p className="text-xs text-muted-foreground">200+ curated vendors across Nigeria</p>
          </div>
          <Button
            size="sm"
            className="bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 rounded-full text-xs px-4 flex-shrink-0"
            onClick={() => setLocation('/vendors')}
          >
            Explore
          </Button>
        </div>
      </section>

    </div>
  );
}
