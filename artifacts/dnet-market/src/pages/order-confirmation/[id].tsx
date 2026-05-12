import { useLocation } from "wouter";
import { useGetOrder, useGetTrendingProducts } from "@workspace/api-client-react";
import { Check, Package, Clock, Truck, Home, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrderConfirmation({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const id = parseInt(params.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id, queryKey: ['/api/orders', id] as any } });
  const { data: trendingProducts } = useGetTrendingProducts();

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:py-12 space-y-8 flex flex-col items-center justify-center min-h-screen">
        <Skeleton className="w-24 h-24 rounded-full" />
        <Skeleton className="w-64 h-8" />
        <Skeleton className="w-full h-64 rounded-3xl" />
      </div>
    );
  }

  const trackingStages = [
    { id: "pending", label: "Order Confirmed", icon: Check },
    { id: "preparing", label: "Vendor Preparing", icon: Package },
    { id: "rider_assigned", label: "Rider Assigned", icon: Clock },
    { id: "out_for_delivery", label: "Out For Delivery", icon: Truck },
    { id: "delivered", label: "Delivered", icon: Home }
  ];

  // Map backend status to timeline index
  const statusToIndex: Record<string, number> = {
    'pending': 0,
    'confirmed': 0,
    'processing': 1,
    'shipped': 3,
    'delivered': 4,
    'cancelled': -1
  };

  const currentStageIndex = order ? (statusToIndex[order.status?.toLowerCase()] ?? 0) : 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:py-12 min-h-screen pb-24">
      <div className="flex flex-col items-center text-center mb-10 mt-8">
        <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.6)]">
            <Check className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Your order has been placed successfully.</p>
        {order && <p className="text-sm font-mono bg-white/5 px-3 py-1 rounded-full mt-4">ID: #{order.id}</p>}
      </div>

      <Card className="p-6 bg-card/50 border-white/5 mb-8">
        <h3 className="font-bold mb-6">Delivery Timeline</h3>
        <div className="relative">
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-white/10" />
          
          <div className="space-y-8 relative">
            {trackingStages.map((stage, index) => {
              const isActive = index <= currentStageIndex;
              const isCurrent = index === currentStageIndex;
              
              return (
                <div key={stage.id} className="flex gap-4 items-start">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500",
                    isActive ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "bg-white/5 text-muted-foreground border border-white/10"
                  )}>
                    <stage.icon className="w-5 h-5" />
                  </div>
                  <div className="pt-3">
                    <h4 className={cn("font-bold text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{stage.label}</h4>
                    {isCurrent && <p className="text-xs text-primary mt-1">Current status</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <Button 
          variant="outline" 
          className="flex-1 rounded-full border-primary/50 text-primary hover:bg-primary/10 h-12"
          onClick={() => setLocation(`/orders/${id}`)}
        >
          Track Order
        </Button>
        <Button 
          className="flex-1 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
          onClick={() => setLocation('/explore')}
        >
          Continue Shopping
        </Button>
      </div>

      {trendingProducts && trendingProducts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">You might also like</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {trendingProducts.slice(0, 3).map(product => (
              <Card 
                key={product.id}
                onClick={() => setLocation(`/products/${product.id}`)}
                className="bg-card/50 border-white/5 overflow-hidden cursor-pointer hover:border-primary/30"
              >
                <div className="aspect-square bg-white/5">
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <h4 className="text-xs font-medium line-clamp-1 mb-1">{product.name}</h4>
                  <span className="text-sm font-bold text-primary">₦{product.price.toLocaleString()}</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
