import { useLocation } from "wouter";
import { Search, Bell, Clock, ArrowRight } from "lucide-react";
import { useGetHomepageSummary } from "@workspace/api-client-react";
import { VoiceSearch } from "@/components/VoiceSearch";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [, setLocation] = useLocation();
  const { data: summary, isLoading } = useGetHomepageSummary();

  const handleSearch = (query: string) => {
    setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-8 animate-pulse">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="w-32 h-10 rounded-xl" />
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <Skeleton className="w-full h-14 rounded-full" />
        <Skeleton className="w-full h-48 rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto md:px-8 py-4 space-y-8 page-enter">
      {/* Mobile Header */}
      <div className="md:hidden px-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_12px_rgba(212,175,55,0.35)]">
            <span className="text-primary-foreground font-bold text-sm tracking-tighter">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DNET</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-white/5">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_rgba(212,175,55,0.8)]" />
        </Button>
      </div>

      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
          {getGreeting()} <span className="text-muted-foreground font-normal">👋</span>
        </h1>
        <p className="text-muted-foreground text-sm mb-5">What are you looking for today?</p>
        <div className="md:hidden">
          <VoiceSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-4 md:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-black border border-white/8 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-luminosity" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 p-6 md:p-12 flex items-center min-h-[200px] md:min-h-[260px]">
            <div className="w-full md:w-3/5 space-y-4">
              <div className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-primary mr-2 animate-pulse" />
                Premium Delivery Network
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
                Africa's Luxury<br/>
                <span className="gold-shimmer">Marketplace.</span>
              </h2>
              <p className="text-zinc-400 text-sm md:text-base max-w-sm leading-relaxed">
                Curated products, handpicked vendors, ultra-fast delivery — delivered to your door.
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

      {/* Categories */}
      {summary?.categories && summary.categories.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold tracking-tight">Shop by Category</h3>
            <Button variant="link" className="text-primary text-sm h-auto p-0 gap-1" onClick={() => setLocation('/explore')}>
              View All <ArrowRight className="w-3.5 h-3.5" />
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
                <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 overflow-hidden transition-all duration-300 group-hover:scale-[1.04] group-hover:border-primary/40 group-hover:shadow-[0_0_16px_rgba(212,175,55,0.15)] relative">
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

      {/* Trending */}
      {summary?.trendingProducts && summary.trendingProducts.length > 0 && (
        <section className="px-4 md:px-0 pb-6 md:pb-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold tracking-tight flex items-center gap-2">
              Trending Now
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary border border-primary/30 bg-primary/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> HOT
              </span>
            </h3>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-3 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
            {summary.trendingProducts.map(product => (
              <Card
                key={product.id}
                onClick={() => setLocation(`/products/${product.id}`)}
                className="min-w-[155px] md:min-w-[195px] snap-start bg-card/60 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group flex-shrink-0"
              >
                <div className="aspect-square bg-white/5 relative overflow-hidden">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
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
                  <h4 className="text-sm font-medium line-clamp-1 mb-1.5 group-hover:text-primary transition-colors">{product.name}</h4>
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
    </div>
  );
}
