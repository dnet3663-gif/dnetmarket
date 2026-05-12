import { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, useCreateOrder } from "@workspace/api-client-react";
import { ArrowLeft, CheckCircle2, CreditCard, Banknote, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
        toast.error("Please fill in all address fields");
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
          setLocation(`/order-confirmation/${order.id || 1}`); // fallback ID if not returned
        },
        onError: () => {
          toast.error("Failed to place order. Please try again.");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4 md:py-8 space-y-6">
        <Skeleton className="w-full h-12 rounded-xl" />
        <Skeleton className="w-full h-64 rounded-3xl" />
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

  return (
    <div className="w-full max-w-2xl mx-auto p-4 md:py-8 min-h-screen flex flex-col">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => step > 1 ? setStep(step - 1 as any) : window.history.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold flex-1 text-center pr-10">Checkout</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/10 -z-10" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-500" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }} />
        
        {[
          { num: 1, label: "Address" },
          { num: 2, label: "Payment" },
          { num: 3, label: "Review" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-background px-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
              step >= s.num ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(212,175,55,0.4)]" : "bg-white/10 text-muted-foreground"
            )}>
              {step > s.num ? <CheckCircle2 className="w-5 h-5" /> : s.num}
            </div>
            <span className={cn("text-xs font-medium", step >= s.num ? "text-foreground" : "text-muted-foreground")}>{s.label}</span>
          </div>
        ))}
      </div>

      <div className="flex-1">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <Card className="p-6 bg-card/50 border-white/5 space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" /> Delivery Details
              </h2>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="bg-white/5 border-white/10" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="bg-white/5 border-white/10" placeholder="+234 800 000 0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="bg-white/5 border-white/10" placeholder="123 Main St" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} className="bg-white/5 border-white/10" placeholder="Lagos" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input id="state" name="state" value={formData.state} onChange={handleInputChange} className="bg-white/5 border-white/10" placeholder="Lagos" />
                  </div>
                </div>
              </div>
            </Card>
            <Button onClick={handleNextStep} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90">
              Continue to Payment
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <Card className="p-6 bg-card/50 border-white/5">
              <h2 className="text-lg font-bold mb-6">Select Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div className={cn("flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors", paymentMethod === 'pay_on_delivery' ? "border-primary bg-primary/5" : "border-white/10 bg-white/5 hover:border-white/20")} onClick={() => setPaymentMethod('pay_on_delivery')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><MapPin className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-bold">Pay on Delivery</div>
                      <div className="text-xs text-muted-foreground">Pay when you receive your order</div>
                    </div>
                  </div>
                  <RadioGroupItem value="pay_on_delivery" id="pay_on_delivery" />
                </div>
                <div className={cn("flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors", paymentMethod === 'bank_transfer' ? "border-primary bg-primary/5" : "border-white/10 bg-white/5 hover:border-white/20")} onClick={() => setPaymentMethod('bank_transfer')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><Banknote className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-bold">Bank Transfer</div>
                      <div className="text-xs text-muted-foreground">Direct transfer to DNET account</div>
                    </div>
                  </div>
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                </div>
                <div className={cn("flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors", paymentMethod === 'card' ? "border-primary bg-primary/5" : "border-white/10 bg-white/5 hover:border-white/20")} onClick={() => setPaymentMethod('card')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><CreditCard className="w-5 h-5 text-primary" /></div>
                    <div>
                      <div className="font-bold">Card Payment</div>
                      <div className="text-xs text-muted-foreground">Pay securely with your card</div>
                    </div>
                  </div>
                  <RadioGroupItem value="card" id="card" />
                </div>
              </RadioGroup>
            </Card>
            <Button onClick={handleNextStep} className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90">
              Review Order
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 pb-10">
            <Card className="p-6 bg-card/50 border-white/5">
              <h2 className="text-lg font-bold mb-4 border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                {cart.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{item.quantity}x</span>
                      <span className="font-medium line-clamp-1 max-w-[200px]">{item.product?.name || "Product"}</span>
                    </div>
                    <span className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>₦{deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 text-primary">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-white/5 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-1">Deliver to</h3>
                <p className="font-medium">{formData.name}</p>
                <p className="text-sm text-muted-foreground">{formData.address}, {formData.city}, {formData.state}</p>
                <p className="text-sm text-muted-foreground">{formData.phone}</p>
              </div>
              <div className="h-px bg-white/10 w-full" />
              <div>
                <h3 className="text-sm font-bold text-muted-foreground mb-1">Payment Method</h3>
                <p className="font-medium capitalize">{paymentMethod.replace(/_/g, ' ')}</p>
              </div>
            </Card>

            <Button 
              onClick={handlePlaceOrder} 
              disabled={createOrder.isPending}
              className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)]"
            >
              {createOrder.isPending ? "Processing..." : `Pay ₦${total.toLocaleString()}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
