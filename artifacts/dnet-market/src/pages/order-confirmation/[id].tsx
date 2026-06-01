import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetOrder, useGetTrendingProducts } from "@workspace/api-client-react";
import { Check, Package, Clock, Truck, Home, ArrowRight, MapPin, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const id = parseInt(params.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id, queryKey: ['/api/orders', id] as any } });
  const { data: trendingProducts } = useGetTrendingProducts();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowContent(true), 400);
    return () => clearTimeout(t);
  }, []);

  const trackingStages = [
    { id: "pending", label: "Order Confirmed", sublabel: "We've received your order", icon: Check, emoji: "✅" },
    { id: "preparing", label: "Vendor Preparing", sublabel: "Your items are being packed", icon: Package, emoji: "📦" },
    { id: "rider_assigned", label: "Rider Assigned", sublabel: "A rider is on the way to pick up", icon: Clock, emoji: "🛵" },
    { id: "out_for_delivery", label: "Out For Delivery", sublabel: "Your order is on its way", icon: Truck, emoji: "🚚" },
    { id: "delivered", label: "Delivered", sublabel: "Enjoy your order!", icon: Home, emoji: "🏠" },
  ];

  const statusToIndex: Record<string, number> = {
    'pending': 0, 'confirmed': 0, 'processing': 1, 'shipped': 3, 'delivered': 4, 'cancelled': -1
  };
  const currentStageIndex = order ? (statusToIndex[order.status?.toLowerCase()] ?? 0) : 0;

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto p-6 space-y-8 flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-full h-64 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-12">
      <div className="w-full max-w-xl mx-auto px-4 py-8 space-y-6">

        {/* Success Animation */}
        <div className={cn(
          "flex flex-col items-center text-center pt-6 transition-all duration-700",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          {/* Animated check circle */}
          <div className="relative mb-6">
            <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" style={{ animationDuration: '2s' }} />
            <div className="absolute inset-[-12px] rounded-full bg-primary/8 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.5)]">
              <Check className="w-10 h-10 text-primary-foreground stroke-[3]" />
            </div>
          </div>

          <h1 className="text-2xl font-bold mb-1">Order Placed!</h1>
          <p className="text-muted-foreground text-sm max-w-xs">
            Your order has been confirmed. We'll keep you updated every step of the way.
          </p>
          {order && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs font-mono bg-white/8 border border-white/10 px-3 py-1.5 rounded-full text-muted-foreground">
                Order #{order.id}
              </span>
              <button className="w-7 h-7 rounded-full bg-white/8 flex items-center justify-center hover:bg-white/12 transition-colors">
                <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>
          )}
        </div>

        {/* Estimated Delivery */}
        <div className={cn(
          "transition-all duration-700 delay-100",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <Card className="p-4 bg-primary/8 border-primary/25 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Truck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Estimated Delivery</p>
              <p className="font-bold text-sm">Today, 2–4 hours</p>
            </div>
            <div className="ml-auto">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Via</p>
                <p className="text-xs font-bold text-primary">DNET Express</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tracking Timeline */}
        <div className={cn(
          "transition-all duration-700 delay-200",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <Card className="overflow-hidden bg-card/60 border-white/8">
            <div className="p-4 border-b border-white/8">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm">Order Status</h3>
                <MapPin className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="p-4">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-white/8" />
                <div
                  className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-1000"
                  style={{ height: `${(currentStageIndex / (trackingStages.length - 1)) * 100}%` }}
                />

                <div className="space-y-6">
                  {trackingStages.map((stage, index) => {
                    const isActive = index <= currentStageIndex;
                    const isCurrent = index === currentStageIndex;

                    return (
                      <div key={stage.id} className="flex gap-4 items-start relative z-10">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 text-sm",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-[0_0_14px_rgba(212,175,55,0.35)]"
                            : "bg-white/6 text-muted-foreground border border-white/10"
                        )}>
                          {isActive ? <stage.icon className="w-4 h-4" /> : <span className="opacity-40">{stage.emoji}</span>}
                        </div>
                        <div className="flex-1 pt-2">
                          <div className="flex items-center gap-2">
                            <h4 className={cn("text-sm font-semibold", isActive ? "text-foreground" : "text-muted-foreground")}>
                              {stage.label}
                            </h4>
                            {isCurrent && (
                              <span className="text-[9px] font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide animate-pulse">
                                Now
                              </span>
                            )}
                          </div>
                          <p className={cn("text-xs mt-0.5", isActive ? "text-muted-foreground" : "text-muted-foreground/50")}>
                            {stage.sublabel}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* CTAs */}
        <div className={cn(
          "flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-300",
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        )}>
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl border-primary/40 text-primary hover:bg-primary/10 hover:border-primary/60 transition-all font-semibold"
            onClick={() => setLocation(`/orders/${id}`)}
          >
            Track Order
          </Button>
          <Button
            className="flex-1 h-12 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-[0_0_18px_rgba(212,175,55,0.3)] transition-all active:scale-[0.98]"
            onClick={() => setLocation('/explore')}
          >
            Continue Shopping <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>

        {/* You might also like */}
        {trendingProducts && trendingProducts.length > 0 && (
          <div className={cn(
            "transition-all duration-700 delay-400",
            showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          )}>
            <h3 className="font-bold text-base mb-4">You might also like</h3>
            <div className="grid grid-cols-3 gap-3">
              {trendingProducts.slice(0, 3).map(product => (
                <Card
                  key={product.id}
                  onClick={() => setLocation(`/products/${product.id}`)}
                  className="bg-card/60 border-white/8 overflow-hidden cursor-pointer hover:border-primary/25 transition-all group"
                >
                  <div className="aspect-square bg-white/5 overflow-hidden">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-2">
                    <h4 className="text-[11px] font-medium line-clamp-1 mb-1">{product.name}</h4>
                    <span className="text-xs font-bold text-primary">₦{product.price.toLocaleString()}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
