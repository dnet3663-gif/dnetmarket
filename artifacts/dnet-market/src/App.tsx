import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/home";
import Explore from "@/pages/explore";
import ProductsList from "@/pages/products/index";
import ProductDetail from "@/pages/products/[id]";
import Cart from "@/pages/cart";
import Checkout from "@/pages/checkout";
import OrderConfirmation from "@/pages/order-confirmation/[id]";
import Orders from "@/pages/orders/index";
import OrderDetail from "@/pages/orders/[id]";
import Support from "@/pages/support";
import Account from "@/pages/account";
import Login from "@/pages/login";
import Vendors from "@/pages/vendors/index";
import VendorDetail from "@/pages/vendors/[id]";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/explore" component={Explore} />
        <Route path="/products" component={ProductsList} />
        <Route path="/products/:id" component={ProductDetail} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/order-confirmation/:id" component={OrderConfirmation} />
        <Route path="/orders" component={Orders} />
        <Route path="/orders/:id" component={OrderDetail} />
        <Route path="/support" component={Support} />
        <Route path="/account" component={Account} />
        <Route path="/login" component={Login} />
        <Route path="/vendors" component={Vendors} />
        <Route path="/vendors/:id" component={VendorDetail} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" position="top-center" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
