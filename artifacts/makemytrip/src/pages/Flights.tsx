import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchFlights, SearchFlightsClass } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { PlaneTakeoff, PlaneLanding, Plane, Filter, Clock, Banknote, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Flights() {
  const [location] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  
  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
  const passengers = Number(searchParams.get("passengers")) || 1;
  const flightClass = (searchParams.get("class") as SearchFlightsClass) || SearchFlightsClass.economy;

  const { data: flights, isLoading, error } = useSearchFlights({
    from, to, date, passengers, class: flightClass
  });

  const [sortBy, setSortBy] = useState("cheapest");

  const handleBook = (flightId: string) => {
    toast({
      title: "Processing Booking",
      description: "Redirecting to secure payment gateway...",
    });
    // In a real app, this would redirect to a checkout flow
  };

  const sortedFlights = flights ? [...flights].sort((a, b) => {
    if (sortBy === "cheapest") return a.price - b.price;
    if (sortBy === "fastest") {
      const durationA = parseInt(a.duration.replace(/\D/g, ''));
      const durationB = parseInt(b.duration.replace(/\D/g, ''));
      return durationA - durationB;
    }
    return 0;
  }) : [];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Header />
      
      {/* Search Summary Header */}
      <div className="bg-primary text-white pt-6 pb-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-2xl md:text-3xl font-display font-bold mb-2">
                <span>{from}</span>
                <Plane className="w-6 h-6 text-accent" />
                <span>{to}</span>
              </div>
              <p className="text-primary-foreground/80 flex items-center gap-2 text-sm">
                <span>{format(parseISO(date), "EEE, dd MMM yyyy")}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{passengers} Traveler{passengers > 1 ? 's' : ''}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span className="capitalize">{flightClass}</span>
              </p>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl">
              Modify Search
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg shadow-black/5 border border-border">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" /> Filters
                </h3>
                <button className="text-xs text-accent font-semibold hover:underline">Reset All</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Stops</h4>
                  <div className="space-y-2">
                    {["Non-Stop", "1 Stop", "2+ Stops"].map((stop, i) => (
                      <label key={i} className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={i === 0} />
                          <span className="text-sm group-hover:text-primary transition-colors">{stop}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">₹{(5000 + i * 1500).toLocaleString()}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-semibold mb-3 text-sm">Airlines</h4>
                  <div className="space-y-2">
                    {["IndiGo", "Air India", "Vistara", "SpiceJet"].map((airline, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked />
                        <span className="text-sm group-hover:text-primary transition-colors">{airline}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-4">
            {/* Sort Bar */}
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-border flex flex-wrap gap-2">
              <button 
                onClick={() => setSortBy("cheapest")}
                className={`flex-1 min-w-[120px] p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${sortBy === "cheapest" ? "bg-primary/5 text-primary border border-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
              >
                <Banknote className="w-5 h-5" />
                <span className="text-sm font-bold">Cheapest</span>
              </button>
              <button 
                onClick={() => setSortBy("fastest")}
                className={`flex-1 min-w-[120px] p-3 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${sortBy === "fastest" ? "bg-primary/5 text-primary border border-primary/20" : "hover:bg-secondary text-muted-foreground"}`}
              >
                <Clock className="w-5 h-5" />
                <span className="text-sm font-bold">Fastest</span>
              </button>
            </div>

            {/* Results List */}
            {isLoading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-40 animate-pulse border border-border"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border">
                <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Failed to load flights</h3>
                <p className="text-muted-foreground">Please try again later or modify your search.</p>
              </div>
            ) : sortedFlights.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border shadow-sm">
                <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">No flights found</h3>
                <p className="text-muted-foreground">We couldn't find any flights matching your criteria.</p>
                <Button className="mt-6 bg-primary" onClick={() => window.history.back()}>Go Back</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFlights.map((flight, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={flight.id} 
                    className="bg-white rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-md border border-border transition-all flex flex-col md:flex-row items-center gap-6"
                  >
                    {/* Airline Info */}
                    <div className="w-full md:w-1/5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-primary shadow-inner border border-border">
                        {flight.airlineCode}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{flight.airline}</h4>
                        <p className="text-xs text-muted-foreground">{flight.flightNumber}</p>
                      </div>
                    </div>

                    {/* Flight Timeline */}
                    <div className="w-full md:w-3/5 flex flex-row items-center justify-between">
                      <div className="text-center md:text-right">
                        <p className="text-xl font-bold text-foreground">{flight.departureTime}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{flight.fromCode}</p>
                      </div>

                      <div className="flex-1 px-4 md:px-8 flex flex-col items-center">
                        <p className="text-xs text-muted-foreground font-medium mb-1">{flight.duration}</p>
                        <div className="w-full relative flex items-center justify-center">
                          <div className="w-full h-px bg-border"></div>
                          <PlaneTakeoff className="absolute left-0 w-4 h-4 text-muted-foreground bg-white" />
                          <div className="absolute px-2 text-[10px] font-bold uppercase tracking-wider text-accent bg-white border border-border rounded-full shadow-sm">
                            {flight.stops === 0 ? "Non-Stop" : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                          </div>
                          <PlaneLanding className="absolute right-0 w-4 h-4 text-primary bg-white" />
                        </div>
                      </div>

                      <div className="text-center md:text-left">
                        <p className="text-xl font-bold text-foreground">{flight.arrivalTime}</p>
                        <p className="text-sm font-semibold text-primary mt-1">{flight.toCode}</p>
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="w-full md:w-1/5 flex flex-row md:flex-col items-center justify-between md:justify-center border-t md:border-t-0 md:border-l border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-center mb-0 md:mb-3">
                        <p className="text-2xl font-bold text-foreground tracking-tight">₹{flight.price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">per adult</p>
                      </div>
                      <Button 
                        onClick={() => handleBook(flight.id)}
                        className="bg-accent hover:bg-orange-600 text-white font-bold rounded-xl px-8 shadow-lg shadow-accent/20"
                      >
                        Book Now
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
