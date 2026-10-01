import React from "react";
import { Link } from "react-router-dom";
import { 
  PhoneCall, 
  Mail, 
  MapPin, 
  Scissors, 
  Heart, 
  Clock, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

// ==========================================
// BARBERQ PREMIUM FOOTER COMPONENT
// ==========================================
//  Premium glassmorphic footer jisme floating ambient glow,
// quick navigation links, contact info aur Anurag Kumar ka developer credit diya gaya hai.

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-slate-950/60 via-slate-950/90 to-black text-white border-t border-pink-500/20 pt-16 pb-8 mt-20 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Floating Accent Icons (Hidden on mobile) */}
      <div className="absolute top-8 right-12 text-pink-500/15 pointer-events-none hidden md:block animate-float">
        <Scissors size={48} />
      </div>
      <div className="absolute top-24 left-10 text-pink-500/15 pointer-events-none hidden md:block -scale-x-100 animate-float-delayed">
        <Scissors size={48} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="BarberQ Logo"
                className="w-11 h-11 rounded-xl object-cover shadow-[0_0_16px_rgba(236,72,153,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-amber-500/30"
              />
              <h2 className="text-2xl font-extrabold tracking-tight">
                Barber<span className="text-pink-500">Q</span>
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              BarberQ connects you with handpicked master barbers and elite styling studios. Book confirmed time slots in seconds, track queues in real-time, and skip the wait!
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-400/90 pt-1">
              <ShieldCheck size={16} className="text-green-400" />
              Verified Specialists & 100% Guaranteed Slots
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-3">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all duration-200">
                  <ArrowRight size={13} className="text-pink-400 opacity-60" /> Home
                </Link>
              </li>
              <li>
                <Link to="/barbers" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all duration-200">
                  <ArrowRight size={13} className="text-pink-400 opacity-60" /> All Barbers
                </Link>
              </li>
              <li>
                <a href="#services" className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all duration-200">
                  <ArrowRight size={13} className="text-pink-400 opacity-60" /> Our Services
                </a>
              </li>
              <li>
                <Link to="/about" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all duration-200">
                  <ArrowRight size={13} className="text-pink-400 opacity-60" /> About BarberQ
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="flex items-center gap-2 hover:text-pink-400 hover:translate-x-1 transition-all duration-200">
                  <ArrowRight size={13} className="text-pink-400 opacity-60" /> Support & Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Grooming Services */}
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-3">
              Top Services
            </h3>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/barbers/Haircut%20%26%20Styling" className="hover:text-pink-400 transition-colors">
                  Haircut & Beard Styling
                </Link>
              </li>
              <li>
                <Link to="/barbers/Beard%20Grooming" className="hover:text-pink-400 transition-colors">
                  Beard Sculpting & Trim
                </Link>
              </li>
              <li>
                <Link to="/barbers/Hair%20Spa" className="hover:text-pink-400 transition-colors">
                  Deep Nourishing Hair Spa
                </Link>
              </li>
              <li>
                <Link to="/barbers/Facial%20%26%20Spa" className="hover:text-pink-400 transition-colors">
                  Charcoal Detox Facial
                </Link>
              </li>
              <li>
                <Link to="/barbers/Kids%20Haircut" className="hover:text-pink-400 transition-colors">
                  Kids Gentle Haircut
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-pink-500 pl-3">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <PhoneCall size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
                <a href="tel:+917667033488" className="hover:text-pink-400 transition">
                  +91 7667033488
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
                <a href="mailto:contact@barberq.com" className="hover:text-pink-400 transition truncate">
                  contact@barberq.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-pink-400 mt-0.5 flex-shrink-0" />
                <span>123 Grooming Street, Barber City, India</span>
              </li>
              <li className="flex items-start gap-3 pt-1 text-xs text-gray-400">
                <Clock size={15} className="text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Mon – Sun: 10:00 AM – 10:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Developer Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-400 text-center sm:text-left">
          {/* Left: Copyright */}
          <p>
            &copy; {new Date().getFullYear()} <span className="text-white font-semibold">BarberQ</span>. All rights reserved.
          </p>

          {/* Right Corner: Developer Credit for Anurag Kumar */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-pink-500/30 text-gray-300 shadow-[0_0_12px_rgba(236,72,153,0.15)] hover:border-pink-500/60 transition-all group">
            <span>Developed with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <span className="font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Anurag Kumar
            </span>
          </div>
        </div>
      </div>

      {/* Scoped CSS for floating animation */}
      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes floatDelayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-float {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: floatDelayed 5s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
