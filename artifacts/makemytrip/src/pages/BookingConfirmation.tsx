import { useParams, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGetBookingDetail } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  CheckCircle2, Building2, Calendar, Users, BedDouble,
  Download, Share2, Phone, Mail, ArrowRight, Printer,
  MapPin, Clock, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

export default function BookingConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();

  const { data: booking, isLoading } = useGetBookingDetail(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto" />
            <div className="h-6 bg-gray-200 rounded w-48 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-64 mx-auto" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!booking) return null;

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 lg:py-12 max-w-3xl">

        {/* Success Banner */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-11 h-11 text-green-500" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Your stay has been booked successfully. A confirmation has been sent to{" "}
            <span className="font-semibold text-foreground">{booking.guestEmail}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Booking Reference */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Booking Reference</div>
                <div className="text-2xl font-bold text-primary tracking-widest">{booking.bookingRef}</div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={`${statusColors[booking.status]} capitalize border font-semibold`}>
                  {booking.status}
                </Badge>
                <button className="p-2.5 rounded-xl border border-border hover:bg-secondary transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl border border-border hover:bg-secondary transition-colors">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hotel & Stay Info */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
            <div className="bg-primary/5 px-5 py-4 border-b border-border flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Stay Details</h2>
            </div>
            <div className="p-5">
              <div className="flex items-start gap-4 mb-5">
                <img
                  src={booking.hotelImage}
                  alt={booking.hotelName}
                  className="w-20 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <h3 className="font-bold text-lg leading-tight">{booking.hotelName}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {booking.city}
                  </p>
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">{booking.roomTypeName}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Calendar, label: "Check-in", value: format(parseISO(booking.checkIn), "dd MMM yyyy"), sub: "2:00 PM" },
                  { icon: Calendar, label: "Check-out", value: format(parseISO(booking.checkOut), "dd MMM yyyy"), sub: "12:00 PM" },
                  { icon: Clock, label: "Duration", value: `${booking.nights} Night${booking.nights > 1 ? "s" : ""}`, sub: "" },
                  { icon: Users, label: "Guests", value: `${booking.guests} Guest${booking.guests > 1 ? "s" : ""}`, sub: `${booking.rooms} Room${booking.rooms > 1 ? "s" : ""}` },
                ].map(({ icon: Icon, label, value, sub }) => (
                  <div key={label} className="bg-secondary/40 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1">
                      <Icon className="w-3.5 h-3.5" /> {label}
                    </div>
                    <div className="font-bold text-sm">{value}</div>
                    {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Guest Info */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
            <div className="bg-primary/5 px-5 py-4 border-b border-border flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Guest Information</h2>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Name</div>
                <div className="font-semibold">{booking.guestName}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</div>
                <div className="font-semibold text-sm break-all">{booking.guestEmail}</div>
              </div>
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</div>
                <div className="font-semibold">{booking.guestPhone}</div>
              </div>
              {booking.specialRequests && (
                <div className="sm:col-span-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Special Requests</div>
                  <div className="text-sm text-muted-foreground italic">"{booking.specialRequests}"</div>
                </div>
              )}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-border">
            <div className="bg-primary/5 px-5 py-4 border-b border-border flex items-center gap-2">
              <BedDouble className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Payment Summary</h2>
            </div>
            <div className="p-5">
              <div className="space-y-2.5 pb-4 mb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Room Rate (₹{booking.pricePerNight.toLocaleString()} × {booking.nights} nights)</span>
                  <span>₹{(booking.pricePerNight * booking.nights).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>₹{Math.round(booking.totalPrice * 0.107).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl">
                <span>Total Paid</span>
                <span className="text-primary">₹{booking.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800 text-sm">Free Cancellation Policy</p>
              <p className="text-xs text-green-700 mt-0.5">Cancel before {format(parseISO(booking.checkIn), "dd MMM yyyy")} for a full refund. No questions asked.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              className="flex-1 h-12 bg-primary hover:bg-blue-800 text-white rounded-xl gap-2"
              onClick={() => setLocation("/my-bookings")}
            >
              <Building2 className="w-4 h-4" /> View My Bookings <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl gap-2"
              onClick={() => setLocation("/")}
            >
              Book Another Stay
            </Button>
            <Button variant="outline" className="h-12 rounded-xl gap-2 px-5">
              <Download className="w-4 h-4" /> Download
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
