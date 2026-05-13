import { Link } from "wouter";
import { toast } from "sonner";
import { SiGoogle } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Authentication coming soon — stay tuned!");
  };

  const handleGoogleSignIn = () => {
    toast.success("Google Sign-In is coming soon!");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden bg-background">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-primary/5 rounded-full blur-[60px]" />
      </div>

      {/* Back button */}
      <div className="relative z-10 p-4">
        <Link href="/">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_28px_rgba(212,175,55,0.45)] mb-4">
            <span className="text-primary-foreground font-bold text-2xl tracking-tighter">D</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DNET</h1>
          <p className="text-muted-foreground text-sm mt-1">Africa's Premium Marketplace</p>
        </div>

        {/* Card */}
        <div className="w-full max-w-sm">
          <div className="bg-card/70 backdrop-blur-2xl rounded-3xl border border-white/10 p-7 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <h2 className="text-xl font-bold mb-1">Welcome back</h2>
            <p className="text-muted-foreground text-sm mb-7">
              Sign in to access orders, wishlist, and exclusive deals.
            </p>

            {/* Google Button */}
            <Button
              variant="outline"
              className="w-full h-12 border-white/12 mb-5 bg-white/5 hover:bg-white/8 hover:border-white/20 flex items-center gap-3 rounded-xl font-medium transition-all active:scale-[0.98]"
              onClick={handleGoogleSignIn}
            >
              <SiGoogle className="w-4 h-4 text-[#4285F4]" />
              Continue with Google
            </Button>

            {/* Divider */}
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card/70 px-3 text-xs text-muted-foreground">or continue with email</span>
              </div>
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Email address"
                className="h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                required
              />
              <Input
                type="password"
                placeholder="Password"
                className="h-12 bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary focus-visible:border-primary"
                required
              />

              <div className="text-right pb-1">
                <button type="button" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all active:scale-[0.98]"
              >
                Sign In
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-white/8 text-center space-y-3">
              <p className="text-sm text-muted-foreground">
                New to DNET?{" "}
                <button onClick={handleGoogleSignIn} className="text-primary font-semibold hover:underline">
                  Create account
                </button>
              </p>

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3 h-3 text-green-500" />
                Secured with 256-bit encryption
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <p className="text-center text-xs text-muted-foreground mt-5">
            By continuing, you agree to DNET's{" "}
            <button className="underline hover:text-foreground">Terms</button>{" "}
            and{" "}
            <button className="underline hover:text-foreground">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
}
