import { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, useCreateOrder } from "@workspace/api-client-react";
import { ArrowLeft, CheckCircle2, CreditCard, Banknote, MapPin, Shield, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STEPS = [
  { num: 1, label: "Address", short: "Delivery" },
  { num: 2, label: "Payment", short: "Pay" },
  { num: 3, label: "Review", short: "Confirm" },
];

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading } = useGetCart();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("pay_on_delivery");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state) {
        toast.error("Please fill in all delivery details");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePlaceOrder = () => {
    const deliveryAddress = `${formData.address}, ${formData.city}, ${formData.state}`;
    createOrder.mutate(
      {
        data: {
          deliveryAddress,
          paymentMethod: paymentMethod as any,
          notes: `Contact: ${formData.name} (${formData.phone})`,
          items: cart?.items?.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })) || []
        } as any
      },
      {
        onSuccess: (order) => {
          toast.success("Order placed successfully!");
          setLocation(`/order-confirmation/${order.id || 1}`);
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-xl mx-auto p-4 md:py-10 space-y-6">
        <Skeleton className="w-full h-12 rounded-xl" />
        <Skeleton className="w-full h-72 rounded-3xl" />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    setLocation('/cart');
    return null;
  }

  const deliveryFee = 2500;
  const subtotal = cart.total || 0;
  const total = subtotal + deliveryFee;
  const progressPct = step === 1 ? 0 : step === 2 ? 50 : 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Checkout Header */}
      <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-xl border-b border-white/[0.06] h-14 flex items-center px-4 md:px-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => step > 1 ? setStep((step - 1) as any) : window.history.back()}
          className="rounded-full hover:bg-white/5 mr-3"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_10px_rgba(212,175,55,0.3)]">
              <span className="text-primary-foreground font-bold text-xs">D</span>
            </div>
            <span className="font-bold text-base tracking-tight">Checkout</span>
          </div>
        </div>
        <div className="w-10 flex items-center justify-center">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      </header>

      <div className="w-full max-w-xl mx-auto px-4 py-6">
        {/* Step Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    step > s.num
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                      : step === s.num
                      ? "bg-primary text-primary-foreground shadow-[0_0_12px_rgba(212,175,55,0.4)] ring-4 ring-primary/20"
                      : "bg-white/8 text-muted-foreground border border-white/10"
                  )}>
                    {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold uppercase tracking-wider",
                    step >= s.num ? "text-foreground" : "text-muted-foreground"
                  )}>{s.short}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-3 mt-[-14px] bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-500 rounded-full"
                      style={{ width: step > s.num ? "100%" : "0%" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">
            <div>
              <h2 className="text-xl font-bold mb-1">Delivery Details</h2>
              <p className="text-sm text-muted-foreground">Where should we deliver your order?</p>
            </div>

            <Card className="p-5 bg-card/60 border-white/8 space-y-4">
              <div className="grid gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="+234 800 000 0000" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange}
                    className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                    placeholder="15 Adeola Odeku Street" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange}
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                      placeholder="Lagos" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange}
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                      placeholder="Lagos" />
                  </div>
                </div>
              </div>
            </Card>

            <Button
              onClick={handleNextStep}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all active:scale-[0.98]"
            >
              Continue to Payment <ChevronRight className="w-5 h-5 ml-1" />
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5" />
              Your data is protected and encrypted
            </div>
          </div>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300">
            <div>
              <h2 className="text-xl font-bold mb-1">Payment Method</h2>
              <p className="text-sm text-muted-foreground">Choose how you'd like to pay</p>
            </div>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
              {[
                {
                  value: "pay_on_delivery",
                  icon: MapPin,
                  title: "Pay on Delivery",
                  desc: "Pay cash when your order arrives",
                  badge: "Most Popular"
                },
                {
                  value: "bank_transfer",
                  icon: Banknote,
                  title: "Bank Transfer",
                  desc: "Direct transfer to DNET account"
                },
                {
                  value: "card",
                  icon: CreditCard,
                  title: "Card Payment",
                  desc: "Visa, Mastercard, Verve"
                },
              ].map(opt => (
                <div
                  key={opt.value}
                  onClick={() => setPaymentMethod(opt.value)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all duration-200",
                    paymentMethod === opt.value
                      ? "border-primary bg-primary/8 shadow-[0_0_16px_rgba(212,175,55,0.1)]"
                      : "border-white/8 bg-white/4 hover:border-white/16 hover:bg-white/6"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0",
                    paymentMethod === opt.value ? "bg-primary/20 text-primary" : "bg-white/8 text-muted-foreground"
                  )}>
                    <opt.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{opt.title}</span>
                      {opt.badge && (
                        <span className="text-[9px] font-bold text-primary bg-primary/15 border border-primary/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide">{opt.badge}</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                  </div>
                  <RadioGroupItem value={opt.value} className="border-white/20 data-[state=checked]:border-primary" />
                </div>
              ))}
            </RadioGroup>

            <Button
              onClick={handleNextStep}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all active:scale-[0.98]"
            >
              Review Order <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 3: Review & Place Order */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-3 duration-300 pb-10">
            <div>
              <h2 className="text-xl font-bold mb-1">Review Your Order</h2>
              <p className="text-sm text-muted-foreground">Confirm your details before placing</p>
            </div>

            {/* Order Items */}
            <Card className="overflow-hidden bg-card/60 border-white/8">
              <div className="p-4 border-b border-white/8">
                <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Order Items</h3>
              </div>
              <div className="divide-y divide-white/5">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3 p-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
                      {item.product?.imageUrl && (
                        <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-primary">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/[0.02] space-y-2 border-t border-white/8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-white/8">
                  <span>Total</span>
                  <span className="text-primary">₦{total.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Delivery & Payment Summary */}
            <Card className="overflow-hidden bg-card/60 border-white/8">
              <div className="p-4 flex items-start gap-3 border-b border-white/8">
                <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Delivering to</p>
                  <p className="text-sm font-semibold">{formData.name} · {formData.phone}</p>
                  <p className="text-xs text-muted-foreground">{formData.address}, {formData.city}, {formData.state}</p>
                </div>
                <button onClick={() => setStep(1)} className="ml-auto text-xs text-primary hover:underline flex-shrink-0">Edit</button>
              </div>
              <div className="p-4 flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-primary flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment</p>
                  <p className="text-sm font-semibold capitalize">{paymentMethod.replace(/_/g, ' ')}</p>
                </div>
                <button onClick={() => setStep(2)} className="ml-auto text-xs text-primary hover:underline flex-shrink-0">Edit</button>
              </div>
            </Card>

            <Button
              onClick={handlePlaceOrder}
              disabled={createOrder.isPending}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-[0_0_28px_rgba(212,175,55,0.35)] transition-all active:scale-[0.98]"
            >
              {createOrder.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>Place Order · ₦{total.toLocaleString()}</>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              <span>Protected by DNET Buyer Guarantee</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
