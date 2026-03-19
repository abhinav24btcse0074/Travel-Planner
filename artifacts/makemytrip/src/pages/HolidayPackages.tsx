import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  Backpack, MapPin, Star, Clock, Users, Plane, CheckCircle, XCircle,
  ChevronDown, ChevronUp, Calendar, Filter, Search, Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ItineraryItem = { day: number; title: string; description: string };

type Package = {
  id: string;
  title: string;
  destination: string;
  country: string;
  imageUrl: string;
  duration: string;
  startingPrice: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewCount: number;
  category: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: ItineraryItem[];
  departureCity: string;
  departureDate: string;
  availableSeats: number;
  tags: string[];
};

const PACKAGES: Package[] = [
  {
    id: "HOL001",
    title: "Magical Goa Beach Escape",
    destination: "Goa",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop",
    duration: "4 Nights / 5 Days",
    startingPrice: 14999,
    originalPrice: 19999,
    discount: 25,
    rating: 4.6,
    reviewCount: 1243,
    category: "Beach",
    highlights: ["North & South Goa Sightseeing", "Dudhsagar Waterfalls Trip", "Sunset Cruise on Mandovi River", "Water Sports Package"],
    inclusions: ["Return flights from Delhi", "4-star hotel stay", "Daily breakfast & dinner", "AC cab transfers", "Travel insurance"],
    exclusions: ["Personal expenses", "Lunch", "Optional activities", "Visa fees"],
    itinerary: [
      { day: 1, title: "Arrival in Goa", description: "Pick up from Goa airport, check-in to hotel. Evening at leisure on Calangute Beach." },
      { day: 2, title: "North Goa Tour", description: "Fort Aguada, Baga Beach, Anjuna Flea Market, Vagator Beach. Evening Sunset Cruise." },
      { day: 3, title: "Dudhsagar Waterfall", description: "Full day trip to the stunning Dudhsagar Falls through Mollem National Park." },
      { day: 4, title: "South Goa Tour", description: "Colva Beach, Palolem Beach, Cabo de Rama Fort. Water sports at Benaulim beach." },
      { day: 5, title: "Departure", description: "Breakfast at hotel, check-out and transfer to Goa airport for return flight." },
    ],
    departureCity: "Delhi",
    departureDate: "2026-05-01",
    availableSeats: 12,
    tags: ["Beach", "Family", "Couples", "Budget Friendly"],
  },
  {
    id: "HOL002",
    title: "Kerala Backwaters & Ayurveda Retreat",
    destination: "Kerala",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&h=600&fit=crop",
    duration: "5 Nights / 6 Days",
    startingPrice: 22999,
    originalPrice: 28999,
    discount: 20,
    rating: 4.8,
    reviewCount: 876,
    category: "Nature & Wellness",
    highlights: ["Alleppey Houseboat Stay", "Munnar Tea Gardens", "Ayurvedic Spa Treatment", "Kathakali Dance Show"],
    inclusions: ["Return flights from Mumbai", "Hotel + houseboat stays", "All meals on houseboat", "AC cab transfers", "Ayurvedic consultation"],
    exclusions: ["Personal expenses", "Optional excursions", "Travel insurance"],
    itinerary: [
      { day: 1, title: "Arrive Kochi", description: "Kochi airport pickup, Fort Kochi sightseeing, Chinese fishing nets, Kathakali show." },
      { day: 2, title: "Kochi to Munnar", description: "Drive through scenic tea gardens, Eravikulam National Park, Mattupetty Dam." },
      { day: 3, title: "Munnar Tea Trails", description: "Tea museum visit, trekking through tea estates, Atukkad Waterfalls." },
      { day: 4, title: "Munnar to Alleppey", description: "Morning Ayurvedic treatment, drive to Alleppey, board the luxury houseboat." },
      { day: 5, title: "Backwater Cruise", description: "Full day houseboat cruise through Alleppey backwaters, village visits." },
      { day: 6, title: "Departure", description: "Transfer to Kochi airport for return flight home." },
    ],
    departureCity: "Mumbai",
    departureDate: "2026-05-10",
    availableSeats: 8,
    tags: ["Nature", "Wellness", "Couples", "Honeymoon"],
  },
  {
    id: "HOL003",
    title: "Royal Rajasthan Heritage Tour",
    destination: "Rajasthan",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop",
    duration: "6 Nights / 7 Days",
    startingPrice: 29999,
    originalPrice: 35999,
    discount: 16,
    rating: 4.7,
    reviewCount: 1087,
    category: "Heritage & Culture",
    highlights: ["Jaipur Pink City Tour", "Udaipur Lake Palace Visit", "Jodhpur Blue City", "Camel Safari in Jaisalmer"],
    inclusions: ["Return flights from Bangalore", "Heritage hotel stays", "Daily breakfast", "AC cab transfers", "Monument entry fees"],
    exclusions: ["Lunch & dinner", "Shopping", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Jaipur", description: "Transfer to heritage hotel. Evening at Chokhi Dhani for cultural program." },
      { day: 2, title: "Jaipur Sightseeing", description: "Amber Fort, City Palace, Jantar Mantar, Hawa Mahal and local bazaars." },
      { day: 3, title: "Jaipur to Jodhpur", description: "Drive to the Blue City. Mehrangarh Fort, Jaswant Thada, blue lanes tour." },
      { day: 4, title: "Jodhpur to Udaipur", description: "En route visit Ranakpur Jain Temples. Check-in to lake-view hotel in Udaipur." },
      { day: 5, title: "Udaipur Lakes", description: "City Palace, Lake Pichola boat ride, Saheliyon Ki Bari, Vintage Car Museum." },
      { day: 6, title: "Udaipur to Jaisalmer", description: "Flight to Jaisalmer. Jaisalmer Fort, Patwon Ki Haveli, Sam Sand Dunes camel safari." },
      { day: 7, title: "Departure", description: "Jaisalmer local market, transfer to Jodhpur airport for flight home." },
    ],
    departureCity: "Bangalore",
    departureDate: "2026-04-20",
    availableSeats: 15,
    tags: ["Heritage", "Culture", "Family", "Adventure"],
  },
  {
    id: "HOL004",
    title: "Bali Bliss - Island Paradise",
    destination: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    duration: "5 Nights / 6 Days",
    startingPrice: 44999,
    originalPrice: 55999,
    discount: 19,
    rating: 4.9,
    reviewCount: 2134,
    category: "International",
    highlights: ["Uluwatu Temple Sunset", "Tegallalang Rice Terraces", "Mount Batur Sunrise Trek", "Ubud Art & Culture Tour"],
    inclusions: ["Return international flights", "5-star villa stay", "Daily breakfast", "Airport transfers", "Cooking class"],
    exclusions: ["Visa on arrival (USD 35)", "Travel insurance", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Bali", description: "Ngurah Rai airport pickup, villa check-in. Seminyak beach sunset." },
      { day: 2, title: "Uluwatu & Kuta", description: "Uluwatu cliff temple, Kecak fire dance, Kuta beach." },
      { day: 3, title: "Ubud Cultural Day", description: "Tegallalang rice terraces, Ubud monkey forest, art galleries, cooking class." },
      { day: 4, title: "Mount Batur Sunrise", description: "4 AM trek to Mount Batur for sunrise. Afternoon hot springs and spa." },
      { day: 5, title: "Nusa Penida Day Trip", description: "Speedboat to Nusa Penida, Kelingking Beach, Angel's Billabong, snorkeling." },
      { day: 6, title: "Departure", description: "Tanah Lot temple visit, shopping at Seminyak boutiques, airport transfer." },
    ],
    departureCity: "Mumbai",
    departureDate: "2026-06-01",
    availableSeats: 6,
    tags: ["International", "Honeymoon", "Beach", "Adventure"],
  },
  {
    id: "HOL005",
    title: "Himalayan Manali Adventure",
    destination: "Manali",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop",
    duration: "4 Nights / 5 Days",
    startingPrice: 12999,
    originalPrice: 15999,
    discount: 18,
    rating: 4.5,
    reviewCount: 943,
    category: "Adventure",
    highlights: ["Rohtang Pass Snow Point", "Solang Valley Skiing", "Hadimba Devi Temple", "River Rafting in Beas"],
    inclusions: ["Volvo AC bus from Delhi", "Hotel stay on twin sharing", "Daily breakfast & dinner", "Local sightseeing by cab"],
    exclusions: ["Rohtang Pass permit", "Adventure sports charges", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Delhi to Manali", description: "Overnight Volvo bus journey from Delhi to Manali." },
      { day: 2, title: "Arrive Manali", description: "Hotel check-in, rest. Evening visit Mall Road, Hadimba temple, Old Manali." },
      { day: 3, title: "Solang Valley", description: "Solang Valley snow point, skiing, zorbing, paragliding. Evening bonfire." },
      { day: 4, title: "Rohtang Pass", description: "Early morning trip to Rohtang Pass (subject to permit). Beas River rafting." },
      { day: 5, title: "Return to Delhi", description: "Manali sightseeing - Vashisht Temple, Van Vihar. Evening bus to Delhi." },
    ],
    departureCity: "Delhi",
    departureDate: "2026-05-15",
    availableSeats: 20,
    tags: ["Adventure", "Snow", "Trekking", "Youth"],
  },
  {
    id: "HOL006",
    title: "Dubai Glam & Desert Safari",
    destination: "Dubai",
    country: "UAE",
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop",
    duration: "4 Nights / 5 Days",
    startingPrice: 54999,
    originalPrice: 65999,
    discount: 16,
    rating: 4.8,
    reviewCount: 1567,
    category: "International",
    highlights: ["Burj Khalifa Observation Deck", "Desert Safari with BBQ Dinner", "Dubai Mall & Fountain Show", "Dhow Cruise Dinner"],
    inclusions: ["Return international flights", "5-star hotel stay", "Daily breakfast", "Airport transfers", "Dubai tourist visa"],
    exclusions: ["Lunch & dinner (except included)", "Shopping", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Dubai", description: "Airport pickup, hotel check-in. Dubai Mall, Fountain Show, Burj Khalifa." },
      { day: 2, title: "City Tour", description: "Old Dubai - Gold Souk, Spice Souk, Abra boat ride. Jumeirah Mosque, Palm." },
      { day: 3, title: "Desert Safari", description: "Full-day desert safari with dune bashing, camel riding, BBQ dinner, Tanoura dance." },
      { day: 4, title: "Theme Parks / Leisure", description: "Dubai Frame, IMG Worlds of Adventure or free day for shopping at Mall of Emirates." },
      { day: 5, title: "Departure", description: "Last minute shopping at Duty Free, transfer to Dubai International Airport." },
    ],
    departureCity: "Delhi",
    departureDate: "2026-04-25",
    availableSeats: 10,
    tags: ["International", "Luxury", "Shopping", "Family"],
  },
  {
    id: "HOL007",
    title: "Andaman Island Retreat",
    destination: "Andaman",
    country: "India",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    duration: "5 Nights / 6 Days",
    startingPrice: 26999,
    originalPrice: 32999,
    discount: 18,
    rating: 4.7,
    reviewCount: 734,
    category: "Beach & Island",
    highlights: ["Radhanagar Beach (Asia's Best)", "Scuba Diving at Neil Island", "Cellular Jail Light & Sound Show", "Sea Walk Experience"],
    inclusions: ["Return flights from Kolkata", "Beachside resort stay", "Daily breakfast & dinner", "Inter-island ferry tickets", "Snorkeling equipment"],
    exclusions: ["Scuba diving charges", "Optional activities", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Port Blair", description: "Airport pickup, Cellular Jail tour and evening light & sound show." },
      { day: 2, title: "Havelock Island", description: "Ferry to Havelock. Radhanagar Beach (Asia's Best Beach), sunset watching." },
      { day: 3, title: "Water Adventures", description: "Snorkeling at Elephant Beach, sea walk, glass-bottom boat ride." },
      { day: 4, title: "Neil Island", description: "Ferry to Neil Island. Natural bridge, Laxmanpur Beach, scuba diving." },
      { day: 5, title: "Return Port Blair", description: "Return ferry. North Bay Island coral garden, Ross Island historical tour." },
      { day: 6, title: "Departure", description: "Breakfast and transfer to Port Blair airport for return flight." },
    ],
    departureCity: "Kolkata",
    departureDate: "2026-05-20",
    availableSeats: 14,
    tags: ["Beach", "Island", "Water Sports", "Nature"],
  },
  {
    id: "HOL008",
    title: "Singapore & Universal Studios",
    destination: "Singapore",
    country: "Singapore",
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop",
    duration: "4 Nights / 5 Days",
    startingPrice: 58999,
    originalPrice: 72999,
    discount: 19,
    rating: 4.8,
    reviewCount: 1892,
    category: "International",
    highlights: ["Universal Studios Singapore", "Gardens by the Bay", "Sentosa Island Full Day", "Night Safari Experience"],
    inclusions: ["Return international flights", "4-star hotel in Orchard Road", "Daily breakfast", "Airport transfers", "Singapore visa"],
    exclusions: ["Lunch & dinner", "Theme park tickets (unless specified)", "Personal expenses"],
    itinerary: [
      { day: 1, title: "Arrive Singapore", description: "Changi Airport pickup, hotel check-in. Orchard Road, Marina Bay Sands." },
      { day: 2, title: "Universal Studios", description: "Full day at Universal Studios Sentosa. Evening S.E.A. Aquarium." },
      { day: 3, title: "City Exploration", description: "Gardens by the Bay, Merlion Park, Chinatown, Little India, Clarke Quay." },
      { day: 4, title: "Night Safari & Sentosa", description: "Afternoon Sentosa beach. Evening Singapore Night Safari." },
      { day: 5, title: "Departure", description: "Jewel Changi waterfall visit, last-minute duty free shopping, departure." },
    ],
    departureCity: "Chennai",
    departureDate: "2026-06-10",
    availableSeats: 9,
    tags: ["International", "Family", "Theme Parks", "Shopping"],
  },
];

const CATEGORIES = ["All", "Beach", "Nature & Wellness", "Heritage & Culture", "International", "Adventure", "Beach & Island"];

function PackageCard({ pkg, onSelect }: { pkg: Package; onSelect: (p: Package) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-border transition-all group cursor-pointer flex flex-col"
      onClick={() => onSelect(pkg)}
    >
      <div className="relative h-48 overflow-hidden">
        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
          <Star className="w-3 h-3 fill-accent text-accent" /> {pkg.rating}
          <span className="text-muted-foreground font-normal">({pkg.reviewCount.toLocaleString()})</span>
        </div>
        {pkg.discount > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {pkg.discount}% OFF
          </div>
        )}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {pkg.tags.slice(0, 2).map(t => (
            <span key={t} className="text-xs bg-black/50 backdrop-blur text-white px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="text-xs font-semibold text-accent uppercase tracking-wide mb-1 flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {pkg.destination}, {pkg.country}
        </div>
        <h3 className="font-bold text-base leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">{pkg.title}</h3>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pkg.duration}</span>
          <span className="flex items-center gap-1"><Plane className="w-3 h-3" /> From {pkg.departureCity}</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-3">
          {pkg.highlights.slice(0, 2).map((h, i) => (
            <span key={i} className="text-xs bg-secondary px-2 py-0.5 rounded-md text-secondary-foreground">{h}</span>
          ))}
        </div>
        <div className="mt-auto pt-3 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-xs text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</p>
            <p className="text-xl font-bold text-primary">₹{pkg.startingPrice.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          <div className="text-right">
            {pkg.availableSeats <= 10 && (
              <p className="text-xs text-red-500 font-semibold mb-1 flex items-center gap-1"><Flame className="w-3 h-3" /> Only {pkg.availableSeats} seats left</p>
            )}
            <Button className="bg-accent hover:bg-orange-600 text-white rounded-xl text-sm h-9">View Details</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PackageDetail({ pkg, onClose }: { pkg: Package; onClose: () => void }) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "inclusions">("overview");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  const handleEnquire = () => {
    toast({
      title: "Enquiry Sent!",
      description: `Our travel expert will call you within 2 hours regarding ${pkg.title}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Hero Image */}
        <div className="relative h-56 md:h-72">
          <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors text-lg font-bold"
          >×</button>
          {pkg.discount > 0 && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-xl text-sm font-bold">{pkg.discount}% OFF</div>
          )}
          <div className="absolute bottom-4 left-5 text-white">
            <p className="text-sm text-white/70 mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {pkg.destination}, {pkg.country}</p>
            <h2 className="text-2xl font-bold leading-tight">{pkg.title}</h2>
            <div className="flex items-center gap-3 mt-1 text-sm text-white/80">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {pkg.duration}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {pkg.rating} ({pkg.reviewCount.toLocaleString()} reviews)</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Quick Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Departure", value: pkg.departureCity, icon: <Plane className="w-4 h-4 text-primary" /> },
              { label: "Departure Date", value: new Date(pkg.departureDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }), icon: <Calendar className="w-4 h-4 text-primary" /> },
              { label: "Duration", value: pkg.duration, icon: <Clock className="w-4 h-4 text-primary" /> },
              { label: "Seats Left", value: `${pkg.availableSeats} available`, icon: <Users className="w-4 h-4 text-primary" /> },
            ].map((info, i) => (
              <div key={i} className="bg-secondary/50 rounded-xl p-3 flex gap-2">
                {info.icon}
                <div>
                  <p className="text-xs text-muted-foreground">{info.label}</p>
                  <p className="text-sm font-semibold">{info.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 border border-border rounded-xl p-1 mb-5">
            {(["overview", "itinerary", "inclusions"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div>
              <h3 className="font-bold mb-3">Trip Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                {pkg.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> {h}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {pkg.tags.map(t => (
                  <span key={t} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-semibold">{t}</span>
                ))}
              </div>
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-2">
              {pkg.itinerary.map(item => (
                <div key={item.day} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setExpandedDay(expandedDay === item.day ? null : item.day)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {item.day}
                      </div>
                      <span className="font-semibold text-sm">{item.title}</span>
                    </div>
                    {expandedDay === item.day ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  <AnimatePresence>
                    {expandedDay === item.day && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}

          {activeTab === "inclusions" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <h3 className="font-bold mb-3 text-green-700">What's Included</h3>
                <div className="space-y-2">
                  {pkg.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {inc}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-red-600">What's Not Included</h3>
                <div className="space-y-2">
                  {pkg.exclusions.map((exc, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> {exc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="mt-6 pt-5 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</p>
                <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{pkg.discount}% OFF</span>
              </div>
              <p className="text-3xl font-bold text-primary">₹{pkg.startingPrice.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">per person (incl. flights)</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleEnquire} className="rounded-xl border-primary text-primary hover:bg-primary/5">
                Enquire Now
              </Button>
              <Button onClick={handleEnquire} className="bg-accent hover:bg-orange-600 text-white font-bold rounded-xl px-6 shadow-lg shadow-accent/20">
                Book This Trip
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function HolidayPackages() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [sortBy, setSortBy] = useState("popular");

  const filtered = PACKAGES
    .filter(p => selectedCategory === "All" || p.category === selectedCategory)
    .filter(p =>
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.startingPrice - b.startingPrice;
      if (sortBy === "price_desc") return b.startingPrice - a.startingPrice;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "duration") return parseInt(a.duration) - parseInt(b.duration);
      return b.reviewCount - a.reviewCount;
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-r from-primary via-blue-700 to-indigo-800 text-white py-14 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl -ml-48 -mb-48" />
        </div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Backpack className="w-8 h-8 text-accent" />
            <h1 className="text-3xl md:text-5xl font-bold">Holiday Packages</h1>
          </div>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Curated trips with flights, hotels, sightseeing and more — all in one package.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search destinations, Bali, Kerala, Goa..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-foreground font-medium focus:outline-none focus:ring-4 focus:ring-white/30 shadow-xl text-base"
            />
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 mb-12">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-sm px-4 py-2 rounded-xl font-semibold transition-all ${selectedCategory === cat ? "bg-primary text-white shadow-md" : "bg-white border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"}`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="text-sm border border-border rounded-xl px-3 py-2 font-semibold focus:outline-none focus:border-primary bg-white cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground mb-4">
          <span className="font-bold text-foreground">{filtered.length}</span> holiday packages found
        </p>

        {/* Package Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Backpack className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No packages found</h3>
            <p className="text-muted-foreground text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(pkg => (
              <PackageCard key={pkg.id} pkg={pkg} onSelect={setSelectedPkg} />
            ))}
          </div>
        )}
      </main>

      {/* Package Detail Modal */}
      <AnimatePresence>
        {selectedPkg && (
          <PackageDetail pkg={selectedPkg} onClose={() => setSelectedPkg(null)} />
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
