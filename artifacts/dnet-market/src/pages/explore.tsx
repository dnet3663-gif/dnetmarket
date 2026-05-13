import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Store, Smartphone, Zap, ShoppingBag, Cpu, Star, Clock } from "lucide-react";
import { useListCategories, useListProducts, useListVendors } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { VoiceSearch } from "@/components/VoiceSearch";

const TABS = [
  { id: "marketplace", label: "Marketplace", icon: ShoppingBag, desc: "Products & Vendors" },
  { id: "express", label: "Express", icon: Zap, desc: "Fast Delivery" },
  { id: "digital", label: "Digital", icon: Cpu, desc: "Services" },
] as const;

type TabId = typeof TABS[number]["id"];

const digitalServices = [
  { id: 1, name: "Airtime Top-up", icon: Smartphone, color: "from-blue-600/30 to-blue-900/10 border-blue-500/20 text-blue-400", bg: "bg-blue-500/20" },
  { id: 2, name: "Pay Bills", icon: MapPin, color: "from-green-600/30 to-green-900/10 border-green-500/20 text-green-400", bg: "bg-green-500/20" },
  { id: 3, name: "Transfer Funds", icon: Store, color: "from-purple-600/30 to-purple-900/10 border-purple-500/20 text-purple-400", bg: "bg-purple-500/20" },
  { id: 4, name: "Buy Data", icon: Zap, color: "from-orange-600/30 to-orange-900/10 border-orange-500/20 text-orange-400", bg: "bg-orange-500/20" },
];

export default function Explore() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>("marketplace");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories();
  const { data: products, isLoading: isProductsLoading } = useListProducts();
  const { data: vendors, isLoading: isVendorsLoading } = useListVendors();

  const handleSearch = (query: string) => {
    if (query.trim()) setLocation(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-7xl mx-auto md:px-8 pb-24 md:pb-8 flex flex-col min-h-screen">

      {/* ── Sticky Header ─────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-white/[0.06] pt-4 pb-3 px-4 md:px-0 space-y-3">

        {/* Search */}
        <div className="hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, vendors, categories..."
              className="w-full pl-11 bg-white/5 border-white/10 rounded-full h-12 focus-visible:ring-primary"
              data-testid="explore-search-input"
            />
          </form>
        </div>
        <div className="md:hidden">
          <VoiceSearch onSearch={handleSearch} placeholder="Search products, vendors..." />
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                data-testid={`explore-tab-${tab.id}`}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 flex-shrink-0",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_0_16px_rgba(212,175,55,0.35)]"
                    : "bg-white/5 text-muted-foreground hover:bg-white/8 hover:text-foreground border border-white/8"
                )}
              >
                <tab.icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ───────────────────────────────── */}
      <div className="flex-1 px-4 md:px-0 pt-6">

        {/* MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-400">

            {/* Categories */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold tracking-tight">Shop by Category</h2>
                <Button variant="link" className="text-primary p-0 text-xs h-auto" onClick={() => setLocation('/products')}>View All</Button>
              </div>
              {isCategoriesLoading ? (
                <div className="flex gap-3 overflow-x-auto pb-3 hide-scrollbar">
                  {[1,2,3,4,5].map(i => <Skeleton key={i} className="min-w-[120px] h-32 rounded-2xl flex-shrink-0" />)}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-3 snap-x hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                  {categories?.map(category => (
                    <Card
                      key={category.id}
                      className="min-w-[130px] max-w-[130px] snap-start relative overflow-hidden rounded-2xl border-white/5 cursor-pointer group flex-shrink-0"
                      onClick={() => setLocation(`/products?category=${category.slug}`)}
                      data-testid={`category-card-${category.id}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                      {category.imageUrl && (
                        <img
                          src={category.imageUrl}
                          alt={category.name}
                          className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute bottom-3 left-3 right-3 z-20">
                        <p className="text-white font-semibold text-xs line-clamp-2 leading-tight">{category.name}</p>
                      </div>
                      <div className="absolute inset-0 ring-1 ring-primary/0 group-hover:ring-primary/40 rounded-2xl transition-all z-20" />
                    </Card>
                  ))}
                </div>
              )}
            </section>

            {/* Products Grid */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-bold tracking-tight">Featured Products</h2>
                <Button variant="link" className="text-primary p-0 text-xs h-auto" onClick={() => setLocation('/products')}>View All</Button>
              </div>
              {isProductsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[1,2,3,4,5,6,7,8].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {products?.slice(0, 8).map(product => (
                    <Card
                      key={product.id}
                      onClick={() => setLocation(`/products/${product.id}`)}
                      className="bg-card/60 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all duration-300 group"
                      data-testid={`product-card-${product.id}`}
                    >
                      <div className="aspect-square bg-white/5 relative overflow-hidden">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                        />
                        {(product as any).originalPrice && (
                          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-full">
                            SALE
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="text-[13px] font-medium line-clamp-1 mb-1 group-hover:text-primary transition-colors">{product.name}</h4>
                        <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* EXPRESS DELIVERY */}
        {activeTab === "express" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">

            {/* Express Hero Banner */}
            <div className="bg-gradient-to-r from-primary/12 via-primary/6 to-transparent border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/15 border border-primary/30 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(212,175,55,0.2)]">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base">DNET Express</h3>
                <p className="text-xs text-muted-foreground">Order from premium vendors near you. Delivery in 20–45 min.</p>
              </div>
            </div>

            {/* Delivery time slots */}
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {["Now", "Today", "Scheduled", "Tomorrow"].map((slot, i) => (
                <button
                  key={slot}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold flex-shrink-0 border transition-all",
                    i === 0
                      ? "bg-primary text-primary-foreground border-primary/50 shadow-[0_0_12px_rgba(212,175,55,0.3)]"
                      : "bg-white/5 text-muted-foreground border-white/8 hover:border-white/16 hover:text-foreground"
                  )}
                >
                  {i === 0 && <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse" />}
                  {slot}
                </button>
              ))}
            </div>

            {/* Vendor List */}
            <div className="space-y-3">
              {isVendorsLoading ? (
                [1,2,3].map(i => <Skeleton key={i} className="w-full h-24 rounded-2xl" />)
              ) : vendors && vendors.length > 0 ? (
                vendors.map(vendor => (
                  <Card
                    key={vendor.id}
                    onClick={() => setLocation(`/vendors/${vendor.id}`)}
                    className="p-4 bg-card/60 border-white/8 cursor-pointer hover:border-primary/25 hover:bg-white/4 transition-all group"
                    data-testid={`vendor-card-${vendor.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/8">
                        {vendor.logoUrl ? (
                          <img src={vendor.logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/15 text-primary font-bold text-xl">
                            {vendor.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm group-hover:text-primary transition-colors truncate">{vendor.name}</h4>
                          {vendor.isFeatured && (
                            <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 truncate">{vendor.description || vendor.categories?.[0] || "Premium Vendor"}</p>
                        <div className="flex items-center gap-3">
                          <div className="inline-flex items-center gap-1 bg-white/8 px-2 py-1 rounded-full text-[10px] font-semibold">
                            <Clock className="w-3 h-3 text-primary" />
                            <span>20–35 min</span>
                          </div>
                          {vendor.rating && (
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              {vendor.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <Store className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-sm text-muted-foreground">No express vendors available right now</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DIGITAL SERVICES */}
        {activeTab === "digital" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <div>
              <h2 className="text-base font-bold mb-1">Digital Services</h2>
              <p className="text-sm text-muted-foreground">Instant services — no delivery needed</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {digitalServices.map(service => (
                <Card
                  key={service.id}
                  className={cn(
                    "p-5 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all group border bg-gradient-to-br hover:scale-[1.02] hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
                    service.color
                  )}
                  onClick={() => {}}
                >
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", service.bg)}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <span className="font-semibold text-sm text-foreground">{service.name}</span>
                </Card>
              ))}
            </div>

            <div className="bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
              <p className="text-sm text-muted-foreground">More digital services coming soon</p>
              <p className="text-xs text-primary font-medium mt-1">Subscribe for early access →</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
