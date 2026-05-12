import { Link } from "wouter";
import { toast } from "sonner";
import { SiGoogle } from "react-icons/si";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Login() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Authentication coming soon.");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.4)] mb-4">
            <span className="text-primary-foreground font-bold text-xl">D</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DNET</h1>
        </div>

        <div className="bg-card/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to access your orders, saved items, and personalized recommendations.
          </p>

          <Button 
            variant="outline" 
            className="w-full h-12 border-white/10 mb-6 bg-white/5 hover:bg-white/10 flex items-center gap-3"
            onClick={() => toast.success("Google Sign-In is coming soon. Stay tuned!")}
          >
            <SiGoogle className="w-5 h-5" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="h-12 bg-black/40 border-white/10 focus-visible:ring-primary"
                required
              />
            </div>
            <div className="space-y-2">
              <Input 
                type="password" 
                placeholder="Your password" 
                className="h-12 bg-black/40 border-white/10 focus-visible:ring-primary"
                required
              />
            </div>
            
            <div className="text-right">
              <Link href="/login" className="text-xs text-muted-foreground hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-[0_0_20px_rgba(212,175,55,0.2)] mt-2">
              Sign in
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-muted-foreground">
              New to DNET?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}