import { useState } from "react";
import { Link } from "wouter";
import { MessageCircle, Headphones, Mail, Phone, MapPin, ChevronRight, Sparkles, Clock, ArrowRight } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "How do I track my order?", a: "Go to your Orders page or tap 'Track My Order' on your order confirmation screen to see real-time delivery updates." },
  { q: "What payment methods do you accept?", a: "We accept Pay on Delivery, Bank Transfer, and Card Payment (Visa, Mastercard, Verve)." },
  { q: "How long does delivery take?", a: "Express delivery is 2–4 hours within Lagos. Standard delivery is 1–3 days for other states." },
  { q: "Can I return a product?", a: "Yes — contact our support team within 7 days of delivery for return assistance. We'll make it right." },
  { q: "How do I become a vendor?", a: "Visit our vendor registration page or email vendors@dnetmarket.com to get started." },
  { q: "Is DNET available in my city?", a: "We currently serve Lagos, Abuja, Port Harcourt, and Kano — with more cities launching soon!" },
  { q: "Is my payment information secure?", a: "Absolutely. All payments are encrypted with bank-level security. We never store your card details." },
];

const quickActions = [
  { label: "Track an Order", icon: MapPin, href: "/orders" },
  { label: "My Complaints", icon: MessageCircle, href: "#" },
  { label: "Returns & Refunds", icon: ArrowRight, href: "#" },
];

export default function Support() {
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 pb-24 md:pb-10 min-h-screen space-y-8">

      {/* Header */}
      <div className="text-center md:text-left space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Support Center</h1>
        <p className="text-muted-foreground text-sm">We're here for you — 24 hours a day, 7 days a week</p>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
        {quickActions.map(action => (
          <Link key={action.label} href={action.href}>
            <div className="flex items-center gap-2 bg-white/5 border border-white/8 hover:border-primary/30 hover:bg-primary/5 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer transition-all">
              <action.icon className="w-4 h-4 text-primary flex-shrink-0" />
              {action.label}
            </div>
          </Link>
        ))}
      </div>

      {/* AI Chat Teaser */}
      <Card className="overflow-hidden bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/25 relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="p-5 flex items-start gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(212,175,55,0.2)]">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold">DNET AI Assistant</h3>
              <span className="text-[9px] font-bold text-primary bg-primary/15 border border-primary/30 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Live</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Ask me anything — orders, products, delivery, returns. I respond instantly.</p>
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="e.g. Where is my order?"
                className="flex-1 h-10 bg-white/8 border-white/12 rounded-xl text-sm focus-visible:ring-primary"
                onKeyDown={e => { if (e.key === "Enter") toast.success("AI chat coming soon — stay tuned!"); }}
              />
              <Button
                size="sm"
                className="h-10 px-4 rounded-xl bg-primary text-primary-foreground font-semibold"
                onClick={() => toast.success("AI chat coming soon — stay tuned!")}
              >
                Ask
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Contact Options Grid */}
      <div>
        <h2 className="text-base font-bold mb-4 text-muted-foreground uppercase tracking-wider text-xs">Contact Us</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <Card
            className="p-4 bg-card/60 border-white/8 cursor-pointer hover:border-primary/30 hover:bg-primary/4 transition-all group"
            onClick={() => toast.success("Connecting to a live agent...")}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-500/15 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/25 transition-colors">
                <Headphones className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">Live Human Agent</h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-xs text-muted-foreground">Available 9am – 9pm</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </Card>

          <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">
            <Card className="p-4 bg-[#25D366]/8 border-[#25D366]/20 hover:border-[#25D366]/50 hover:bg-[#25D366]/12 transition-all group cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0">
                  <SiWhatsapp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-[#25D366]">WhatsApp</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Instant reply</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-[#25D366] transition-colors" />
              </div>
            </Card>
          </a>

          <a href="mailto:support@dnetmarket.com">
            <Card className="p-4 bg-card/60 border-white/8 hover:border-white/18 hover:bg-white/4 transition-all group cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-white/12 transition-colors">
                  <Mail className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Email</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">support@dnetmarket.com</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </a>

          <a href="tel:+2348006383000">
            <Card className="p-4 bg-card/60 border-white/8 hover:border-white/18 hover:bg-white/4 transition-all group cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/8 flex items-center justify-center flex-shrink-0 group-hover:bg-white/12 transition-colors">
                  <Phone className="w-5 h-5 text-muted-foreground group-hover:text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Call Us</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">+234 800 DNET 000</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </Card>
          </a>

        </div>

        {/* Response time banner */}
        <div className="flex items-center gap-2 mt-3 px-1">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Average response time: <strong className="text-foreground">under 5 minutes</strong></p>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-base font-bold mb-1">Frequently Asked Questions</h2>
        <p className="text-sm text-muted-foreground mb-5">Quick answers to common questions</p>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="border border-white/8 rounded-2xl bg-card/40 px-4 overflow-hidden"
            >
              <AccordionTrigger className="text-left font-medium text-sm py-4 hover:no-underline hover:text-primary transition-colors">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm pb-4 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

    </div>
  );
}
