import { useLocation } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { Package, ArrowRight, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Orders() {
  const [, setLocation] = useLocation();
  const { data: orders, isLoading } = useListOrders();

  const getStatusInfo = (status: string | undefined) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case 'pending':
      case 'confirmed':
        return { color: 'bg-primary/20 text-primary border-primary/30', icon: Clock, label: 'Confirmed' };
      case 'processing':
        return { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Package, label: 'Preparing' };
      case 'shipped':
        return { color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: Truck, label: 'Out for Delivery' };
      case 'delivered':
        return { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle2, label: 'Delivered' };
      case 'cancelled':
        return { color: 'bg-destructive/20 text-destructive border-destructive/30', icon: XCircle, label: 'Cancelled' };
      default:
        return { color: 'bg-white/10 text-foreground border-white/20', icon: Package, label: status || 'Unknown' };
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="w-full h-40 rounded-2xl" />)}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-card/30 rounded-3xl border border-white/5">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Package className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md">You haven't placed any orders yet. Discover our premium collection and make your first purchase.</p>
          <Button 
            onClick={() => setLocation('/explore')} 
            className="rounded-full bg-primary text-primary-foreground font-bold px-8"
          >
            Start Shopping
          </Button>
        </div>
      ) : (
        <div className="space-y-4 pb-20">
          {orders.map(order => {
            const status = getStatusInfo(order.status);
            const StatusIcon = status.icon;

            return (
              <Card 
                key={order.id} 
                className="p-5 bg-card/50 border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
                onClick={() => setLocation(`/orders/${order.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg">{`#${order.id}`}</span>
                      <span className="text-xs text-muted-foreground">• {formatDate(order.createdAt)}</span>
                    </div>
                    <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-sm flex items-center gap-1", status.color)}>
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary">₦{(Number(order.total) || 0).toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{order.items?.length || 0} items</div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items?.slice(0, 4).map((item: any, i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-white/10 overflow-hidden">
                        {item.product?.imageUrl ? (
                          <img src={item.product.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/20"><Package className="w-4 h-4 text-primary" /></div>
                        )}
                      </div>
                    ))}
                    {order.items && order.items.length > 4 && (
                      <div className="w-10 h-10 rounded-full border-2 border-background bg-white/10 flex items-center justify-center text-xs font-bold z-10">
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" className="rounded-full text-primary hover:bg-primary/10 hover:text-primary group-hover:translate-x-1 transition-transform">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
