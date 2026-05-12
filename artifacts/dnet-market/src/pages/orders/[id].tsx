import { useLocation } from "wouter";
import { useGetOrder } from "@workspace/api-client-react";
import { ArrowLeft, Check, Package, Clock, Truck, Home, MapPin, CreditCard, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function OrderDetail({ params }: { params: { id: string } }) {
  const [, setLocation] = useLocation();
  const id = parseInt(params.id);
  const { data: order, isLoading } = useGetOrder(id, { query: { enabled: !!id, queryKey: ['/api/orders', id] as any } });

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 md:py-8 space-y-6">
        <Skeleton className="w-1/3 h-8 mb-8" />
        <Skeleton className="w-full h-40 rounded-3xl" />
        <Skeleton className="w-full h-64 rounded-3xl" />
        <Skeleton className="w-full h-40 rounded-3xl" />
      </div>
    );
  }

  if (!order) return <div className="p-8 text-center">Order not found</div>;

  const trackingStages = [
    { id: "pending", label: "Order Confirmed", icon: Check, desc: "We have received your order" },
    { id: "processing", label: "Vendor Preparing", icon: Package, desc: "Vendor is getting items ready" },
    { id: "rider_assigned", label: "Rider Assigned", icon: Clock, desc: "A dispatch rider has been assigned" },
    { id: "shipped", label: "Out For Delivery", icon: Truck, desc: "Your order is on its way" },
    { id: "delivered", label: "Delivered", icon: Home, desc: "Order has been delivered" }
  ];

  const statusToIndex: Record<string, number> = {
    'pending': 0,
    'confirmed': 0,
    'processing': 1,
    'shipped': 3,
    'delivered': 4,
    'cancelled': -1
  };

  const currentStageIndex = statusToIndex[order.status?.toLowerCase() || 'pending'] ?? 0;
  const isCancelled = order.status?.toLowerCase() === 'cancelled';

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:py-8 min-h-screen pb-24">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1">Order Details</h1>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
        <div>
          <div className="text-sm text-muted-foreground mb-1">Order ID</div>
          <div className="font-mono font-bold text-lg">{`#${order.id}`}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground mb-1">Order Date</div>
          <div className="font-bold">{new Date(order.createdAt || '').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>

      {isCancelled ? (
        <Card className="p-6 bg-destructive/10 border-destructive/20 mb-8 text-center">
          <div className="font-bold text-destructive text-lg mb-2">Order Cancelled</div>
          <p className="text-sm text-muted-foreground">This order was cancelled and will not be delivered.</p>
        </Card>
      ) : (
        <Card className="p-6 bg-card/50 border-white/5 mb-8">
          <h3 className="font-bold mb-6 text-lg">Tracking Status</h3>
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
                      isActive ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.3)]" : "bg-zinc-900 text-muted-foreground border border-white/10"
                    )}>
                      <stage.icon className="w-5 h-5" />
                    </div>
                    <div className="pt-1.5 flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className={cn("font-bold text-sm", isActive ? "text-foreground" : "text-muted-foreground")}>{stage.label}</h4>
                        {isCurrent && <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">Active</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-card/50 border-white/5 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><MapPin className="w-5 h-5 text-primary" /> Delivery Info</h3>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {order.deliveryAddress || "Address not provided"}
            </p>
          </div>
        </Card>
        
        <Card className="p-6 bg-card/50 border-white/5 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2"><CreditCard className="w-5 h-5 text-primary" /> Payment Info</h3>
          <div>
            <p className="text-sm font-medium capitalize mb-1">{(order as any).paymentMethod?.replace(/_/g, ' ') || "Pay on Delivery"}</p>
            <p className="text-xs text-muted-foreground">Payment Status: <span className="text-primary font-medium">{(order as any).paymentStatus || "Pending"}</span></p>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-card/50 border-white/5 mb-8">
        <h3 className="font-bold text-lg mb-6">Items ({order.items?.length || 0})</h3>
        <div className="space-y-4">
          {order.items?.map((item: any) => (
            <div key={item.id} className="flex gap-4 items-center">
              <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                {item.product?.imageUrl ? (
                  <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/20"><Package className="w-6 h-6 text-primary" /></div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium line-clamp-1">{item.product?.name || "Product"}</h4>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>₦{(Number(order.total) || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span>₦{Number(order.deliveryFee || 500).toLocaleString()}</span>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold text-primary">
            <span>Total</span>
            <span>₦{(Number(order.total) || 0).toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Button onClick={() => setLocation('/support')} className="w-full h-14 rounded-full bg-white/5 border border-white/10 text-foreground hover:bg-white/10" variant="outline">
        <HelpCircle className="w-5 h-5 mr-2" /> Need help with this order?
      </Button>
    </div>
  );
}
