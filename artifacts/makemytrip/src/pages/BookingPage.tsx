import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCreateBooking } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import {
  Building2, Calendar, Users, BedDouble, Shield, ArrowLeft,
  CreditCard, Phone, Mail, User, MessageSquare, Check, Loader2, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const roomId = searchParams.get("roomId") || "";
  const roomName = decodeURIComponent(searchParams.get("roomName") || "Standard Room");
  const pricePerNight = Number(searchParams.get("price") || 5000);
  const checkIn = searchParams.get("checkIn") || format(new Date(), "yyyy-MM-dd");
  const checkOut = searchParams.get("checkOut") || format(new Date(Date.now() + 2 * 86400000), "yyyy-MM-dd");
  const guests = Number(searchParams.get("guests") || 2);

  const nights = Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000));
  const totalPrice = pricePerNight * nights;
  const taxes = Math.round(totalPrice * 0.12);
  const grandTotal = totalPrice + taxes;

  const [form, setForm] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  const { mutate: createBooking, isPending } = useCreateBooking();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.guestName.trim()) e.guestName = "Name is required";
    if (!form.guestEmail.trim() || !/\S+@\S+\.\S+/.test(form.guestEmail)) e.guestEmail = "Valid email required";
    if (!form.guestPhone.trim() || form.guestPhone.length < 10) e.guestPhone = "Valid phone required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createBooking(
      {
        hotelId: id!,
        hotelName: "Hotel",
        roomTypeId: roomId,
        roomTypeName: roomName,
        checkIn,
        checkOut,
        guests,
        rooms: 1,
        pricePerNight,
        totalPrice: grandTotal,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone,
        specialRequests: form.specialRequests,
      },
      {
        onSuccess: (booking) => {
          setLocation(`/booking/confirmation/${booking.id}`);
        },
      }
    );
  };

  const field = (
    name: keyof typeof form,
    label: string,
    Icon: React.FC<any>,
    type = "text",
    placeholder = ""
  ) => (
    <div>
      <label className="block text-sm font-semibold mb-1.5 text-foreground">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type={type}
          value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          placeholder={placeholder}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all bg-white ${errors[name] ? "border-red-400" : "border-border"}`}
        />
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="bg-white border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <button onClick={() => window.history.back()} className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Hotel
          </button>
          <span>/</span>
          <span className="text-foreground font-medium">Complete Booking</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-border/50 py-4">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center gap-0">
            {[
              { num: 1, label: "Select Room", done: true },
              { num: 2, label: "Guest Details", active: true },
              { num: 3, label: "Confirmation" },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step.done ? "bg-green-500 text-white" : step.active ? "bg-primary text-white" : "bg-gray-100 text-muted-foreground"}`}>
                    {step.done ? <Check className="w-4 h-4" /> : step.num}
                  </div>
                  <span className={`text-xs mt-1 font-medium hidden sm:block ${step.active ? "text-primary" : "text-muted-foreground"}`}>{step.label}</span>
                </div>
                {i < 2 && <div className="w-16 sm:w-24 h-0.5 bg-gray-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">

            {/* Booking Summary Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" /> Your Booking
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-secondary/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1"><Calendar className="w-3.5 h-3.5" /> Check-in</div>
                  <div className="font-bold text-sm">{format(parseISO(checkIn), "EEE, dd MMM yyyy")}</div>
                  <div className="text-xs text-muted-foreground">After 2:00 PM</div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1"><Calendar className="w-3.5 h-3.5" /> Check-out</div>
                  <div className="font-bold text-sm">{format(parseISO(checkOut), "EEE, dd MMM yyyy")}</div>
                  <div className="text-xs text-muted-foreground">Before 12:00 PM</div>
                </div>
                <div className="bg-secondary/40 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase mb-1"><BedDouble className="w-3.5 h-3.5" /> Room</div>
                  <div className="font-bold text-sm">{roomName}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground"><Users className="w-3 h-3" /> {guests} Guest{guests > 1 ? "s" : ""} · {nights} Night{nights > 1 ? "s" : ""}</div>
                </div>
              </div>
            </div>

            {/* Guest Details */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Guest Details
              </h2>
              <div className="space-y-4">
                {field("guestName", "Full Name", User, "text", "e.g. Rajesh Kumar")}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {field("guestEmail", "Email Address", Mail, "email", "e.g. rajesh@email.com")}
                  {field("guestPhone", "Phone Number", Phone, "tel", "e.g. +91 98765 43210")}
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Special Requests <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      value={form.specialRequests}
                      onChange={e => setForm(f => ({ ...f, specialRequests: e.target.value }))}
                      placeholder="Any special needs, early check-in, etc."
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all bg-white resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-border">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { id: "card", label: "Credit/Debit Card" },
                  { id: "upi", label: "UPI" },
                  { id: "netbanking", label: "Net Banking" },
                ].map(pm => (
                  <button
                    type="button"
                    key={pm.id}
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3 rounded-xl border-2 text-sm font-semibold transition-all ${paymentMethod === pm.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/30"}`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Expiry Date</label>
                      <input type="text" placeholder="MM / YY" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">CVV</label>
                      <input type="text" placeholder="• • •" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
                    </div>
                  </div>
                </div>
              )}
              {paymentMethod === "upi" && (
                <input type="text" placeholder="Enter UPI ID (e.g. name@upi)" className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white" />
              )}
              {paymentMethod === "netbanking" && (
                <select className="w-full px-4 py-3 rounded-xl border border-border text-sm focus:outline-none bg-white">
                  <option>Select your bank</option>
                  {["SBI", "HDFC Bank", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Yes Bank"].map(b => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              )}
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 bg-accent hover:bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-accent/20 transition-all"
            >
              {isPending ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</> : `Pay ₹${grandTotal.toLocaleString()} & Confirm Booking`}
            </Button>

            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-green-500" /> 256-bit SSL encryption · Your data is safe
            </p>
          </form>

          {/* Price Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl p-5 shadow-sm border border-border">
              <h3 className="font-bold text-lg mb-4">Price Summary</h3>
              <div className="space-y-3 pb-4 mb-4 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">₹{pricePerNight.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                  <span className="font-medium">₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & fees (12%)</span>
                  <span className="font-medium">₹{taxes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon discount</span>
                  <span className="font-medium">- ₹0</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{grandTotal.toLocaleString()}</span>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-green-700 flex items-start gap-1.5">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  Free cancellation available. Cancel before 24h of check-in for a full refund.
                </p>
              </div>

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                  />
                  <Button variant="outline" className="text-sm rounded-xl border-primary text-primary hover:bg-primary hover:text-white">Apply</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
