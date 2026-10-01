import React, { useEffect, useRef, useState } from 'react';
import { Star, Scissors, UserCheck } from 'lucide-react';

// ==========================================
// BARBERQ LIVE TESTIMONIALS COMPONENT
// ==========================================
//  Yeh component do columns me opposite vertical scrolling (up & down)
// dikhata hai jisse live streaming/organic review vibe milti hai. Hover par auto-pause hota hai.

const Testimonial = () => {
  const scrollRefLeft = useRef(null);
  const scrollRefRight = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Indian Barbers and Verified Clients Testimonials Data
  const testimonials = [
    //  Master Barbers
    {
      id: 1,
      name: "Rajesh Kumar",
      role: "Master Stylist • Mumbai",
      rating: 5,
      text: "BarberQ has completely transformed our salon workflow. No more crowded waiting lounge — clients arrive right on their scheduled slot!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      type: "barber",
      speciality: "Fade & Beard Sculpting",
    },
    {
      id: 2,
      name: "Aman Verma",
      role: "Senior Barber • Delhi NCR",
      rating: 5,
      text: "Real-time queue tracking and online prepayments have helped me double my bookings without any double-booking hassles.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      type: "barber",
      speciality: "Classic Scissor Cut",
    },
    {
      id: 3,
      name: "Sameer Sheikh",
      role: "Grooming Director • Bangalore",
      rating: 5,
      text: "The direct in-app chat lets clients share reference haircut photos beforehand. My consultations are 10x faster now!",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80",
      type: "barber",
      speciality: "Hair Spa & Texturizing",
    },
    {
      id: 4,
      name: "Deepak Yadav",
      role: "Hair Artist • Pune",
      rating: 5,
      text: "The clean dashboard and instant socket notifications keep our entire team in sync every single morning.",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      type: "barber",
      speciality: "Beard Architecture",
    },
    {
      id: 5,
      name: "Arjun Singh",
      role: "Precision Barber • Chandigarh",
      rating: 5,
      text: "Clients love the seamless Stripe checkout and automated email confirmations. A truly world-class platform.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
      type: "barber",
      speciality: "Taper & Skin Fade",
    },

    //  Happy Clients
    {
      id: 6,
      name: "Rohan Mehta",
      role: "Software Engineer • Bengaluru",
      rating: 5,
      text: "Never waited in a barbershop line again! Booked Rajesh on BarberQ, walked in, got the freshest low taper fade in 30 mins.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      type: "client",
      speciality: "Loyal Customer",
    },
    {
      id: 7,
      name: "Priya Sharma",
      role: "Creative Director • Mumbai",
      rating: 5,
      text: "Finding trusted barbers with genuine ratings and verified service menus used to be tricky. BarberQ made it effortless.",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80",
      type: "client",
      speciality: "Regular Client",
    },
    {
      id: 8,
      name: "Vikram Malhotra",
      role: "Startup Founder • Delhi",
      rating: 5,
      text: "The Live Queue Tracker is pure magic. I can finish my coffee meetings and arrive exactly when my chair is ready!",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80",
      type: "client",
      speciality: "VIP Member",
    },
    {
      id: 9,
      name: "Ananya Singh",
      role: "Marketing Specialist • Hyderabad",
      rating: 5,
      text: "Booked a grooming package for my brother's wedding. Everything from slot confirmation to execution was top-notch.",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
      type: "client",
      speciality: "Verified Customer",
    },
    {
      id: 10,
      name: "Kabir Sen",
      role: "Product Manager • Kolkata",
      rating: 5,
      text: "Clean, ultra-fast UI and instant slot booking. BarberQ is now my go-to grooming app every two weeks without fail.",
      image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80",
      type: "client",
      speciality: "Verified Customer",
    },
  ];

  const leftTestimonials = testimonials.filter((t) => t.type === "barber");
  const rightTestimonials = testimonials.filter((t) => t.type === "client");

  // Smooth opposite vertical scrolling loop logic (Left up, Right down)
  useEffect(() => {
    const scrollLeft = scrollRefLeft.current;
    const scrollRight = scrollRefRight.current;
    if (!scrollLeft || !scrollRight) return;

    // Initial position for right column to scroll backward smoothly
    if (scrollRight.scrollTop === 0) {
      scrollRight.scrollTop = scrollRight.scrollHeight / 2;
    }

    const scrollSpeed = 0.55;
    let rafId;

    const smoothScroll = () => {
      if (!isPaused) {
        // Left column goes UP (scrollTop increases)
        scrollLeft.scrollTop += scrollSpeed;
        // Right column goes DOWN (scrollTop decreases)
        scrollRight.scrollTop -= scrollSpeed;

        // Infinite loop seamless wrap-around
        if (scrollLeft.scrollTop >= scrollLeft.scrollHeight / 2) {
          scrollLeft.scrollTop = 0;
        }
        if (scrollRight.scrollTop <= 0) {
          scrollRight.scrollTop = scrollRight.scrollHeight / 2;
        }
      }
      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  // Star Rating Helper (Pink for Barbers, Royal Violet for Clients - perfectly harmonized with dark indigo background)
  const renderStars = (rating, direction = "left") => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={13}
          className={
            i < rating
              ? direction === "left"
                ? "text-pink-400 fill-pink-400"
                : "text-violet-400 fill-violet-400"
              : "text-gray-700"
          }
        />
      ))}
    </div>
  );

  // Single Testimonial Card Component
  const TestimonialCard = ({ item, direction }) => (
    <div
      className={`bg-slate-900/70 backdrop-blur-md rounded-2xl p-5 mb-4 shadow-xl border border-white/10 transition-all duration-300 group ${
        direction === "left"
          ? "border-l-4 border-l-pink-500 hover:border-pink-500/50 hover:shadow-pink-500/10"
          : "border-l-4 border-l-violet-400 hover:border-violet-500/50 hover:shadow-violet-500/10"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className="w-13 h-13 rounded-full object-cover border-2 border-white/10 group-hover:scale-105 transition-transform duration-300 shadow-md"
          />
          <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
            direction === "left" ? "bg-pink-500" : "bg-violet-400"
          }`}></span>
        </div>

        {/* Text Area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div>
              <h4 className={`font-bold text-white text-sm sm:text-base transition-colors truncate ${
                direction === "left" ? "group-hover:text-pink-400" : "group-hover:text-violet-400"
              }`}>
                {item.name}
              </h4>
              <p className="text-xs text-gray-400 truncate">{item.role}</p>
            </div>
            <div className="hidden sm:block flex-shrink-0">
              {renderStars(item.rating, direction)}
            </div>
          </div>

          <p className="text-gray-300 text-xs sm:text-sm italic leading-relaxed mt-2 line-clamp-3">
            "{item.text}"
          </p>

          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
            <span className={`text-[10px] font-semibold tracking-wide uppercase ${
              direction === "left" ? "text-pink-400/90" : "text-violet-400/90"
            }`}>
              {item.speciality}
            </span>
            <div className="sm:hidden">
              {renderStars(item.rating, direction)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden" id="testimonials">
      {/* Background ambient lighting glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
          Voices of <span className="text-pink-500">Trust</span>
        </h2>
        <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Hear directly from verified master barbers and satisfied clients who rely on BarberQ every day for seamless grooming appointments.
        </p>
      </div>

      {/* Two Columns Grid Container with Opposite Live Motion */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto items-stretch"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left Column: Master Barbers (Scrolling UP) */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
          {/* Column Header Badge */}
          <div className="py-3 px-5 bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-b border-pink-500/20 flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-pink-400 text-sm sm:text-base">
              <Scissors size={18} className="text-pink-400" />
              Master Stylists
            </span>
            <span className="text-[11px] bg-pink-500/20 text-pink-300 px-2.5 py-0.5 rounded-full font-semibold border border-pink-500/30">
              Verified Partners
            </span>
          </div>

          {/* Scrolling Container */}
          <div
            className="h-[380px] sm:h-[420px] overflow-y-hidden no-scrollbar p-4 space-y-4"
            ref={scrollRefLeft}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...leftTestimonials, ...leftTestimonials].map((item, index) => (
              <TestimonialCard
                key={`barber-${index}`}
                item={item}
                direction="left"
              />
            ))}
          </div>

          {/* Soft Gradient Overlay Masks for seamless fading top & bottom */}
          <div className="absolute top-12 left-0 right-0 h-10 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Right Column: Happy Clients (Scrolling DOWN) */}
        <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-slate-950/40 backdrop-blur-md shadow-2xl">
          {/* Column Header Badge */}
          <div className="py-3 px-5 bg-gradient-to-r from-violet-500/20 to-purple-600/20 border-b border-violet-500/20 flex items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-violet-300 text-sm sm:text-base">
              <UserCheck size={18} className="text-violet-400" />
              Happy Clients
            </span>
            <span className="text-[11px] bg-violet-500/20 text-violet-300 px-2.5 py-0.5 rounded-full font-semibold border border-violet-500/30">
              Verified Reviews
            </span>
          </div>

          {/* Scrolling Container */}
          <div
            className="h-[380px] sm:h-[420px] overflow-y-hidden no-scrollbar p-4 space-y-4"
            ref={scrollRefRight}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
          >
            {[...rightTestimonials, ...rightTestimonials].map((item, index) => (
              <TestimonialCard
                key={`client-${index}`}
                item={item}
                direction="right"
              />
            ))}
          </div>

          {/* Soft Gradient Overlay Masks */}
          <div className="absolute top-12 left-0 right-0 h-10 bg-gradient-to-b from-slate-950/80 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Scoped CSS for scrollbar hiding */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
};

export default Testimonial;
