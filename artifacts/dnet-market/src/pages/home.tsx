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
    <div className="flex-1 w-full max-w-7xl mx-auto md:px-8 py-4 space-y-8">
      {/* Mobile Header */}
      <div className="md:hidden px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
            <span className="text-primary-foreground font-bold text-sm">D</span>
          </div>
          <span className="font-bold text-lg tracking-tight">DNET</span>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </Button>
      </div>

      <div className="px-4 md:px-0">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
          {getGreeting()}, <span className="text-muted-foreground">Guest</span>
        </h1>
        <div className="md:hidden mb-6">
          <VoiceSearch onSearch={handleSearch} />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="px-4 md:px-0">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 to-black border border-white/10 p-6 md:p-12 shadow-2xl flex items-center">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          
          <div className="relative z-10 w-full md:w-2/3 space-y-4">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse" />
              Premium Delivery Network
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">
              Africa's Luxury <br/>Marketplace.
            </h2>
            <p className="text-zinc-400 text-sm md:text-base max-w-md">
              Discover curated products with ultra-fast delivery. Handpicked vendors, uncompromising quality.
            </p>
            <Button onClick={() => setLocation('/explore')} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 h-auto text-base font-semibold shadow-[0_0_20px_rgba(212,175,55,0.4)] mt-4">
              Explore Now
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      {summary?.categories && summary.categories.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Categories</h3>
            <Button variant="link" className="text-primary text-sm h-auto p-0" onClick={() => setLocation('/explore')}>
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
            {summary.categories.slice(0, 8).map(category => (
              <div 
                key={category.id} 
                onClick={() => setLocation(`/products?category=${category.slug}`)}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-full aspect-square rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:border-primary/50 relative">
                  {category.imageUrl ? (
                     <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1">{category.name}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending */}
      {summary?.trendingProducts && summary.trendingProducts.length > 0 && (
        <section className="px-4 md:px-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="text-primary">🔥</span> Trending
            </h3>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
            {summary.trendingProducts.map(product => (
              <Card 
                key={product.id}
                onClick={() => setLocation(`/products/${product.id}`)}
                className="min-w-[160px] md:min-w-[200px] snap-start bg-card/50 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
              >
                <div className="aspect-square bg-white/5 relative">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                  {product.isTrending && (
                    <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-primary text-[10px] font-bold px-2 py-1 rounded-full border border-primary/20">
                      HOT
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium line-clamp-1 mb-1">{product.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">₦{product.originalPrice.toLocaleString()}</span>
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
