import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Train, MapPin, Calendar, Users, ArrowLeftRight, Clock, Wifi, Coffee, Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const STATIONS = [
  { code: "NDLS", name: "New Delhi", city: "Delhi" },
  { code: "BCT", name: "Mumbai Central", city: "Mumbai" },
  { code: "MAS", name: "Chennai Central", city: "Chennai" },
  { code: "HWH", name: "Howrah Junction", city: "Kolkata" },
  { code: "SBC", name: "Bangalore City", city: "Bangalore" },
  { code: "SC", name: "Secunderabad", city: "Hyderabad" },
  { code: "ADI", name: "Ahmedabad Junction", city: "Ahmedabad" },
  { code: "JP", name: "Jaipur Junction", city: "Jaipur" },
  { code: "PUNE", name: "Pune Junction", city: "Pune" },
  { code: "LKO", name: "Lucknow Charbagh", city: "Lucknow" },
];

const CLASSES = [
  { code: "SL", name: "Sleeper (SL)" },
  { code: "3A", name: "AC 3 Tier (3A)" },
  { code: "2A", name: "AC 2 Tier (2A)" },
  { code: "1A", name: "First Class AC (1A)" },
  { code: "CC", name: "AC Chair Car (CC)" },
  { code: "2S", name: "Second Sitting (2S)" },
];

const generateTrains = (from: string, to: string) => [
  {
    id: "T001",
    trainNumber: "12951",
    trainName: "Mumbai Rajdhani Express",
    from,
    to,
    departure: "16:25",
    arrival: "08:15",
    duration: "15h 50m",
    runsOn: ["Mon", "Wed", "Fri", "Sun"],
    classes: [
      { code: "1A", available: 3, price: 4615 },
      { code: "2A", available: 12, price: 2670 },
      { code: "3A", available: 28, price: 1885 },
    ],
    pantry: true,
    wifi: false,
    rating: 4.4,
    superfast: true,
  },
  {
    id: "T002",
    trainNumber: "12953",
    trainName: "August Kranti Rajdhani Express",
    from,
    to,
    departure: "17:40",
    arrival: "10:55",
    duration: "17h 15m",
    runsOn: ["Daily"],
    classes: [
      { code: "1A", available: 0, price: 4755 },
      { code: "2A", available: 8, price: 2785 },
      { code: "3A", available: 42, price: 1960 },
    ],
    pantry: true,
    wifi: false,
    rating: 4.3,
    superfast: true,
  },
  {
    id: "T003",
    trainNumber: "12259",
    trainName: "Sealdah Duronto Express",
    from,
    to,
    departure: "20:10",
    arrival: "14:25",
    duration: "18h 15m",
    runsOn: ["Tue", "Thu", "Sat"],
    classes: [
      { code: "2A", available: 15, price: 2540 },
      { code: "3A", available: 54, price: 1810 },
      { code: "SL", available: 120, price: 610 },
    ],
    pantry: true,
    wifi: false,
    rating: 4.1,
    superfast: true,
  },
  {
    id: "T004",
    trainNumber: "11057",
    trainName: "Amritsar Express",
    from,
    to,
    departure: "23:55",
    arrival: "20:30",
    duration: "20h 35m",
    runsOn: ["Daily"],
    classes: [
      { code: "2A", available: 5, price: 1965 },
      { code: "3A", available: 23, price: 1425 },
      { code: "SL", available: 87, price: 495 },
      { code: "2S", available: 145, price: 225 },
    ],
    pantry: false,
    wifi: false,
    rating: 3.8,
    superfast: false,
  },
  {
    id: "T005",
    trainNumber: "22453",
    trainName: "Vande Bharat Express",
    from,
    to,
    departure: "06:00",
    arrival: "14:30",
    duration: "8h 30m",
    runsOn: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    classes: [
      { code: "CC", available: 62, price: 1855 },
      { code: "EC", available: 18, price: 3355 },
    ],
    pantry: true,
    wifi: true,
    rating: 4.8,
    superfast: true,
  },
];

export default function TrainsPage() {
  const { toast } = useToast();
  const [fromStation, setFromStation] = useState("NDLS");
  const [toStation, setToStation] = useState("BCT");
  const [journeyDate, setJourneyDate] = useState("2026-04-15");
  const [travelClass, setTravelClass] = useState("3A");
  const [passengers, setPassengers] = useState("1");
  const [searched, setSearched] = useState(false);
  const [expandedTrain, setExpandedTrain] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("departure");

  const fromData = STATIONS.find(s => s.code === fromStation)!;
  const toData = STATIONS.find(s => s.code === toStation)!;

  const handleSwap = () => {
    setFromStation(toStation);
    setToStation(fromStation);
  };

  const handleSearch = () => {
    if (fromStation === toStation) {
      toast({ title: "Same station selected", description: "From and To stations cannot be the same.", variant: "destructive" });
      return;
    }
    setSearched(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const trains = generateTrains(fromData.city, toData.city).sort((a, b) => {
    if (sortBy === "departure") return a.departure.localeCompare(b.departure);
    if (sortBy === "duration") return parseInt(a.duration) - parseInt(b.duration);
    if (sortBy === "price") {
      const aP = Math.min(...a.classes.map(c => c.price));
      const bP = Math.min(...b.classes.map(c => c.price));
      return aP - bP;
    }
    return 0;
  });

  const handleBook = (trainName: string, classCode: string) => {
    toast({
      title: "Booking Initiated",
      description: `Proceeding to book ${classCode} class on ${trainName}. Redirecting to IRCTC...`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Train className="w-7 h-7 text-accent" />
            <h1 className="text-2xl md:text-3xl font-bold">Book Train Tickets</h1>
          </div>
          <p className="text-primary-foreground/80 text-sm">Access the entire Indian Railways network. Fast, easy, secure.</p>
        </div>
      </div>

      {/* Search Form */}
      <div className="bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">From Station</label>
              <div className="border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <select
                  value={fromStation}
                  onChange={e => setFromStation(e.target.value)}
                  className="w-full text-sm font-bold text-primary focus:outline-none bg-transparent cursor-pointer appearance-none"
                >
                  {STATIONS.map(s => <option key={s.code} value={s.code}>{s.city} ({s.code})</option>)}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleSwap}
                className="w-10 h-10 rounded-full border-2 border-primary/20 bg-primary/5 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all"
                title="Swap stations"
              >
                <ArrowLeftRight className="w-4 h-4 text-primary" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">To Station</label>
              <div className="border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <select
                  value={toStation}
                  onChange={e => setToStation(e.target.value)}
                  className="w-full text-sm font-bold text-primary focus:outline-none bg-transparent cursor-pointer appearance-none"
                >
                  {STATIONS.map(s => <option key={s.code} value={s.code}>{s.city} ({s.code})</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Journey Date</label>
              <div className="flex items-center gap-2 border border-border rounded-xl px-3 py-2.5 focus-within:border-primary/60 transition-all">
                <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                <input
                  type="date"
                  value={journeyDate}
                  onChange={e => setJourneyDate(e.target.value)}
                  className="flex-1 text-sm font-bold text-primary focus:outline-none bg-transparent"
                />
              </div>
            </div>

            <Button
              onClick={handleSearch}
              className="bg-accent hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-accent/20 gap-2"
            >
              <Search className="w-4 h-4" /> Search Trains
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Class:</label>
              <select
                value={travelClass}
                onChange={e => setTravelClass(e.target.value)}
                className="text-xs font-semibold border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary bg-transparent"
              >
                {CLASSES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-muted-foreground">Passengers:</label>
              <select
                value={passengers}
                onChange={e => setPassengers(e.target.value)}
                className="text-xs font-semibold border border-border rounded-lg px-2 py-1.5 focus:outline-none focus:border-primary bg-transparent"
              >
                {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 mb-12">
        {!searched ? (
          <div className="text-center py-20">
            <Train className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-muted-foreground mb-2">Search for trains to get started</h3>
            <p className="text-muted-foreground text-sm">Select your origin, destination and journey date above.</p>
          </div>
        ) : (
          <div>
            {/* Sort Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h2 className="font-bold text-lg">{fromData.city} → {toData.city}</h2>
                <p className="text-sm text-muted-foreground">{journeyDate} · {passengers} Passenger{Number(passengers) > 1 ? "s" : ""} · {CLASSES.find(c => c.code === travelClass)?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">Sort by:</span>
                {["departure", "duration", "price"].map(s => (
                  <button
                    key={s}
                    onClick={() => setSortBy(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-semibold capitalize transition-all ${sortBy === s ? "bg-primary text-white" : "bg-white border border-border hover:border-primary/50 text-muted-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {trains.map((train, idx) => (
                <motion.div
                  key={train.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden"
                >
                  <div className="p-4 md:p-5">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      {/* Train Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded">{train.trainNumber}</span>
                          <h3 className="font-bold text-sm">{train.trainName}</h3>
                          {train.superfast && <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-1.5 py-0.5 rounded font-semibold">Superfast</span>}
                          {train.wifi && <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-1"><Wifi className="w-3 h-3" />WiFi</span>}
                          {train.pantry && <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded flex items-center gap-1"><Coffee className="w-3 h-3" />Pantry</span>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span>Runs on:</span>
                          <span className="font-semibold text-foreground">{train.runsOn.join(", ")}</span>
                        </div>
                      </div>

                      {/* Timing */}
                      <div className="flex items-center gap-4 md:gap-8">
                        <div className="text-center">
                          <p className="text-xl font-bold">{train.departure}</p>
                          <p className="text-xs text-muted-foreground">{fromData.code}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{train.duration}</p>
                          <div className="w-16 md:w-24 h-px bg-border relative">
                            <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary" />
                            <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-accent" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold">{train.arrival}</p>
                          <p className="text-xs text-muted-foreground">{toData.code}</p>
                        </div>
                      </div>

                      {/* Quick class buttons */}
                      <div className="flex flex-wrap gap-2">
                        {train.classes.map(cls => (
                          <button
                            key={cls.code}
                            disabled={cls.available === 0}
                            onClick={() => handleBook(train.trainName, cls.code)}
                            className={`flex flex-col items-center px-3 py-2 rounded-xl border-2 text-xs transition-all ${cls.available === 0 ? "border-border bg-secondary/30 text-muted-foreground cursor-not-allowed" : "border-primary/20 hover:border-primary hover:bg-primary/5 cursor-pointer"}`}
                          >
                            <span className="font-bold text-sm text-primary">{cls.code}</span>
                            <span className="font-bold">₹{cls.price.toLocaleString()}</span>
                            <span className={cls.available === 0 ? "text-destructive" : "text-green-600"}>
                              {cls.available === 0 ? "WL" : `${cls.available} avail`}
                            </span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setExpandedTrain(expandedTrain === train.id ? null : train.id)}
                        className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap"
                      >
                        Details {expandedTrain === train.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedTrain === train.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border bg-secondary/30 px-4 md:px-5 py-4"
                      >
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Train Type</p>
                            <p className="font-semibold">{train.superfast ? "Superfast Express" : "Express"}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Duration</p>
                            <p className="font-semibold">{train.duration}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Passenger Rating</p>
                            <p className="font-semibold">{train.rating} ⭐</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Onboard Services</p>
                            <p className="font-semibold">{[train.pantry && "Pantry", train.wifi && "WiFi"].filter(Boolean).join(", ") || "None"}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
