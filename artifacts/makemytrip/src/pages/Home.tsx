import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SearchWidget } from "@/components/SearchWidget";
import { useGetOffers, useGetPopularDestinations } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { BadgePercent, ShieldCheck, Clock, CreditCard, ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: offers, isLoading: offersLoading } = useGetOffers();
  const { data: destinations, isLoading: destLoading } = useGetPopularDestinations();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full h-[500px] lg:h-[600px] flex flex-col items-center justify-start pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/40 to-background"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-extrabold text-white tracking-tight"
          >
            Discover Your Next <span className="text-accent">Adventure</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 font-medium"
          >
            Book flights, hotels, and holidays at the best prices with JourneyJoy.
          </motion.p>
        </div>
      </section>

      {/* Search Widget */}
      <section className="px-4">
        <SearchWidget />
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 md:px-6 py-24 space-y-24">
        
        {/* Promotional Offers */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-display font-bold text-primary">Exclusive Offers</h2>
            <button className="text-accent font-semibold flex items-center gap-1 hover:underline">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {offersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers?.map((offer, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={offer.id} 
                  className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg shadow-black/5 hover:shadow-xl transition-all group flex"
                >
                  <div className="w-2/5 h-full relative">
                    {/* fallback to unsplash if imageUrl is broken or not provided by mock */}
                    <img 
                      src={offer.imageUrl || "https://images.unsplash.com/photo-1527302220941-4c5b2dce7ace?w=500&h=500&fit=crop"} 
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary">
                      {offer.category}
                    </div>
                  </div>
                  <div className="w-3/5 p-4 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-1 text-foreground line-clamp-2">{offer.title}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{offer.description}</p>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded border border-green-200 uppercase tracking-wide">
                          {offer.code}
                        </span>
                      </div>
                      <p className="text-xs text-accent font-bold">Valid till {offer.validTill}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Popular Destinations */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold text-primary">Trending Destinations</h2>
              <p className="text-muted-foreground mt-1">Explore the most visited places across the globe.</p>
            </div>
            <button className="text-accent font-semibold flex items-center gap-1 hover:underline">
              Explore More <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {destLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {destinations?.map((dest, idx) => (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  key={dest.id}
                  className="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg"
                >
                  <img 
                    src={dest.imageUrl || "https://images.unsplash.com/photo-1506461883276-594c8cb25bc3?w=800&h=1000&fit=crop"} 
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-5 text-white">
                    <h3 className="text-xl font-display font-bold mb-1">{dest.name}</h3>
                    <p className="text-sm text-white/80 mb-2">{dest.country}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded font-medium">
                        Starts ₹{dest.startingPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>
          
          <div className="relative z-10 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Why Book With JourneyJoy?</h2>
            <p className="text-white/80 max-w-2xl mx-auto">We provide the best-in-class service to ensure your travel is seamless, safe, and memorable.</p>
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: BadgePercent, title: "Best Prices", desc: "We guarantee the best prices on flights and hotels." },
              { icon: ShieldCheck, title: "100% Secure", desc: "Your payments and personal data are completely safe." },
              { icon: Clock, title: "24/7 Support", desc: "Our customer service team is always here to help you." },
              { icon: CreditCard, title: "Easy Cancellations", desc: "Flexible cancellation policies for peace of mind." },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent mb-6">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      <Footer />
    </div>
  );
}
