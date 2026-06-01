import { useParams } from "wouter";
import { Store, MapPin, Star, Plus } from "lucide-react";
import { toast } from "sonner";
import { useGetVendor, useListProducts, getGetVendorQueryKey, getListProductsQueryKey } from "@workspace/api-client-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function VendorDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const queryClient = useQueryClient();

  const { data: vendor, isLoading: isLoadingVendor } = useGetVendor(id, {
    query: { enabled: !!id, queryKey: getGetVendorQueryKey(id) }
  });

  const { data: products, isLoading: isLoadingProducts } = useListProducts({ vendorId: id }, {
    query: { enabled: !!id, queryKey: getListProductsQueryKey({ vendorId: id }) }
  });

  const addToCart = useMutation({
    mutationFn: async (data: { productId: number; quantity: number }) => {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast.success("Added to cart");
    },
    onError: () => {
      toast.error("Failed to add to cart");
    }
  });

  if (isLoadingVendor) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 animate-pulse pb-24">
        <Skeleton className="w-full h-64 md:h-80" />
        <div className="px-4">
          <Skeleton className="w-32 h-10 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return <div className="p-8 text-center">Vendor not found.</div>;
  }

  return (
    <div className="w-full min-h-[100dvh] pb-24 md:pb-8">
      {/* Header / Cover */}
      <div className="relative h-64 md:h-80 w-full bg-zinc-900 border-b border-white/5">
        {vendor.coverUrl && (
          <img src={vendor.coverUrl} alt="" className="w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-end gap-4">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl bg-card border-4 border-background overflow-hidden flex items-center justify-center flex-shrink-0 shadow-xl">
              {vendor.logoUrl ? (
                <img src={vendor.logoUrl} alt={vendor.name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-10 h-10 text-primary" />
              )}
            </div>
            <div className="mb-1 md:mb-2">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-1 drop-shadow-md">{vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                {vendor.rating && (
                  <div className="flex items-center text-primary bg-primary/10 px-2 py-0.5 rounded backdrop-blur">
                    <Star className="w-3 h-3 fill-primary mr-1" />
                    {vendor.rating} <span className="text-primary/70 ml-1">({vendor.reviewCount || 0})</span>
                  </div>
                )}
                {vendor.location && (
                  <div className="flex items-center text-zinc-300">
                    <MapPin className="w-3 h-3 mr-1" /> {vendor.location}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10 md:mb-2 w-full md:w-auto"
            onClick={() => toast.success("Following vendor")}
          >
            <Plus className="w-4 h-4 mr-2" /> Follow Vendor
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6">
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="mb-6 bg-card/50">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            {isLoadingProducts ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <Card key={product.id} className="bg-card/50 border-white/5 overflow-hidden flex flex-col group">
                    <div className="aspect-[4/5] bg-white/5 relative overflow-hidden">
                      {product.imageUrl ? (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Store className="w-8 h-8 text-muted-foreground/30" />
                        </div>
                      )}
                      {product.rating && (
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded text-[10px] flex items-center font-bold">
                          <Star className="w-3 h-3 text-primary fill-primary mr-1" /> {product.rating}
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-1 justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="font-bold text-primary">₦{(product.price || 0).toLocaleString()}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              ₦{product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full bg-white/10 hover:bg-primary hover:text-primary-foreground text-foreground border-0 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart.mutate({ productId: product.id, quantity: 1 });
                        }}
                        disabled={addToCart.isPending}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No products yet</h3>
                <p className="text-muted-foreground">This vendor hasn't added any products.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <Card className="p-6 bg-card/50 border-white/5">
                  <h3 className="font-bold text-lg mb-4">About {vendor.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {vendor.description || "This premium vendor is part of the DNET Delivery Network, providing high-quality products with ultra-fast delivery."}
                  </p>
                </Card>
                
                <Card className="p-6 bg-card/50 border-white/5">
                  <h3 className="font-bold mb-4">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">All Products</Badge>
                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">Premium</Badge>
                    <Badge variant="secondary" className="bg-white/10 hover:bg-white/20">Featured</Badge>
                  </div>
                </Card>
              </div>
              
              <div>
                <Card className="p-6 bg-card/50 border-white/5 space-y-4">
                  <h3 className="font-bold mb-2">Store Stats</h3>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-bold">{vendor.productCount || products?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-bold flex items-center">
                      <Star className="w-4 h-4 text-primary fill-primary mr-1" />
                      {vendor.rating || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Reviews</span>
                    <span className="font-bold">{vendor.reviewCount || 0}</span>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}