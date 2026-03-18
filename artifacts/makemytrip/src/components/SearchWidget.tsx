import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Plane, Building2, Calendar as CalendarIcon, Users, MapPin, Search } from "lucide-react";
import { format } from "date-fns";

type TabType = "flights" | "hotels";

export function SearchWidget() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("flights");

  // Flight State
  const [from, setFrom] = useState("DEL");
  const [to, setTo] = useState("BOM");
  const [flightDate, setFlightDate] = useState("2024-12-01");
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState("economy");

  // Hotel State
  const [city, setCity] = useState("Goa");
  const [checkIn, setCheckIn] = useState("2024-12-01");
  const [checkOut, setCheckOut] = useState("2024-12-05");
  const [guests, setGuests] = useState("2");

  const handleSearch = () => {
    if (activeTab === "flights") {
      const params = new URLSearchParams({ from, to, date: flightDate, passengers, class: flightClass });
      setLocation(`/flights?${params.toString()}`);
    } else {
      const params = new URLSearchParams({ city, checkIn, checkOut, guests });
      setLocation(`/hotels?${params.toString()}`);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto -mt-24 z-20">
      <div className="glass-panel rounded-3xl p-2 sm:p-4 md:p-8 flex flex-col gap-6">
        
        {/* Tabs */}
        <div className="flex justify-center -mt-12 md:-mt-16 mb-2">
          <div className="bg-white rounded-full shadow-lg shadow-black/5 p-1.5 flex items-center gap-2 border border-border">
            <button
              onClick={() => setActiveTab("flights")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "flights" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Plane className={`w-5 h-5 ${activeTab === "flights" ? "" : "-rotate-45"}`} />
              Flights
            </button>
            <button
              onClick={() => setActiveTab("hotels")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "hotels" 
                  ? "bg-primary text-white shadow-md" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Hotels
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative min-h-[120px]">
          <AnimatePresence mode="wait">
            {activeTab === "flights" ? (
              <motion.div
                key="flights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
              >
                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3 h-3" /> From
                  </label>
                  <input 
                    type="text" 
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent"
                    placeholder="City or Airport"
                  />
                  <span className="text-xs text-muted-foreground">New Delhi, India</span>
                </div>
                
                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3 h-3" /> To
                  </label>
                  <input 
                    type="text" 
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent"
                    placeholder="City or Airport"
                  />
                  <span className="text-xs text-muted-foreground">Mumbai, India</span>
                </div>

                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <CalendarIcon className="w-3 h-3" /> Departure
                  </label>
                  <input 
                    type="date" 
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="w-full text-base font-bold text-primary focus:outline-none bg-transparent"
                  />
                </div>

                <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                  <div className="border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                    <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                      <Users className="w-3 h-3" /> Passengers
                    </label>
                    <select 
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent appearance-none cursor-pointer"
                    >
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Traveler{n>1?'s':''}</option>)}
                    </select>
                  </div>
                  <div className="border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                    <label className="text-xs font-bold text-muted-foreground uppercase mb-1 block">Class</label>
                    <select 
                      value={flightClass}
                      onChange={(e) => setFlightClass(e.target.value)}
                      className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent appearance-none cursor-pointer capitalize"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hotels"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
              >
                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3 h-3" /> Destination
                  </label>
                  <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent"
                    placeholder="City, Area or Property"
                  />
                  <span className="text-xs text-muted-foreground">Goa, India</span>
                </div>
                
                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <CalendarIcon className="w-3 h-3" /> Check-in
                  </label>
                  <input 
                    type="date" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full text-base font-bold text-primary focus:outline-none bg-transparent"
                  />
                </div>

                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <CalendarIcon className="w-3 h-3" /> Check-out
                  </label>
                  <input 
                    type="date" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full text-base font-bold text-primary focus:outline-none bg-transparent"
                  />
                </div>

                <div className="lg:col-span-1 border border-border rounded-2xl p-3 hover:border-primary/50 transition-colors bg-white">
                  <label className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5 mb-1">
                    <Users className="w-3 h-3" /> Guests
                  </label>
                  <select 
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full text-lg font-bold text-primary focus:outline-none bg-transparent appearance-none cursor-pointer"
                  >
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n>1?'s':''}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Button */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <button 
            onClick={handleSearch}
            className="group flex items-center gap-2 px-12 py-4 bg-gradient-to-r from-accent to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white rounded-full font-display font-bold text-xl shadow-xl shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-1 transition-all duration-300"
          >
            <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
