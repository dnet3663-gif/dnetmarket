import { useState } from "react";
import { useLocation } from "wouter";
import { useGetProduct, useGetProductReviews, useAddToCart } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Star, Heart, Share2, ShoppingBag, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const id = parseInt(params.id);
  const { data: product, isLoading } = useGetProduct(id, { query: { enabled: !!id, queryKey: ['/api/products', id] as any } }); // Using raw key to bypass import issue temporarily
  const { data: reviews } = useGetProductReviews(id, { query: { enabled: !!id, queryKey: ['/api/products', id, 'reviews'] as any } });
  
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart.mutate(
      { data: { productId: product.id, quantity } },
      {
        onSuccess: () => {
          toast.success("Added to cart", {
            description: `${quantity}x ${product.name}`,
            action: {
              label: "View Cart",
              onClick: () => setLocation('/cart')
            }
          });
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 md:p-8 animate-pulse">
        <Skeleton className="w-full h-96 rounded-3xl mb-8" />
        <Skeleton className="w-2/3 h-10 mb-4" />
        <Skeleton className="w-1/3 h-6 mb-8" />
      </div>
    );
  }

  if (!product) return <div className="p-8 text-center">Product not found</div>;

  const allImages = [product.imageUrl, ...(product.images || [])];

  return (
    <div className="w-full max-w-7xl mx-auto md:px-8 pb-24 md:pb-8">
      {/* Mobile Nav */}
      <div className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-white/5 px-4 h-14 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Share2 className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Heart className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mt-4 md:mt-8 px-4 md:px-0">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl bg-zinc-900 border border-white/5 overflow-hidden relative group">
            <img 
              src={allImages[activeImage]} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {product.isTrending && (
              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur px-3 py-1 rounded-full border border-primary/30 text-primary text-xs font-bold">
                TRENDING
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x hide-scrollbar">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "relative w-20 h-20 rounded-xl overflow-hidden snap-start flex-shrink-0 border-2 transition-colors",
                    activeImage === idx ? "border-primary" : "border-transparent opacity-50 hover:opacity-100"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2 text-sm">
              <span className="text-primary font-medium">{product.vendorName || "DNET Premium"}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{product.categoryName}</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full border border-white/10">
                <Star className="w-4 h-4 text-primary fill-primary" />
                <span className="text-sm font-bold">{product.rating?.toFixed(1) || "5.0"}</span>
                <span className="text-xs text-muted-foreground">({product.reviewCount || 0} reviews)</span>
              </div>
              {product.inStock ? (
                <span className="text-sm font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded-full">In Stock</span>
              ) : (
                <span className="text-sm font-medium text-destructive bg-destructive/10 px-2 py-1 rounded-full">Out of Stock</span>
              )}
            </div>

            <div className="flex items-end gap-3">
              <span className="text-3xl md:text-5xl font-bold text-primary">₦{product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through mb-1">₦{product.originalPrice.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="space-y-4 mb-8 text-sm text-zinc-400">
            <p>{product.description || "Premium quality product directly from vetted vendors. Satisfaction guaranteed."}</p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm font-bold text-foreground">DNET Guarantee</div>
                <div className="text-xs text-muted-foreground">100% Authentic</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <div className="text-sm font-bold text-foreground">Express Delivery</div>
                <div className="text-xs text-muted-foreground">Within 24hrs</div>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/10">
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full h-14 px-2">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full w-10 h-10 hover:bg-white/10">-</Button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)} className="rounded-full w-10 h-10 hover:bg-white/10">+</Button>
              </div>
              <Button 
                onClick={handleAddToCart}
                disabled={!product.inStock || addToCart.isPending}
                className="flex-1 h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
              >
                {addToCart.isPending ? "Adding..." : "Add to Cart"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
