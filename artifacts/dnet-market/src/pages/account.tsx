import { Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { MapPin, Settings, LogOut, ChevronRight, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Account() {
  const { data: orders, isLoading } = useListOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-primary/20 text-primary";
      case "preparing": return "bg-blue-500/20 text-blue-400";
      case "out_for_delivery": return "bg-amber-500/20 text-amber-400";
      case "delivered": return "bg-green-500/20 text-green-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-white/10 text-white";
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:py-8 min-h-[100dvh] pb-24 md:pb-8">
      <div className="flex flex-col items-center mb-8 pt-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/80 to-primary/20 flex items-center justify-center mb-4 border-2 border-primary/50 shadow-[0_0_20px_rgba(212,175,55,0.2)]">
          <span className="text-4xl font-bold">G</span>
        </div>
        <h1 className="text-2xl font-bold mb-1">Guest User</h1>
        <div className="inline-flex items-center rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Gold Member
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-8">
        <Card className="p-4 flex flex-col items-center justify-center bg-card/50 border-white/5">
          <span className="text-2xl font-bold text-primary">{orders?.length ?? 0}</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Orders</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-card/50 border-white/5">
          <span className="text-2xl font-bold text-primary">0</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Saved</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center bg-card/50 border-white/5">
          <span className="text-2xl font-bold text-primary">1,250</span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Points</span>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-card/50">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          {isLoading ? (
            Array(3).fill(0).map((_, i) => <Skeleton key={i} className="w-full h-24 rounded-xl" />)
          ) : orders && orders.length > 0 ? (
            <>
              {orders.slice(0, 3).map((order) => (
                <Card key={order.id} className="p-4 bg-card/50 border-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                      {order.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div className="font-bold">₦{(Number(order.total) || 0).toLocaleString()}</div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">
                        View Details <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
              <Button asChild variant="outline" className="w-full border-white/10 mt-4">
                <Link href="/orders">View all orders</Link>
              </Button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <PackageOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Start shopping to see your orders here.</p>
              <Button asChild className="bg-primary text-primary-foreground">
                <Link href="/explore">Explore Products</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="addresses" className="space-y-4">
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-white/10 rounded-2xl">
            <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-6">No saved addresses yet</h3>
            <Button variant="ghost" className="border border-dashed border-white/20 text-muted-foreground hover:text-white">
              Add New Address
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="bg-card/50 border-white/5 overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-xs text-muted-foreground">Receive updates on your orders</div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator className="bg-white/5" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Email Updates</div>
                <div className="text-xs text-muted-foreground">Marketing and promotional emails</div>
              </div>
              <Switch />
            </div>
            <Separator className="bg-white/5" />
            <div className="p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">Order SMS Alerts</div>
                <div className="text-xs text-muted-foreground">Text messages for delivery</div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>
          
          <div className="mt-8 space-y-4">
            <Button variant="ghost" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 justify-start" asChild>
              <Link href="/login">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </Link>
            </Button>
            <div className="text-center">
              <Button variant="link" className="text-xs text-muted-foreground h-auto p-0">
                Delete Account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}