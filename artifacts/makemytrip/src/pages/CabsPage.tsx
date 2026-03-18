import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { Car, MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle2, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const cabTypes = [
  {
    id: "sedan",
    name: "Sedan",
    description: "Comfortable ride for up to 4",
    icon: "🚗",
    pricePerKm: 12,
    basePrice: 149,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=250&fit=crop",
    features: ["AC", "4 Seats", "GPS Tracking", "Bottle Water"],
    examples: "Swift Dzire, Honda Amaze",
  },
  {
    id: "suv",
    name: "SUV / MUV",
    description: "Spacious ride for groups up to 6",
    icon: "🚙",
    pricePerKm: 18,
    basePrice: 249,
    capacity: 6,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop",
    features: ["AC", "6 Seats", "GPS Tracking", "Extra Luggage Space"],
    examples: "Innova, Ertiga, Scorpio",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Luxury experience for up to 4",
    icon: "🏎️",
    pricePerKm: 25,
    basePrice: 399,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=250&fit=crop",
    features: ["AC", "4 Seats", "Professional Driver", "Premium Music System"],
    examples: "Toyota Camry, Mercedes E-Class",
  },
  {
    id: "auto",
    name: "Auto Rickshaw",
    description: "Quick & affordable for short trips",
    icon: "🛺",
    pricePerKm: 6,
    basePrice: 50,
    capacity: 3,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop",
    features: ["3 Seats", "No AC", "GPS Tracking", "Best for short trips"],
    examples: "Bajaj Auto, Piaggio",
  },
];

const popularRoutes = [
  { from: "Mumbai Airport", to: "Bandra", distance: "12 km", time: "25 min", price: 249 },
  { from: "Delhi Airport", to: "Connaught Place", distance: "17 km", time: "35 min", price: 349 },
  { from: "Bangalore Airport", to: "MG Road", distance: "40 km", time: "60 min", price: 649 },
  { from: "Chennai Airport", to: "Marina Beach", distance: "18 km", time: "30 min", price: 299 },
  { from: "Hyderabad Airport", to: "Hitech City", distance: "25 km", time: "45 min", price: 449 },
  { from: "Kolkata Airport", to: "Park Street", distance: "20 km", time: "40 min", price: 349 },
];

export default function CabsPage() {
  const { toast } = useToast();
  const [selectedCab, setSelectedCab] = useState("sedan");
  const [tripType, setTripType] = useState<"one-way" | "round-trip" | "rental">("one-way");
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("10:00");
  const [passengers, setPassengers] = useState("2");
  const [step, setStep] = useState<"search" | "confirm">("search");

  const selected = cabTypes.find(c => c.id === selectedCab)!;

  const handleSearch = () => {
    if (!pickup || !drop || !pickupDate) {
      toast({ title: "Please fill all fields", description: "Enter pickup, drop and date to continue.", variant: "destructive" });
      return;
    }
    setStep("confirm");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBook = () => {
    toast({
      title: "Cab Booked Successfully! 🚗",
      description: `Your ${selected.name} from ${pickup} to ${drop} is confirmed. Driver details will be shared 30 mins before pickup.`,
    });
    setStep("search");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="bg-primary text-white py-10">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Car className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-4xl font-bold">Book a Cab</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg">Reliable, affordable rides across India. Available 24/7.</p>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-6 text-sm text-primary-foreground/80">
            {["Safe & reliable drivers", "No surge pricing", "24/7 support", "Real-time tracking"].map((f, i) => (
              <span key={i} className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-accent" />{f}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 mb-12">

        {step === "search" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Trip Type */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="font-bold text-base mb-4">Trip Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(["one-way", "round-trip", "rental"] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setTripType(t)}
                      className={`p-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${tripType === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                    >
                      {t.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              {/* Route Details */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-border space-y-4">
                <h3 className="font-bold text-base mb-2">Route Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Pickup Location</label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                      <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={pickup}
                        onChange={e => setPickup(e.target.value)}
                        placeholder="Enter pickup address"
                        className="flex-1 text-sm font-medium focus:outline-none"
                        list="pickup-suggestions"
                      />
                    </div>
                    <datalist id="pickup-suggestions">
                      {["Mumbai Airport T2", "Delhi IGI Airport", "Bangalore Kempegowda Airport", "Mumbai Central", "Connaught Place Delhi"].map(s => <option key={s} value={s} />)}
                    </datalist>
                  </div>
                  <div className="relative">
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Drop Location</label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                      <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <input
                        type="text"
                        value={drop}
                        onChange={e => setDrop(e.target.value)}
                        placeholder="Enter drop address"
                        className="flex-1 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Pickup Date</label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition-all">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <input
                        type="date"
                        value={pickupDate}
                        onChange={e => setPickupDate(e.target.value)}
                        className="flex-1 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Pickup Time</label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition-all">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <input
                        type="time"
                        value={pickupTime}
                        onChange={e => setPickupTime(e.target.value)}
                        className="flex-1 text-sm font-medium focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Passengers</label>
                    <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition-all">
                      <Users className="w-4 h-4 text-primary flex-shrink-0" />
                      <select
                        value={passengers}
                        onChange={e => setPassengers(e.target.value)}
                        className="flex-1 text-sm font-medium focus:outline-none bg-transparent cursor-pointer appearance-none"
                      >
                        {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cab Type Selection */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="font-bold text-base mb-4">Choose Cab Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cabTypes.map(cab => (
                    <motion.div
                      key={cab.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedCab(cab.id)}
                      className={`relative border-2 rounded-2xl overflow-hidden cursor-pointer transition-all ${selectedCab === cab.id ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/40"}`}
                    >
                      <img src={cab.image} alt={cab.name} className="w-full h-32 object-cover" />
                      <div className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedCab === cab.id ? "bg-primary border-primary" : "bg-white border-border"}`}>
                        {selectedCab === cab.id && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-bold text-sm">{cab.icon} {cab.name}</h4>
                          <span className="text-primary font-bold text-sm">₹{cab.basePrice}+</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{cab.description}</p>
                        <p className="text-xs text-muted-foreground italic">{cab.examples}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full bg-accent hover:bg-orange-600 text-white font-bold text-base h-12 rounded-xl shadow-lg shadow-accent/20"
              >
                Search Available Cabs <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Popular Routes */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
                <h3 className="font-bold text-base mb-4">Popular Airport Routes</h3>
                <div className="space-y-3">
                  {popularRoutes.map((route, i) => (
                    <button
                      key={i}
                      onClick={() => { setPickup(route.from); setDrop(route.to); }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/60 hover:bg-primary/5 hover:border-primary/30 border border-transparent transition-all group text-left"
                    >
                      <div className="flex-1">
                        <p className="text-xs font-bold text-foreground line-clamp-1">{route.from}</p>
                        <div className="flex items-center gap-1 my-0.5">
                          <div className="h-px flex-1 border-t border-dashed border-border" />
                          <ArrowRight className="w-3 h-3 text-muted-foreground" />
                          <div className="h-px flex-1 border-t border-dashed border-border" />
                        </div>
                        <p className="text-xs font-bold text-foreground line-clamp-1">{route.to}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{route.distance} · {route.time}</p>
                      </div>
                      <div className="ml-3 text-right">
                        <p className="text-sm font-bold text-primary">₹{route.price}</p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="bg-primary rounded-2xl p-5 text-white">
                <h3 className="font-bold text-base mb-4">Why Book with JourneyJoy Cabs?</h3>
                <div className="space-y-3">
                  {[
                    { icon: "🛡️", text: "Verified & trained drivers" },
                    { icon: "📍", text: "Real-time GPS tracking" },
                    { icon: "💳", text: "Multiple payment options" },
                    { icon: "⏱️", text: "On-time guarantee" },
                    { icon: "📞", text: "24/7 customer support" },
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-primary-foreground/90">
                      <span className="text-xl">{f.icon}</span> {f.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Confirmation Step
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-5"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
              <h2 className="text-xl font-bold mb-5">Confirm Your Cab Booking</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                  <img src={selected.image} alt={selected.name} className="w-20 h-16 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold">{selected.icon} {selected.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-accent font-semibold">
                        <Star className="w-3 h-3 fill-accent" /> 4.7
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selected.examples}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {selected.features.map((f, i) => (
                        <span key={i} className="text-xs bg-white border border-border px-2 py-0.5 rounded-md">{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Pickup</p>
                    <p className="font-semibold">{pickup}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Drop</p>
                    <p className="font-semibold">{drop}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                    <p className="font-semibold">{pickupDate} at {pickupTime}</p>
                  </div>
                  <div className="p-3 bg-secondary/30 rounded-xl">
                    <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                    <p className="font-semibold">{passengers} Passenger{Number(passengers) > 1 ? "s" : ""}</p>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Base fare</span>
                    <span>₹{selected.basePrice}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Service charge</span>
                    <span>₹49</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">GST (5%)</span>
                    <span>₹{Math.round((selected.basePrice + 49) * 0.05)}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-base border-t border-border pt-2 mt-2">
                    <span>Total (estimated)</span>
                    <span className="text-primary text-xl">₹{selected.basePrice + 49 + Math.round((selected.basePrice + 49) * 0.05)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">* Final fare may vary based on actual distance</p>
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setStep("search")}>
                  Back
                </Button>
                <Button onClick={handleBook} className="flex-1 bg-accent hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-accent/20">
                  Confirm & Book
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
}
