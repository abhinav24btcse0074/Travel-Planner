import { useLocation } from "wouter";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchHotels } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { Building2, MapPin, Star, Filter, Coffee, Wifi, Dumbbell, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Hotels() {
  const [location] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);
  
  const city = searchParams.get("city") || "Goa";
  const checkIn = searchParams.get("checkIn") || format(new Date(), "yyyy-MM-dd");
  const checkOut = searchParams.get("checkOut") || format(new Date(), "yyyy-MM-dd");
  const guests = Number(searchParams.get("guests")) || 2;
  const rooms = Number(searchParams.get("rooms")) || 1;

  const { data: hotels, isLoading, error } = useSearchHotels({
    city, checkIn, checkOut, guests, rooms
  });

  const handleBook = (hotelId: string) => {
    toast({
      title: "Securing Room",
      description: "Redirecting to booking confirmation page...",
    });
  };

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes('wifi')) return <Wifi className="w-3 h-3" />;
    if (a.includes('pool') || a.includes('gym')) return <Dumbbell className="w-3 h-3" />;
    return <Coffee className="w-3 h-3" />;
  };

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Header />
      
      {/* Search Summary Header */}
      <div className="bg-primary text-white pt-6 pb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-48 -mt-48 pointer-events-none"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 text-2xl md:text-3xl font-display font-bold mb-2">
                <Building2 className="w-8 h-8 text-accent" />
                <span>Hotels in {city}</span>
              </div>
              <p className="text-primary-foreground/80 flex items-center gap-2 text-sm">
                <span>{format(parseISO(checkIn), "dd MMM")} - {format(parseISO(checkOut), "dd MMM yyyy")}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{guests} Guest{guests > 1 ? 's' : ''}</span>
                <span className="w-1 h-1 rounded-full bg-white/50" />
                <span>{rooms} Room{rooms > 1 ? 's' : ''}</span>
              </p>
            </div>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl">
              Modify Search
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-6 mb-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-lg shadow-black/5 border border-border sticky top-24">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" /> Filters
                </h3>
                <button className="text-xs text-accent font-semibold hover:underline">Clear</button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm">Price per night</h4>
                  <input type="range" className="w-full accent-primary" min="0" max="50000" defaultValue="15000" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>₹0</span>
                    <span>₹50,000+</span>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-semibold mb-3 text-sm">Star Rating</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map((star) => (
                      <label key={star} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={star >= 4} />
                        <span className="flex items-center text-sm group-hover:text-primary transition-colors">
                          {star} <Star className="w-3 h-3 ml-1 fill-accent text-accent" />
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h4 className="font-semibold mb-3 text-sm">Property Type</h4>
                  <div className="space-y-2">
                    {["Hotel", "Resort", "Villa", "Apartment"].map((type, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer group">
                        <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" defaultChecked={i < 2} />
                        <span className="text-sm group-hover:text-primary transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-border"></div>
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border">
                <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Failed to load hotels</h3>
                <p className="text-muted-foreground">Please try again later or modify your search.</p>
              </div>
            ) : hotels?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border shadow-sm">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-display font-bold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground">We couldn't find any stays matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hotels?.map((hotel, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={hotel.id} 
                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl border border-border transition-all duration-300 group flex flex-col"
                  >
                    <div className="h-48 relative overflow-hidden">
                      {/* fallback image */}
                      <img 
                        src={hotel.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"} 
                        alt={hotel.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                         <Star className="w-3.5 h-3.5 fill-accent text-accent" /> {hotel.rating} <span className="text-muted-foreground font-normal">({hotel.reviewCount})</span>
                      </div>
                      {hotel.discount > 0 && (
                        <div className="absolute top-3 right-3 bg-destructive text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                          {hotel.discount}% OFF
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">
                          {hotel.category}
                        </div>
                        <h3 className="text-xl font-bold text-foreground leading-tight mb-2 line-clamp-1">{hotel.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-start gap-1 mb-4 line-clamp-2">
                          <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          {hotel.address}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.slice(0, 3).map((amenity, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                              {getAmenityIcon(amenity)}
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="inline-flex items-center text-xs font-medium bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                              +{hotel.amenities.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                        <div>
                          {hotel.discount > 0 && (
                            <p className="text-xs text-muted-foreground line-through decoration-destructive mb-0.5">
                              ₹{Math.round(hotel.pricePerNight * (100 / (100 - hotel.discount))).toLocaleString()}
                            </p>
                          )}
                          <p className="text-2xl font-bold text-foreground">₹{hotel.pricePerNight.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">per room / night</p>
                        </div>
                        <Button 
                          onClick={() => handleBook(hotel.id)}
                          className="bg-primary hover:bg-blue-800 text-white rounded-xl shadow-lg shadow-primary/20"
                        >
                          Select Room
                        </Button>
                      </div>
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
