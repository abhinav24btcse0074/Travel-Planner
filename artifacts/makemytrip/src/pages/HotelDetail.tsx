import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGetHotelDetail, useGetHotelRooms } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  Star, MapPin, Wifi, Dumbbell, Coffee, Car, Waves, Sparkles,
  ChevronLeft, ChevronRight, Check, X, Users, BedDouble, Maximize2,
  ThumbsUp, Shield, Clock, ArrowLeft, Phone, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

const amenityIcon = (a: string) => {
  const l = a.toLowerCase();
  if (l.includes("wifi")) return <Wifi className="w-4 h-4" />;
  if (l.includes("pool") || l.includes("swim")) return <Waves className="w-4 h-4" />;
  if (l.includes("gym") || l.includes("fitness")) return <Dumbbell className="w-4 h-4" />;
  if (l.includes("park")) return <Car className="w-4 h-4" />;
  if (l.includes("spa") || l.includes("jacuzzi")) return <Sparkles className="w-4 h-4" />;
  return <Coffee className="w-4 h-4" />;
};

export default function HotelDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const checkIn = searchParams.get("checkIn") || format(new Date(), "yyyy-MM-dd");
  const checkOut = searchParams.get("checkOut") || format(new Date(Date.now() + 2 * 86400000), "yyyy-MM-dd");
  const guests = Number(searchParams.get("guests")) || 2;

  const [activeImg, setActiveImg] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const { data: hotel, isLoading: hotelLoading } = useGetHotelDetail(id!);
  const { data: rooms, isLoading: roomsLoading } = useGetHotelRooms(id!, { checkIn, checkOut, guests });

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));

  if (hotelLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 container mx-auto px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-3xl" />
            <div className="h-8 bg-gray-200 rounded-xl w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1,2,3].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl" />)}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!hotel) return null;

  const amenities = showAllAmenities ? hotel.amenities : hotel.amenities.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-border/50">
          <div className="container mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => window.history.back()} className="flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Results
            </button>
            <span>/</span>
            <span className="text-foreground font-medium truncate">{hotel.name}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="bg-black relative">
          <div className="container mx-auto px-0 md:px-6 py-0 md:py-4">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[480px] overflow-hidden md:rounded-3xl">
              <img
                src={hotel.images[activeImg]}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Gallery Nav */}
              <button
                onClick={() => setActiveImg(i => (i - 1 + hotel.images.length) % hotel.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              ><ChevronLeft className="w-5 h-5" /></button>
              <button
                onClick={() => setActiveImg(i => (i + 1) % hotel.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-white transition-colors shadow-lg"
              ><ChevronRight className="w-5 h-5" /></button>

              {/* Thumbnail strip */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {hotel.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === activeImg ? "bg-white w-6" : "bg-white/50"}`}
                  />
                ))}
              </div>

              {/* Hotel Info Overlay */}
              <div className="absolute bottom-8 left-6 right-6 text-white hidden md:block">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge className="mb-2 bg-accent text-white border-0">{hotel.category}</Badge>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-1">{hotel.name}</h1>
                    <p className="flex items-center gap-1.5 text-white/80 text-sm">
                      <MapPin className="w-4 h-4" /> {hotel.address}
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center flex-shrink-0">
                    <div className="text-3xl font-bold">{hotel.rating}</div>
                    <div className="flex items-center justify-center gap-0.5 my-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(hotel.rating) ? "fill-accent text-accent" : "text-white/30"}`} />
                      ))}
                    </div>
                    <div className="text-xs text-white/70">{hotel.reviewCount.toLocaleString()} reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hotel Info */}
        <div className="md:hidden bg-white px-4 py-5 border-b border-border">
          <Badge className="mb-2 bg-accent text-white border-0 text-xs">{hotel.category}</Badge>
          <h1 className="text-2xl font-bold mb-1">{hotel.name}</h1>
          <p className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="w-3.5 h-3.5" /> {hotel.address}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-primary/10 text-primary rounded-xl px-3 py-2">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span className="font-bold">{hotel.rating}</span>
              <span className="text-sm text-muted-foreground">({hotel.reviewCount.toLocaleString()})</span>
            </div>
            {hotel.discount > 0 && (
              <Badge className="bg-red-100 text-red-600 border-red-200">{hotel.discount}% OFF</Badge>
            )}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-3">About This Property</h2>
                <p className="text-muted-foreground leading-relaxed">{hotel.description}</p>
              </div>

              {/* Amenities */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {amenities.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-foreground bg-secondary/50 rounded-xl px-3 py-2.5">
                      <span className="text-primary">{amenityIcon(a)}</span>
                      <span className="leading-tight">{a}</span>
                    </div>
                  ))}
                </div>
                {hotel.amenities.length > 8 && (
                  <button
                    onClick={() => setShowAllAmenities(v => !v)}
                    className="mt-4 text-primary font-semibold flex items-center gap-1 text-sm hover:underline"
                  >
                    {showAllAmenities ? <><ChevronUp className="w-4 h-4" /> Show less</> : <><ChevronDown className="w-4 h-4" /> Show all {hotel.amenities.length} amenities</>}
                  </button>
                )}
              </div>

              {/* Policies */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border">
                <h2 className="text-xl font-bold mb-4">Hotel Policies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { icon: Clock, label: "Check-in", value: hotel.policies.checkIn },
                    { icon: Clock, label: "Check-out", value: hotel.policies.checkOut },
                    { icon: Shield, label: "Cancellation", value: hotel.policies.cancellation },
                    { icon: X, label: "Pets", value: hotel.policies.pets },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-start gap-3 p-4 bg-secondary/30 rounded-xl">
                      <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
                        <div className="text-sm font-medium">{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-border">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Guest Reviews</h2>
                  <div className="flex items-center gap-2 bg-primary/10 rounded-xl px-3 py-2">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-bold text-primary">{hotel.rating}</span>
                    <span className="text-sm text-muted-foreground">/ 5</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {hotel.reviews.map((review) => (
                    <div key={review.id} className="border border-border rounded-2xl p-4">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm flex-shrink-0">
                            {review.avatar}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{review.author}</div>
                            <div className="text-xs text-muted-foreground">{format(parseISO(review.date), "dd MMM yyyy")}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 rounded-lg px-2 py-1 flex-shrink-0">
                          <Star className="w-3 h-3 fill-green-600" />
                          <span className="text-sm font-bold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="font-semibold text-sm mb-1">"{review.title}"</p>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                      <button className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                        <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({review.helpful})
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sticky Booking Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price Summary */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
                  <div className="flex items-end justify-between mb-1">
                    {hotel.discount > 0 && (
                      <p className="text-sm text-muted-foreground line-through">
                        ₹{Math.round(hotel.pricePerNight * (100 / (100 - hotel.discount))).toLocaleString()}
                      </p>
                    )}
                    {hotel.discount > 0 && (
                      <Badge className="bg-red-100 text-red-600 border-red-200 text-xs">{hotel.discount}% OFF</Badge>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-foreground">₹{hotel.pricePerNight.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm">/ night</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-4">
                    {nights} night{nights > 1 ? "s" : ""} · ₹{(hotel.pricePerNight * nights).toLocaleString()} total
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Check-in</div>
                      <div className="text-sm font-bold">{format(parseISO(checkIn), "dd MMM yyyy")}</div>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-3">
                      <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Check-out</div>
                      <div className="text-sm font-bold">{format(parseISO(checkOut), "dd MMM yyyy")}</div>
                    </div>
                  </div>

                  <div className="bg-secondary/50 rounded-xl p-3 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{guests} Guest{guests > 1 ? "s" : ""}</span>
                  </div>

                  <Button
                    className="w-full h-12 bg-accent hover:bg-orange-600 text-white font-bold text-base rounded-xl shadow-lg shadow-accent/20"
                    onClick={() => setLocation(`/hotels/${id}/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                  >
                    Select Rooms
                  </Button>
                </div>

                {/* Trust badges */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-border">
                  <div className="space-y-3">
                    {[
                      { icon: Shield, text: "Free cancellation available" },
                      { icon: Check, text: "Instant confirmation" },
                      { icon: Phone, text: "24/7 customer support" },
                    ].map(({ icon: Icon, text }) => (
                      <div key={text} className="flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-muted-foreground">{text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Room Types Section */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">Available Room Types</h2>
            {roomsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                {rooms?.map((room, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    key={room.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img src={room.images[0]} alt={room.name} className="w-full h-full object-cover" />
                      {!room.refundable && (
                        <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Non-Refundable</div>
                      )}
                      {room.refundable && (
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">Free Cancellation</div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg mb-1">{room.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{room.description}</p>

                      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><BedDouble className="w-3.5 h-3.5 text-primary" /> {room.bedType}</span>
                        <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5 text-primary" /> {room.size}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-primary" /> Max {room.maxGuests}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {room.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">{a}</span>
                        ))}
                      </div>

                      <div className="mt-auto pt-3 border-t border-border">
                        <div className="text-xs text-green-600 font-medium mb-1">{room.mealIncluded}</div>
                        <div className="flex items-end justify-between">
                          <div>
                            {room.originalPrice > room.pricePerNight && (
                              <p className="text-xs text-muted-foreground line-through">₹{room.originalPrice.toLocaleString()}</p>
                            )}
                            <p className="text-xl font-bold">₹{room.pricePerNight.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/night</span></p>
                            <p className="text-xs text-muted-foreground">{room.available} rooms left</p>
                          </div>
                          <Button
                            className="bg-primary hover:bg-blue-800 text-white rounded-xl text-sm"
                            onClick={() => setLocation(`/hotels/${id}/book?roomId=${room.id}&roomName=${encodeURIComponent(room.name)}&price=${room.pricePerNight}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                          >
                            Select
                          </Button>
                        </div>
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
