import { useState } from "react";
import { useLocation } from "wouter";
import { Search, MapPin, Store, Smartphone } from "lucide-react";
import { useListCategories, useListProducts, useListVendors } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Explore() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<"marketplace" | "express" | "digital">("marketplace");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories, isLoading: isCategoriesLoading } = useListCategories();
  const { data: products, isLoading: isProductsLoading } = useListProducts();
  const { data: vendors, isLoading: isVendorsLoading } = useListVendors();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const digitalServices = [
    { id: 1, name: "Airtime Top-up", icon: Smartphone, color: "bg-blue-500/20 text-blue-500" },
    { id: 2, name: "Pay Bills", icon: MapPin, color: "bg-green-500/20 text-green-500" },
    { id: 3, name: "Transfer Funds", icon: Store, color: "bg-purple-500/20 text-purple-500" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto md:px-8 pb-24 md:pb-8 flex flex-col min-h-screen">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-white/5 pt-4 pb-2 px-4 md:px-0">
        <form onSubmit={handleSearch} className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, vendors, categories..." 
            className="w-full pl-10 bg-white/5 border-white/10 rounded-full h-12"
            data-testid="explore-search-input"
          />
        </form>

        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {["marketplace", "express", "digital"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeTab === tab 
                  ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]" 
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
              )}
              data-testid={`explore-tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace("Express", "Express Delivery").replace("Digital", "Digital Services")}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 md:p-0 md:pt-6">
        {activeTab === "marketplace" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <section>
              <h2 className="text-xl font-bold mb-4">Shop by Category</h2>
              {isCategoriesLoading ? (
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="min-w-[120px] h-32 rounded-2xl" />)}
                </div>
              ) : (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                  {categories?.map(category => (
                    <Card 
                      key={category.id}
                      className="min-w-[140px] snap-start relative overflow-hidden rounded-2xl border-white/5 cursor-pointer group"
                      onClick={() => setLocation(`/products?category=${category.slug}`)}
                      data-testid={`category-card-${category.id}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                      {category.imageUrl && (
                        <img src={category.imageUrl} alt={category.name} className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                      )}
                      <div className="absolute bottom-3 left-3 right-3 z-20">
                        <p className="text-white font-medium text-sm line-clamp-2">{category.name}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Featured Products</h2>
                <Button variant="link" className="text-primary p-0" onClick={() => setLocation('/products')}>View All</Button>
              </div>
              {isProductsLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {products?.slice(0, 8).map(product => (
                    <Card 
                      key={product.id}
                      onClick={() => setLocation(`/products/${product.id}`)}
                      className="bg-card/50 backdrop-blur border-white/5 overflow-hidden cursor-pointer hover:border-primary/30 transition-colors"
                      data-testid={`product-card-${product.id}`}
                    >
                      <div className="aspect-square bg-white/5 relative">
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <h4 className="text-sm font-medium line-clamp-1 mb-1">{product.name}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === "express" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">DNET Express</h3>
                <p className="text-sm text-muted-foreground">Order from premium vendors near you for fast delivery.</p>
              </div>
            </div>

            <div className="grid gap-4">
              {isVendorsLoading ? (
                [1, 2, 3].map(i => <Skeleton key={i} className="w-full h-24 rounded-2xl" />)
              ) : (
                vendors?.map(vendor => (
                  <Card 
                    key={vendor.id}
                    onClick={() => setLocation(`/vendors/${vendor.id}`)}
                    className="p-4 bg-card/50 border-white/5 cursor-pointer hover:bg-white/5 transition-colors flex items-center gap-4"
                    data-testid={`vendor-card-${vendor.id}`}
                  >
                    <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                      {vendor.logoUrl ? (
                         <img src={vendor.logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold">{vendor.name.charAt(0)}</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-base">{vendor.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{vendor.categories?.[0] ?? ""}</p>
                      <div className="inline-flex items-center gap-1 bg-white/10 px-2 py-1 rounded text-[10px] font-medium">
                        <MapPin className="w-3 h-3 text-primary" />
                        20-35 min
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "digital" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold mb-4">Everyday Services</h2>
            <div className="grid grid-cols-2 gap-4">
              {digitalServices.map(service => (
                <Card 
                  key={service.id}
                  className="p-6 flex flex-col items-center justify-center gap-4 text-center cursor-pointer hover:bg-white/5 transition-colors border-white/5 bg-card/50"
                  onClick={() => {}}
                >
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center", service.color)}>
                    <service.icon className="w-8 h-8" />
                  </div>
                  <span className="font-medium">{service.name}</span>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
