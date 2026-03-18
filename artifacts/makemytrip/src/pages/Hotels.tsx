import { useLocation } from "wouter";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchHotels } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import {
  Building2, MapPin, Star, Filter, Coffee, Wifi, Dumbbell,
  ShieldAlert, ChevronDown, X, SlidersHorizontal, ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Hotels() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);

  const city = searchParams.get("city") || "Goa";
  const checkIn = searchParams.get("checkIn") || format(new Date(), "yyyy-MM-dd");
  const checkOut = searchParams.get("checkOut") || format(new Date(Date.now() + 2 * 86400000), "yyyy-MM-dd");
  const guests = Number(searchParams.get("guests")) || 2;
  const rooms = Number(searchParams.get("rooms")) || 1;

  const { data: hotels, isLoading, error } = useSearchHotels({
    city, checkIn, checkOut, guests, rooms
  });

  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [selectedStars, setSelectedStars] = useState<number[]>([]);

  const getAmenityIcon = (amenity: string) => {
    const a = amenity.toLowerCase();
    if (a.includes("wifi")) return <Wifi className="w-3 h-3" />;
    if (a.includes("pool") || a.includes("gym")) return <Dumbbell className="w-3 h-3" />;
    return <Coffee className="w-3 h-3" />;
  };

  const filtered = hotels
    ?.filter(h => h.pricePerNight <= maxPrice)
    ?.filter(h => selectedStars.length === 0 || selectedStars.some(s => Math.round(h.rating) >= s))
    ?.sort((a, b) => {
      if (sortBy === "price_asc") return a.pricePerNight - b.pricePerNight;
      if (sortBy === "price_desc") return b.pricePerNight - a.pricePerNight;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const FiltersPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-base flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" /> Filters
        </h3>
        <button
          className="text-xs text-accent font-semibold hover:underline"
          onClick={() => { setMaxPrice(50000); setSelectedStars([]); }}
        >Clear All</button>
      </div>

      <div>
        <h4 className="font-semibold mb-3 text-sm">Price per night</h4>
        <input
          type="range"
          className="w-full accent-primary"
          min="0"
          max="50000"
          step="500"
          value={maxPrice}
          onChange={e => setMaxPrice(Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
          <span>₹0</span>
          <span className="font-semibold text-primary">Up to ₹{maxPrice.toLocaleString()}</span>
          <span>₹50,000</span>
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="font-semibold mb-3 text-sm">Star Rating</h4>
        <div className="space-y-2">
          {[5, 4, 3, 2].map(star => (
            <label key={star} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedStars.includes(star)}
                onChange={e => setSelectedStars(prev =>
                  e.target.checked ? [...prev, star] : prev.filter(s => s !== star)
                )}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <span className="flex items-center gap-1 text-sm group-hover:text-primary transition-colors">
                {star} <Star className="w-3 h-3 fill-accent text-accent" /> & above
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="font-semibold mb-3 text-sm">Property Type</h4>
        <div className="space-y-2">
          {["Hotel", "Resort", "Villa", "Serviced Apartment"].map((type, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" defaultChecked={i < 2} className="rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm group-hover:text-primary transition-colors">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t border-border pt-5">
        <h4 className="font-semibold mb-3 text-sm">Amenities</h4>
        <div className="space-y-2">
          {["Swimming Pool", "Free WiFi", "Gym/Fitness", "Spa", "Free Parking", "Restaurant"].map((a, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
              <span className="text-sm group-hover:text-primary transition-colors">{a}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Header Bar */}
      <div className="bg-primary text-white pt-6 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xl md:text-2xl font-bold mb-1">
                <Building2 className="w-6 h-6 text-accent" />
                Hotels in {city}
              </div>
              <p className="text-primary-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                <span>{format(parseISO(checkIn), "dd MMM")} – {format(parseISO(checkOut), "dd MMM yyyy")}</span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
                <span>{guests} Guest{guests > 1 ? "s" : ""}</span>
                <span className="hidden sm:block w-1 h-1 rounded-full bg-white/50" />
                <span>{rooms} Room{rooms > 1 ? "s" : ""}</span>
                {filtered && <span className="text-accent font-semibold">· {filtered.length} properties found</span>}
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white rounded-xl text-sm flex-shrink-0"
              onClick={() => setLocation("/")}
            >
              Modify Search
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 -mt-4 mb-12">

        {/* Mobile Filter/Sort Bar */}
        <div className="flex items-center gap-2 mb-4 lg:hidden">
          <button
            onClick={() => setShowMobileFilters(v => !v)}
            className="flex items-center gap-1.5 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm hover:border-primary transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="flex-1 bg-white border border-border rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="recommended">Recommended</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Mobile Filters Panel */}
        {showMobileFilters && (
          <div className="lg:hidden bg-white rounded-2xl p-5 shadow-sm border border-border mb-4">
            <FiltersPanel />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border sticky top-24">
              <FiltersPanel />
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {/* Sort bar (desktop) */}
            <div className="hidden lg:flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-border mb-4">
              <span className="text-sm text-muted-foreground">
                {filtered ? <><span className="font-bold text-foreground">{filtered.length}</span> properties found</> : "Searching..."}
              </span>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm font-semibold border-none focus:outline-none bg-transparent cursor-pointer"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-border" />
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border">
                <ShieldAlert className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Failed to load hotels</h3>
                <p className="text-muted-foreground text-sm">Please try again later or modify your search.</p>
              </div>
            ) : filtered?.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-border">
                <Building2 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No properties found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your price filter or star rating.</p>
                <button onClick={() => { setMaxPrice(50000); setSelectedStars([]); }} className="text-primary font-semibold text-sm hover:underline">Reset filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered?.map((hotel, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.06 }}
                    key={hotel.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-border transition-all duration-300 group flex flex-col cursor-pointer"
                  >
                    <Link href={`/hotels/${hotel.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`} className="flex flex-col flex-1">
                      <div className="h-44 relative overflow-hidden">
                        <img
                          src={hotel.imageUrl}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-accent text-accent" /> {hotel.rating}
                          <span className="text-muted-foreground font-normal">({hotel.reviewCount.toLocaleString()})</span>
                        </div>
                        {hotel.discount > 0 && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                            {hotel.discount}% OFF
                          </div>
                        )}
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{hotel.category}</div>
                        <h3 className="text-base font-bold leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">{hotel.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mb-3 line-clamp-1">
                          <MapPin className="w-3 h-3 text-primary flex-shrink-0" /> {hotel.address}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {hotel.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="inline-flex items-center gap-1 text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                              {getAmenityIcon(a)} {a}
                            </span>
                          ))}
                          {hotel.amenities.length > 3 && (
                            <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
                              +{hotel.amenities.length - 3}
                            </span>
                          )}
                        </div>

                        <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
                          <div>
                            {hotel.discount > 0 && (
                              <p className="text-xs text-muted-foreground line-through">
                                ₹{Math.round(hotel.pricePerNight * (100 / (100 - hotel.discount))).toLocaleString()}
                              </p>
                            )}
                            <p className="text-xl font-bold">₹{hotel.pricePerNight.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">per room / night</p>
                          </div>
                          <Button className="bg-accent hover:bg-orange-600 text-white rounded-xl shadow-sm text-sm h-9">
                            View Rooms
                          </Button>
                        </div>
                      </div>
                    </Link>
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
