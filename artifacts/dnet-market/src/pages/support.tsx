import { Link } from "wouter";
import { MessageCircle, Headphones, Mail, Phone, MapPin } from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Support() {
  const faqs = [
    {
      q: "How do I track my order?",
      a: "Visit your Orders page or tap Track My Order on your confirmation screen.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Pay on Delivery, Bank Transfer, and Card Payment.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery takes 2-4 hours within Lagos and 1-3 days for other states.",
    },
    {
      q: "Can I return a product?",
      a: "Yes, contact our support team within 7 days of delivery for return assistance.",
    },
    {
      q: "How do I become a vendor?",
      a: "Visit our vendor registration page or contact us at vendors@dnetmarket.com.",
    },
    {
      q: "Is DNET available in my city?",
      a: "We currently serve Lagos, Abuja, Port Harcourt, and Kano, with more cities coming soon.",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:py-8 min-h-[100dvh]">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold mb-2">Support Center</h1>
        <p className="text-muted-foreground">We're here for you 24/7</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Card
          className="p-4 bg-card/50 border-white/5 cursor-pointer hover:border-primary/30 transition-colors flex items-center gap-4"
          onClick={() => toast.success("AI chat coming soon")}
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold">DNET AI Assistant</h3>
            <p className="text-sm text-muted-foreground">Instant answers, 24/7</p>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 border-white/5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
            <Headphones className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="font-bold">Live Human Agent</h3>
            <p className="text-sm text-muted-foreground">Real person, real help. Available 9am-9pm</p>
          </div>
        </Card>

        <a href="https://wa.me/2348000000000" target="_blank" rel="noreferrer">
          <Card className="p-4 bg-[#25D366]/10 border-[#25D366]/20 hover:border-[#25D366]/50 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
              <SiWhatsapp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-[#25D366]">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground">Chat instantly on WhatsApp</p>
            </div>
          </Card>
        </a>

        <a href="mailto:support@dnetmarket.com">
          <Card className="p-4 bg-card/50 border-white/5 hover:border-white/20 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Email Support</h3>
              <p className="text-sm text-muted-foreground">support@dnetmarket.com</p>
            </div>
          </Card>
        </a>

        <a href="tel:+2348006383000">
          <Card className="p-4 bg-card/50 border-white/5 hover:border-white/20 transition-colors flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold">Call Support</h3>
              <p className="text-sm text-muted-foreground">+234 800 DNET 000</p>
            </div>
          </Card>
        </a>

        <Link href="/orders">
          <Card className="p-4 bg-card/50 border-white/5 hover:border-primary/30 transition-colors flex items-center gap-4 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold">Track Your Order</h3>
              <p className="text-sm text-muted-foreground">Real-time delivery updates</p>
            </div>
          </Card>
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}