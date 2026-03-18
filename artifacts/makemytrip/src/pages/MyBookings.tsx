import { useState } from "react";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useGetBookings } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  Building2, Calendar, Users, BedDouble, MapPin, Search,
  CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";

type TabType = "all" | "confirmed" | "pending" | "cancelled" | "completed";

const statusConfig: Record<string, { label: string; icon: React.FC<any>; badge: string }> = {
  confirmed: { label: "Confirmed", icon: CheckCircle2, badge: "bg-green-100 text-green-700 border-green-200" },
  pending: { label: "Pending", icon: Clock, badge: "bg-amber-100 text-amber-700 border-amber-200" },
  cancelled: { label: "Cancelled", icon: XCircle, badge: "bg-red-100 text-red-700 border-red-200" },
  completed: { label: "Completed", icon: AlertCircle, badge: "bg-blue-100 text-blue-700 border-blue-200" },
};

export default function MyBookings() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [search, setSearch] = useState("");

  const { data: bookings, isLoading } = useGetBookings();

  const filtered = bookings?.filter(b => {
    const matchTab = activeTab === "all" || b.status === activeTab;
    const matchSearch = !search || b.hotelName.toLowerCase().includes(search.toLowerCase()) || b.bookingRef.toLowerCase().includes(search.toLowerCase()) || b.city.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: "all", label: "All Bookings", count: bookings?.length },
    { key: "confirmed", label: "Confirmed", count: bookings?.filter(b => b.status === "confirmed").length },
    { key: "pending", label: "Pending", count: bookings?.filter(b => b.status === "pending").length },
    { key: "completed", label: "Completed", count: bookings?.filter(b => b.status === "completed").length },
    { key: "cancelled", label: "Cancelled", count: bookings?.filter(b => b.status === "cancelled").length },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Page Header */}
      <div className="bg-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">My Bookings</h1>
          <p className="text-primary-foreground/80 text-sm">Manage and track all your hotel reservations</p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 lg:py-8 -mt-4">

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Bookings", count: bookings?.length || 0, color: "bg-primary" },
            { label: "Confirmed", count: bookings?.filter(b => b.status === "confirmed").length || 0, color: "bg-green-500" },
            { label: "Pending", count: bookings?.filter(b => b.status === "pending").length || 0, color: "bg-amber-500" },
            { label: "Completed", count: bookings?.filter(b => b.status === "completed").length || 0, color: "bg-blue-500" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-border">
              <div className={`w-8 h-1.5 rounded-full ${stat.color} mb-3`} />
              <div className="text-2xl font-bold">{stat.count}</div>
              <div className="text-xs text-muted-foreground font-medium mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-border mb-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by hotel name, booking ref, or city..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-0.5">
              {tabs.slice(0, 5).map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.key ? "bg-primary text-white shadow-sm" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                >
                  {tab.label}{tab.count !== undefined && tab.count > 0 ? ` (${tab.count})` : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 bg-white rounded-2xl animate-pulse border border-border" />
            ))}
          </div>
        ) : filtered?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-border shadow-sm">
            <Building2 className="w-14 h-14 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No bookings found</h3>
            <p className="text-muted-foreground text-sm mb-6">
              {search ? "Try adjusting your search filters." : "You haven't made any hotel bookings yet."}
            </p>
            <Button className="bg-accent hover:bg-orange-600 text-white rounded-xl" onClick={() => setLocation("/hotels?city=Goa&checkIn=2026-04-01&checkOut=2026-04-03")}>
              Find Hotels
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered?.map((booking, idx) => {
              const status = statusConfig[booking.status] || statusConfig.confirmed;
              const StatusIcon = status.icon;
              return (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  key={booking.id}
                  className="bg-white rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Hotel Image */}
                    <div className="relative h-48 sm:h-auto sm:w-48 lg:w-56 flex-shrink-0">
                      <img
                        src={booking.hotelImage}
                        alt={booking.hotelName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent sm:hidden" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 p-4 md:p-5 flex flex-col">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg leading-tight">{booking.hotelName}</h3>
                            <Badge className={`${status.badge} border text-xs font-semibold capitalize`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {booking.city}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">Ref: <span className="font-mono font-semibold text-primary">{booking.bookingRef}</span></p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xl font-bold">₹{booking.totalPrice.toLocaleString()}</div>
                          <div className="text-xs text-muted-foreground">Total paid</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                        {[
                          { icon: Calendar, label: "Check-in", value: format(parseISO(booking.checkIn), "dd MMM yyyy") },
                          { icon: Calendar, label: "Check-out", value: format(parseISO(booking.checkOut), "dd MMM yyyy") },
                          { icon: BedDouble, label: "Room", value: booking.roomTypeName },
                          { icon: Users, label: "Guests", value: `${booking.guests} · ${booking.nights} Night${booking.nights > 1 ? "s" : ""}` },
                        ].map(({ icon: Icon, label, value }) => (
                          <div key={label} className="bg-secondary/40 rounded-xl p-2.5">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-0.5">
                              <Icon className="w-3 h-3" /> {label}
                            </div>
                            <div className="text-xs font-semibold truncate">{value}</div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-auto">
                        <Button
                          variant="default"
                          className="bg-primary hover:bg-blue-800 text-white rounded-xl text-sm h-9 gap-1.5"
                          onClick={() => setLocation(`/booking/confirmation/${booking.id}`)}
                        >
                          View Details <ArrowRight className="w-3.5 h-3.5" />
                        </Button>
                        {booking.status === "confirmed" && (
                          <Button variant="outline" className="rounded-xl text-sm h-9 text-red-600 border-red-200 hover:bg-red-50">
                            Cancel Booking
                          </Button>
                        )}
                        {booking.status === "completed" && (
                          <Button variant="outline" className="rounded-xl text-sm h-9 gap-1.5">
                            Write a Review
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
