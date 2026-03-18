import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Plane, Building2, Backpack, Train, Bus, Car, UserCircle2, BadgePercent, Menu, X, BookOpen } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { label: "Flights", icon: Plane, href: "/flights?from=DEL&to=BOM&date=2026-04-01" },
  { label: "Hotels", icon: Building2, href: "/hotels?city=Goa&checkIn=2026-04-10&checkOut=2026-04-12" },
  { label: "Holidays", icon: Backpack, href: "/holidays" },
  { label: "Trains", icon: Train, href: "/trains" },
  { label: "Buses", icon: Bus, href: "/#buses" },
  { label: "Cabs", icon: Car, href: "/cabs" },
  { label: "Offers", icon: BadgePercent, href: "/offers" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-border/50">
      <div className="container mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative w-9 h-9 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Plane className="w-5 h-5 -rotate-45" />
          </div>
          <span className="font-bold text-xl md:text-2xl tracking-tight text-primary">
            Journey<span className="text-accent">Joy</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navItems.map((item) => {
            const basePath = item.href.split("?")[0];
            const isActive = location === basePath || (basePath !== "/" && location.startsWith(basePath));
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-1 transition-colors duration-200 ${isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}`}
              >
                <item.icon className="w-4 h-4 xl:w-5 xl:h-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/my-bookings" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary transition-colors px-2 py-1">
            <BookOpen className="w-4 h-4" /> My Bookings
          </Link>
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 md:px-6 shadow-md shadow-primary/20 gap-2 text-sm h-9 md:h-10"
          >
            <UserCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Login</span>
          </Button>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-xl border border-border hover:bg-secondary transition-colors"
            onClick={() => setMenuOpen(v => !v)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-border bg-white">
          <div className="container mx-auto px-4 py-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
            <Link
              href="/my-bookings"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              <BookOpen className="w-5 h-5" /> My Bookings
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
