import { useState } from "react";
import { Link } from "wouter";
import { Search, MapPin, Star, Store } from "lucide-react";
import { useListVendors } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Vendors() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: vendors, isLoading } = useListVendors();

  const filteredVendors = vendors?.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const featuredVendors = filteredVendors.filter(v => v.isFeatured);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-8 min-h-[100dvh] pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Vendors</h1>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search vendors..." 
            className="pl-9 bg-card/50 border-white/10 rounded-full h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="w-full h-48 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
          </div>
        </div>
      ) : (
        <>
          {featuredVendors.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-primary fill-primary" /> Featured Vendors
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory hide-scrollbar">
                {featuredVendors.map(vendor => (
                  <Link key={vendor.id} href={`/vendors/${vendor.id}`}>
                    <Card className="min-w-[280px] md:min-w-[320px] snap-start bg-card/50 border-white/5 overflow-hidden group cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="h-32 bg-white/5 relative">
                        {vendor.coverUrl && (
                          <img src={vendor.coverUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-black border border-white/10 overflow-hidden flex items-center justify-center">
                            {vendor.logoUrl ? (
                              <img src={vendor.logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                            ) : (
                              <Store className="w-5 h-5 text-primary" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-bold text-white leading-tight">{vendor.name}</h3>
                            {vendor.location && (
                              <div className="flex items-center text-[10px] text-zinc-300">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="line-clamp-1">{vendor.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {vendor.rating && (
                          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-xs border border-white/10">
                            <Star className="w-3 h-3 text-primary fill-primary" />
                            <span className="font-bold">{vendor.rating}</span>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-lg font-bold mb-4">All Vendors</h2>
            {filteredVendors.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No vendors found</h3>
                <p className="text-muted-foreground">Try adjusting your search criteria</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredVendors.map(vendor => (
                  <Card key={vendor.id} className="bg-card/50 border-white/5 overflow-hidden flex flex-col">
                    <div className="aspect-[16/9] bg-white/5 relative">
                      {vendor.coverUrl && (
                        <img src={vendor.coverUrl} alt="" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-black border-2 border-card overflow-hidden flex items-center justify-center">
                          {vendor.logoUrl ? (
                            <img src={vendor.logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
                          ) : (
                            <Store className="w-6 h-6 text-primary" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white leading-tight">{vendor.name}</h3>
                          <div className="flex items-center text-xs text-zinc-300 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="line-clamp-1">{vendor.location || "Online Store"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                      <div className="flex items-center justify-between text-sm">
                        {vendor.rating ? (
                          <div className="flex items-center gap-1 font-medium">
                            <Star className="w-4 h-4 text-primary fill-primary" />
                            <span>{vendor.rating}</span>
                            <span className="text-muted-foreground">({vendor.reviewCount || 0})</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground italic">New</span>
                        )}
                        <div className="bg-white/5 px-2 py-1 rounded text-xs text-muted-foreground">
                          {vendor.productCount || 0} Products
                        </div>
                      </div>
                      
                      <Button asChild className="w-full bg-white/5 hover:bg-white/10 text-foreground border border-white/10">
                        <Link href={`/vendors/${vendor.id}`}>Visit Store</Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}