import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGetOffers } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { BadgePercent, Copy, Check, Clock, Tag, Plane, Building2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const categoryIcons: Record<string, React.FC<any>> = {
  flights: Plane,
  hotels: Building2,
  packages: Package,
};

export default function OffersPage() {
  const { data: offers, isLoading } = useGetOffers();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-primary via-blue-700 to-blue-900 text-white py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 text-sm font-semibold mb-4">
            <BadgePercent className="w-4 h-4 text-accent" /> Exclusive Deals
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">Offers & Deals</h1>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto">
            Handpicked deals on flights, hotels, and holiday packages just for you. Save big on your next adventure!
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 lg:py-12">

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { key: "all", label: "All Offers" },
            { key: "flights", label: "Flights", icon: Plane },
            { key: "hotels", label: "Hotels", icon: Building2 },
            { key: "packages", label: "Packages", icon: Package },
          ].map(cat => (
            <button key={cat.key} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-border text-sm font-semibold shadow-sm hover:border-primary hover:text-primary transition-all">
              {cat.icon && <cat.icon className="w-4 h-4" />}
              {cat.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {offers?.map((offer, idx) => {
              const CategoryIcon = categoryIcons[offer.category] || Tag;
              const isCopied = copiedCode === offer.code;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.07 }}
                  key={offer.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-lg transition-all group"
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={offer.imageUrl}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-accent text-white border-0 font-bold text-xs capitalize flex items-center gap-1">
                        <CategoryIcon className="w-3 h-3" /> {offer.category}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <div className="text-white font-bold text-2xl">{offer.discount}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-base leading-tight mb-1.5 line-clamp-1">{offer.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{offer.description}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-2 flex-1 bg-secondary/50 border border-dashed border-border rounded-xl px-3 py-2">
                        <Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-mono font-bold text-sm text-primary tracking-wider">{offer.code}</span>
                      </div>
                      <button
                        onClick={() => copyCode(offer.code)}
                        className={`p-2.5 rounded-xl border transition-all ${isCopied ? "bg-green-500 border-green-500 text-white" : "border-border hover:border-primary hover:bg-primary/5"}`}
                      >
                        {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> Valid till {offer.validTill}
                      </div>
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-blue-800 text-white rounded-xl text-xs h-8 px-3"
                      >
                        Use Offer
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
