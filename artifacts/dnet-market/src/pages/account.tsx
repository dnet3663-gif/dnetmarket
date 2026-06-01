import { Link } from "wouter";
import { useListOrders } from "@workspace/api-client-react";
import { MapPin, Settings, LogOut, ChevronRight, PackageOpen, Bell, Shield, Heart, Star, Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const getStatusInfo = (status: string) => {
  const s = (status || "").toLowerCase();
  switch (s) {
    case 'pending': case 'confirmed': return { color: 'bg-primary/15 text-primary border-primary/25', icon: Clock, label: 'Confirmed' };
    case 'processing': return { color: 'bg-blue-500/15 text-blue-400 border-blue-500/25', icon: Package, label: 'Preparing' };
    case 'shipped': return { color: 'bg-amber-500/15 text-amber-400 border-amber-500/25', icon: Truck, label: 'On the Way' };
    case 'delivered': return { color: 'bg-green-500/15 text-green-400 border-green-500/25', icon: CheckCircle2, label: 'Delivered' };
    case 'cancelled': return { color: 'bg-red-500/15 text-red-400 border-red-500/25', icon: XCircle, label: 'Cancelled' };
    default: return { color: 'bg-white/8 text-muted-foreground border-white/12', icon: Package, label: status || 'Unknown' };
  }
};

export default function Account() {
  const { data: orders, isLoading } = useListOrders();

  const totalSpend = orders?.reduce((acc, o) => acc + (Number(o.total) || 0), 0) ?? 0;

  return (
    <div className="w-full max-w-3xl mx-auto pb-24 md:pb-10 min-h-screen">

      {/* Profile Hero */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/8 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col items-center px-4 pt-8 pb-6 text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <div className="w-22 h-22 rounded-full bg-gradient-to-br from-primary/80 via-primary/40 to-primary/10 flex items-center justify-center border-2 border-primary/40 shadow-[0_0_24px_rgba(212,175,55,0.25)] w-[88px] h-[88px]">
              <span className="text-4xl font-bold text-primary-foreground">G</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.6)]">
              <Star className="w-3 h-3 text-primary-foreground fill-primary-foreground" />
            </div>
          </div>

          <h1 className="text-xl font-bold mb-1">Guest User</h1>

          <div className="flex items-center gap-2 mb-5">
            <div className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary tracking-wide">
              ✦ Gold Member
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
            {[
              { value: orders?.length ?? 0, label: "Orders" },
              { value: 0, label: "Saved" },
              { value: "1.2K", label: "Points" },
            ].map(stat => (
              <Card key={stat.label} className="p-3 flex flex-col items-center bg-white/4 border-white/8">
                <span className="text-xl font-bold text-primary leading-none mb-1">{stat.value}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
              </Card>
            ))}
          </div>

          {/* Total spend if any */}
          {totalSpend > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Total spent: <span className="text-primary font-semibold">₦{totalSpend.toLocaleString()}</span>
            </p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Package, label: "Orders", href: "/orders" },
            { icon: Heart, label: "Wishlist", href: "#" },
            { icon: MapPin, label: "Address", href: "#" },
            { icon: Settings, label: "Settings", href: "#" },
          ].map(item => (
            <Link key={item.label} href={item.href}>
              <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/4 border border-white/8 hover:border-primary/25 hover:bg-primary/5 transition-all cursor-pointer group">
                <div className="w-9 h-9 rounded-xl bg-white/6 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4">
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-white/4 border border-white/8 rounded-2xl p-1 h-auto">
            {["orders", "addresses", "settings"].map(tab => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-xl py-2 text-xs font-semibold capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:text-foreground"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-3">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => <Skeleton key={i} className="w-full h-24 rounded-2xl" />)
            ) : orders && orders.length > 0 ? (
              <>
                {orders.slice(0, 5).map((order) => {
                  const statusInfo = getStatusInfo(order.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <Link key={order.id} href={`/orders/${order.id}`}>
                      <Card className="p-4 bg-card/60 border-white/8 hover:border-white/16 hover:bg-white/4 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="font-bold text-sm">Order #{order.id}</span>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                          </div>
                          <div className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                            statusInfo.color
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-primary">₦{(Number(order.total) || 0).toLocaleString()}</span>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-primary hover:bg-primary/10 rounded-full px-3">
                            Details <ChevronRight className="w-3 h-3 ml-0.5" />
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
                <Button asChild variant="outline" className="w-full border-white/10 rounded-2xl h-12 hover:border-primary/30">
                  <Link href="/orders">View all orders</Link>
                </Button>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-white/10 rounded-3xl">
                <PackageOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
                <h3 className="text-base font-semibold mb-1">No orders yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">When you place your first order, it'll show up here.</p>
                <Button asChild className="bg-primary text-primary-foreground rounded-full px-6">
                  <Link href="/explore">Start Shopping</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <div className="flex flex-col items-center justify-center py-14 text-center border border-dashed border-white/10 rounded-3xl">
              <MapPin className="w-12 h-12 text-muted-foreground mb-4 opacity-40" />
              <h3 className="text-base font-semibold mb-1">No saved addresses</h3>
              <p className="text-sm text-muted-foreground mb-6">Save addresses for faster checkout</p>
              <Button variant="outline" className="border-white/15 rounded-full px-6 hover:border-primary/40">
                + Add New Address
              </Button>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="bg-card/60 border-white/8 overflow-hidden rounded-2xl divide-y divide-white/6">
              {[
                { label: "Push Notifications", desc: "Order updates and offers", defaultChecked: true },
                { label: "Email Updates", desc: "Marketing and promotions", defaultChecked: false },
                { label: "SMS Alerts", desc: "Delivery text messages", defaultChecked: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </Card>

            <Card className="bg-card/60 border-white/8 overflow-hidden rounded-2xl divide-y divide-white/6">
              {[
                { icon: Shield, label: "Privacy & Security", href: "#" },
                { icon: Bell, label: "Notification Preferences", href: "#" },
              ].map(item => (
                <Link key={item.label} href={item.href}>
                  <div className="flex items-center gap-3 p-4 hover:bg-white/4 transition-colors cursor-pointer">
                    <item.icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium flex-1">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </Card>

            <div className="space-y-2 pt-2">
              <Button
                variant="ghost"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 justify-start rounded-2xl h-12 border border-destructive/15"
                asChild
              >
                <Link href="/login">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Link>
              </Button>
              <Button variant="link" className="w-full text-xs text-muted-foreground h-auto py-2">
                Delete Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
