import { useState } from "react";
import { useLocation } from "wouter";
import { useGetCart, useRemoveFromCart } from "@workspace/api-client-react";
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Cart() {
  const [, setLocation] = useLocation();
  const { data: cart, isLoading } = useGetCart();
  const removeFromCart = useRemoveFromCart();

  const handleRemove = (productId: number) => {
    removeFromCart.mutate(
      { productId },
      {
        onSuccess: () => {
          toast.success("Item removed from cart");
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
        {[1, 2].map(i => (
          <Skeleton key={i} className="w-full h-32 rounded-2xl" />
        ))}
        <div className="mt-8 border-t border-white/10 pt-8">
          <Skeleton className="w-full h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our premium products to get started.</p>
        <Button 
          onClick={() => setLocation('/explore')} 
          className="rounded-full bg-primary text-primary-foreground font-bold px-8 h-12"
        >
          Start Shopping
        </Button>
      </div>
    );
  }

  const deliveryFee = 2500;
  const subtotal = cart.total || 0;
  const total = subtotal + deliveryFee;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:py-8 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="space-y-4 mb-8">
        {cart.items.map((item: any) => (
          <Card key={item.id} className="flex gap-4 p-4 bg-card/50 border-white/5 relative">
            <div className="w-24 h-24 rounded-xl bg-white/5 overflow-hidden flex-shrink-0">
              {item.product?.imageUrl ? (
                <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/20"><ShoppingBag className="w-6 h-6 text-primary" /></div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-medium text-base line-clamp-1 pr-8">{item.product?.name || "Product Name"}</h3>
                <p className="text-sm text-muted-foreground mb-1">{item.product?.vendorName || "DNET Premium"}</p>
                <div className="font-bold text-primary">₦{(item.price || 0).toLocaleString()}</div>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-2 h-8">
                  <span className="w-8 text-center text-sm font-medium">Qty: {item.quantity}</span>
                </div>
              </div>
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
              onClick={() => handleRemove(item.id)}
              disabled={removeFromCart.isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </Card>
        ))}
      </div>

      <div className="bg-card/30 border border-white/5 rounded-3xl p-6 mb-24 md:mb-8">
        <h3 className="font-bold text-lg mb-4">Order Summary</h3>
        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">₦{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery Fee</span>
            <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
          </div>
          <div className="h-px w-full bg-white/10 my-2" />
          <div className="flex justify-between text-base">
            <span className="font-bold">Total</span>
            <span className="font-bold text-primary text-xl">₦{total.toLocaleString()}</span>
          </div>
        </div>

        <Button 
          onClick={() => setLocation('/checkout')} 
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2"
        >
          Proceed to Checkout <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
