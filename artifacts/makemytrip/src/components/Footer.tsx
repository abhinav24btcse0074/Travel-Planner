import { Link } from "wouter";
import { Plane, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                 <Plane className="w-6 h-6 -rotate-45" />
              </div>
              <span className="font-display font-bold text-2xl tracking-tight text-white">
                Journey<span className="text-accent">Joy</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
              Your trusted travel partner for exploring the world. We offer the best deals on flights, hotels, and holiday packages to make your dream vacations a reality.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors">
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Careers</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Travel Blog</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Contact Support</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Partner With Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Legal</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link href="/" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Cancellation Policy</Link></li>
              <li><Link href="/" className="hover:text-accent transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6">Newsletter</h4>
            <p className="text-sm text-primary-foreground/70 mb-4">
              Subscribe to get the latest travel deals and inspirations delivered to your inbox.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
              />
              <button 
                type="submit"
                className="px-4 py-3 rounded-xl bg-accent hover:bg-accent/90 text-white font-semibold transition-colors"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} JourneyJoy Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Made with ❤️ for Travelers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
