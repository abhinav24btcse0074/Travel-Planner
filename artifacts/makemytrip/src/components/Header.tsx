import { Link } from "wouter";
import { Plane, Building2, Backpack, Train, Bus, Car, UserCircle2 } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { label: "Flights", icon: Plane, href: "/flights?from=DEL&to=BOM&date=2024-12-01" },
  { label: "Hotels", icon: Building2, href: "/hotels?city=Goa&checkIn=2024-12-01&checkOut=2024-12-05" },
  { label: "Holidays", icon: Backpack, href: "/#holidays" },
  { label: "Trains", icon: Train, href: "/#trains" },
  { label: "Buses", icon: Bus, href: "/#buses" },
  { label: "Cabs", icon: Car, href: "/#cabs" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
             <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-primary">
            Journey<span className="text-accent">Joy</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className="flex flex-col items-center gap-1.5 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Need help?</span>
            <span className="text-sm font-bold text-primary">+91 1800 123 4567</span>
          </div>
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-md shadow-primary/20 gap-2"
          >
            <UserCircle2 className="w-5 h-5" />
            <span className="hidden sm:inline">Login / Sign Up</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
