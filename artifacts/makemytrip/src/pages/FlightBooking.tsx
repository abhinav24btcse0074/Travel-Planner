import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSearchFlights, SearchFlightsClass } from "@workspace/api-client-react";
import { format, parseISO } from "date-fns";
import { Plane, User, Mail, Phone, CreditCard, Smartphone, Building, ChevronRight, CheckCircle2, ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Link } from "wouter";

const BOOKING_REF = () => "MMT" + Math.floor(Math.random() * 9000000 + 1000000);

export default function FlightBooking() {
  const [, params] = useRoute("/flights/:flightId/book");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(window.location.search);

  const from = searchParams.get("from") || "DEL";
  const to = searchParams.get("to") || "BOM";
  const date = searchParams.get("date") || format(new Date(), "yyyy-MM-dd");
  const passengers = Number(searchParams.get("passengers")) || 1;
  const flightClass = (searchParams.get("class") as SearchFlightsClass) || SearchFlightsClass.economy;
  const flightId = params?.flightId || "";

  const { data: flights } = useSearchFlights({ from, to, date, passengers, class: flightClass });
  const flight = flights?.find(f => f.id === flightId);

  const [step, setStep] = useState<"details" | "payment" | "confirmed">("details");
  const [bookingRef] = useState(BOOKING_REF());
  const [payMethod, setPayMethod] = useState("card");

  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", gender: "male",
    cardNumber: "", cardExpiry: "", cardCvv: "", cardName: "",
    upiId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateForm = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const validateDetails = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!form.email.includes("@")) errs.email = "Valid email required";
    if (form.phone.length < 10) errs.phone = "Valid phone required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleContinue = () => {
    if (!validateDetails()) return;
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePay = () => {
    if (payMethod === "card") {
      if (form.cardNumber.replace(/\s/g, "").length < 16) {
        toast({ title: "Invalid card number", variant: "destructive" }); return;
      }
      if (!form.cardExpiry) { toast({ title: "Enter card expiry", variant: "destructive" }); return; }
      if (form.cardCvv.length < 3) { toast({ title: "Invalid CVV", variant: "destructive" }); return; }
    }
    if (payMethod === "upi" && !form.upiId.includes("@")) {
      toast({ title: "Invalid UPI ID", variant: "destructive" }); return;
    }
    setStep("confirmed");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totalPrice = (flight?.price || 0) * passengers;
  const taxes = Math.round(totalPrice * 0.12);
  const fees = 399;
  const grandTotal = totalPrice + taxes + fees;

  if (!flight && flights) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-20">
            <Plane className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Flight not found</h2>
            <Link href="/flights" className="text-primary hover:underline">Back to search</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (step === "confirmed") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 md:px-6 py-12 max-w-2xl">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl border border-border"
          >
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}>
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
              <p className="text-white/80 text-lg">Your flight is booked successfully</p>
              <div className="mt-4 bg-white/20 rounded-2xl px-6 py-3 inline-block">
                <p className="text-xs text-white/70 font-semibold uppercase tracking-wide">Booking Reference</p>
                <p className="text-2xl font-mono font-bold tracking-wider">{bookingRef}</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {flight && (
                <div className="bg-secondary/40 rounded-2xl p-4">
                  <h3 className="font-bold mb-3 text-sm text-muted-foreground uppercase tracking-wide">Flight Details</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-primary shadow-sm text-xs">
                      {flight.airlineCode}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold">{flight.airline} · {flight.flightNumber}</p>
                      <p className="text-sm text-muted-foreground capitalize">{flight.class} class</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.departureTime}</p>
                      <p className="text-sm font-semibold text-primary">{flight.fromCode}</p>
                      <p className="text-xs text-muted-foreground">{format(parseISO(date), "dd MMM yyyy")}</p>
                    </div>
                    <div className="flex flex-col items-center px-4">
                      <p className="text-xs text-muted-foreground">{flight.duration}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <div className="w-16 h-px bg-border" />
                        <Plane className="w-4 h-4 text-primary" />
                        <div className="w-16 h-px bg-border" />
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      </div>
                      <p className="text-xs text-accent font-bold mt-1">{flight.stops === 0 ? "Non-stop" : `${flight.stops} stop`}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{flight.arrivalTime}</p>
                      <p className="text-sm font-semibold text-primary">{flight.toCode}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Passenger</p>
                  <p className="font-semibold">{form.firstName} {form.lastName}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-semibold truncate">{form.email}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Passengers</p>
                  <p className="font-semibold">{passengers} Adult{passengers > 1 ? "s" : ""}</p>
                </div>
                <div className="p-3 bg-secondary/30 rounded-xl">
                  <p className="text-xs text-muted-foreground mb-1">Total Paid</p>
                  <p className="font-bold text-primary">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">✈️ E-ticket sent to {form.email}</p>
                <p className="text-xs text-blue-600">Please arrive at the airport at least 90 minutes before departure. Carry a valid photo ID.</p>
              </div>

              <Button
                onClick={() => setLocation("/")}
                className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl font-bold h-12"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="bg-primary text-white py-5">
        <div className="container mx-auto px-4 md:px-6">
          <Link href={`/flights?from=${from}&to=${to}&date=${date}&passengers=${passengers}&class=${flightClass}`}
            className="flex items-center gap-1.5 text-sm text-primary-foreground/70 hover:text-white mb-3 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Search
          </Link>
          <div className="flex items-center gap-2 text-xl font-bold">
            <Plane className="w-5 h-5 text-accent" />
            <span>{from}</span>
            <ChevronRight className="w-4 h-4 text-primary-foreground/50" />
            <span>{to}</span>
          </div>
          <p className="text-primary-foreground/70 text-sm mt-1">{format(parseISO(date), "EEE, dd MMM yyyy")} · {passengers} Passenger{passengers > 1 ? "s" : ""} · <span className="capitalize">{flightClass}</span></p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-border">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            {["details", "payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                {i > 0 && <div className={`w-12 h-px ${step === "payment" ? "bg-primary" : "bg-border"}`} />}
                <div className={`flex items-center gap-1.5 ${step === s ? "text-primary font-bold" : step === "payment" && s === "details" ? "text-green-600 font-semibold" : "text-muted-foreground"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === s ? "bg-primary text-white" : step === "payment" && s === "details" ? "bg-green-500 text-white" : "bg-secondary text-muted-foreground"}`}>
                    {step === "payment" && s === "details" ? "✓" : i + 1}
                  </div>
                  <span className="capitalize hidden sm:block">{s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Form */}
          <div className="lg:col-span-2">
            {step === "details" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Passenger Details
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { key: "firstName", label: "First Name", placeholder: "Rahul", type: "text" },
                      { key: "lastName", label: "Last Name", placeholder: "Sharma", type: "text" },
                      { key: "email", label: "Email Address", placeholder: "rahul@example.com", type: "email" },
                      { key: "phone", label: "Mobile Number", placeholder: "9876543210", type: "tel" },
                      { key: "dob", label: "Date of Birth", placeholder: "", type: "date" },
                    ].map(field => (
                      <div key={field.key} className={field.key === "email" ? "sm:col-span-2" : ""}>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">{field.label}</label>
                        <input
                          type={field.type}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => updateForm(field.key, e.target.value)}
                          placeholder={field.placeholder}
                          className={`w-full border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${errors[field.key] ? "border-destructive" : "border-border focus:border-primary/60"}`}
                        />
                        {errors[field.key] && <p className="text-xs text-destructive mt-1">{errors[field.key]}</p>}
                      </div>
                    ))}
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Gender</label>
                      <select
                        value={form.gender}
                        onChange={e => updateForm("gender", e.target.value)}
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 bg-white cursor-pointer"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                  <h3 className="font-bold text-base mb-3">Add-ons & Preferences</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Extra Baggage (15 kg)", price: 799, icon: "🧳" },
                      { label: "Travel Insurance", price: 299, icon: "🛡️" },
                      { label: "Meal Preference", price: 350, icon: "🍱" },
                      { label: "Seat Selection", price: 199, icon: "💺" },
                    ].map((addon, i) => (
                      <label key={i} className="flex items-center gap-3 p-3 border border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all">
                        <input type="checkbox" className="rounded border-border text-primary focus:ring-primary" />
                        <span className="text-xl">{addon.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">{addon.label}</p>
                          <p className="text-xs text-accent font-bold">+₹{addon.price}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full bg-accent hover:bg-orange-600 text-white font-bold text-base h-12 rounded-xl shadow-lg shadow-accent/20"
                >
                  Continue to Payment <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </motion.div>
            )}

            {step === "payment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-border">
                  <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" /> Payment Method
                  </h2>

                  <div className="flex flex-wrap gap-3 mb-5">
                    {[
                      { id: "card", label: "Credit/Debit Card", icon: <CreditCard className="w-4 h-4" /> },
                      { id: "upi", label: "UPI", icon: <Smartphone className="w-4 h-4" /> },
                      { id: "netbanking", label: "Net Banking", icon: <Building className="w-4 h-4" /> },
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPayMethod(m.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${payMethod === m.id ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}
                      >
                        {m.icon} {m.label}
                      </button>
                    ))}
                  </div>

                  {payMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Card Number</label>
                        <input
                          type="text"
                          value={form.cardNumber}
                          onChange={e => updateForm("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim().slice(0, 19))}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono font-medium focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={form.cardExpiry}
                            onChange={e => updateForm("cardExpiry", e.target.value.replace(/[^\d/]/g, "").slice(0, 5))}
                            placeholder="12/27"
                            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono font-medium focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">CVV</label>
                          <input
                            type="password"
                            value={form.cardCvv}
                            onChange={e => updateForm("cardCvv", e.target.value.slice(0, 4))}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-mono font-medium focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">Cardholder Name</label>
                        <input
                          type="text"
                          value={form.cardName}
                          onChange={e => updateForm("cardName", e.target.value)}
                          placeholder="RAHUL SHARMA"
                          className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-medium uppercase focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                    </div>
                  )}

                  {payMethod === "upi" && (
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">UPI ID</label>
                      <input
                        type="text"
                        value={form.upiId}
                        onChange={e => updateForm("upiId", e.target.value)}
                        placeholder="yourname@paytm / @upi"
                        className="w-full border border-border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
                      />
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {["Google Pay", "PhonePe", "Paytm", "BHIM"].map(app => (
                          <button
                            key={app}
                            onClick={() => updateForm("upiId", `user@${app.toLowerCase().replace(" ", "")}`)}
                            className="text-xs px-3 py-1.5 border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-all font-semibold"
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {payMethod === "netbanking" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {["SBI", "HDFC", "ICICI", "Axis", "Kotak", "PNB", "Yes Bank", "Other"].map(bank => (
                        <button key={bank} className="p-3 border border-border rounded-xl text-sm font-semibold hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                          {bank}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-xl" onClick={() => setStep("details")}>
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>
                  <Button
                    onClick={handlePay}
                    className="flex-1 bg-accent hover:bg-orange-600 text-white font-bold text-base h-12 rounded-xl shadow-lg shadow-accent/20"
                  >
                    Pay ₹{grandTotal.toLocaleString()} <ShieldCheck className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-green-500" /> Your payment is 100% secure and encrypted
                </p>
              </motion.div>
            )}
          </div>

          {/* Price Summary */}
          <div className="space-y-4">
            {flight && (
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-border sticky top-24">
                <h3 className="font-bold text-base mb-4">Price Summary</h3>

                <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-xl mb-4">
                  <div className="w-9 h-9 rounded-lg bg-white border border-border flex items-center justify-center font-bold text-primary text-xs shadow-sm">
                    {flight.airlineCode}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{flight.airline}</p>
                    <p className="text-xs text-muted-foreground">{flight.flightNumber} · {flight.fromCode} → {flight.toCode}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base fare × {passengers}</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & fees (12%)</span>
                    <span>₹{taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service charge</span>
                    <span>₹{fees}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary text-xl">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {["Free cancellation within 24h", "Instant e-ticket on email", "Web check-in included"].map((b, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" /> {b}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
