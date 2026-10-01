import React from 'react';

// ==========================================
// SKELETON LOADERS FOR BARBERQ (PREMIUM UI)
// ==========================================
//  Yeh components server se data aane tak smooth pulsing/breathing
// animation dikhate hain taaki user ko blank screen na dikhe aur premium vibe mile.

/**
 * Single Service Card Skeleton
 *  Home page ke 'Our Services' card ka placeholder jisme icon, title, description aur button ka skeleton hai.
 */
export const ServiceCardSkeleton = () => {
  return (
    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/70 shadow-lg rounded-xl p-6 text-center flex flex-col items-center skeleton-pulse">
      {/* Icon Placeholder */}
      <div className="w-14 h-14 rounded-2xl skeleton-bar mb-4 flex items-center justify-center"></div>
      
      {/* Service Name Placeholder */}
      <div className="h-6 w-3/5 rounded-lg skeleton-bar mb-3"></div>
      
      {/* Description Placeholders */}
      <div className="h-4 w-4/5 rounded skeleton-bar mb-2"></div>
      <div className="h-4 w-3/5 rounded skeleton-bar mb-6"></div>

      {/* Book Now Button Placeholder */}
      <div className="h-11 w-32 rounded-full skeleton-bar mt-auto"></div>
    </div>
  );
};

/**
 * Grid of Service Card Skeletons (Default: 9 cards)
 *  Services section me by-default 9 skeleton cards render karne ke liye component.
 */
export const ServicesGridSkeleton = ({ count = 9 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </>
  );
};

/**
 * Single Barber Card Skeleton for TopBarbers Section
 *  TopBarbers section ke card ka placeholder jisme image overlay, rating, aur services line blink karti hai.
 */
export const TopBarberCardSkeleton = () => {
  return (
    <div className="relative rounded-xl overflow-hidden shadow-lg bg-gray-800/80 border border-gray-700/70 h-64 flex flex-col justify-end p-4 skeleton-pulse">
      {/* Card Image Area Placeholder */}
      <div className="absolute inset-0 skeleton-bar opacity-40"></div>
      
      {/* Dark Gradient Overlay for text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>

      {/* Barber Info Bottom Row */}
      <div className="relative z-10 w-full space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Name line */}
          <div className="h-4 w-3/5 rounded skeleton-bar"></div>
          {/* Rating badge */}
          <div className="h-4 w-10 rounded skeleton-bar bg-pink-500/20"></div>
        </div>

        <div className="flex items-center justify-between gap-2">
          {/* Services list line */}
          <div className="h-3 w-1/2 rounded skeleton-bar"></div>
          {/* Active status badge */}
          <div className="h-3 w-12 rounded skeleton-bar bg-green-500/20"></div>
        </div>
      </div>
    </div>
  );
};

/**
 * Grid of Top Barbers Skeletons (Default: 10 cards)
 *  TopBarbers home section me 10 cards ka skeleton grid render karta hai.
 */
export const TopBarbersGridSkeleton = ({ count = 10 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <TopBarberCardSkeleton key={index} />
      ))}
    </>
  );
};

/**
 * Barber Card Skeleton for the /barbers List Page
 *  /barbers page ke cards ka placeholder jisme full image, details, price aur address included hain.
 */
export const BarberListCardSkeleton = () => {
  return (
    <div className="bg-gray-800/80 backdrop-blur-md border border-gray-700/70 rounded-xl p-6 text-center skeleton-pulse flex flex-col">
      {/* Image Block Placeholder */}
      <div className="w-full h-64 rounded-lg skeleton-bar mb-4"></div>

      {/* Barber Name */}
      <div className="h-5 w-1/2 mx-auto rounded skeleton-bar mb-2"></div>

      {/* Services Subtitle */}
      <div className="h-4 w-3/4 mx-auto rounded skeleton-bar mb-2"></div>

      {/* Experience */}
      <div className="h-3 w-1/3 mx-auto rounded skeleton-bar mb-3"></div>

      {/* About Description 2 lines */}
      <div className="h-3 w-full rounded skeleton-bar mb-1.5"></div>
      <div className="h-3 w-4/5 mx-auto rounded skeleton-bar mb-4"></div>

      {/* Fees Pill */}
      <div className="h-5 w-20 mx-auto rounded-full skeleton-bar mb-3"></div>

      {/* Address Line */}
      <div className="h-3 w-3/5 mx-auto rounded skeleton-bar mt-auto"></div>
    </div>
  );
};

/**
 * Grid of Barber List Skeletons
 *  /barbers listing me 6 cards ka placeholder dikhata hai.
 */
export const BarberCardsGridSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BarberListCardSkeleton key={index} />
      ))}
    </>
  );
};

/**
 * Sidebar Categories Skeleton for /barbers
 *  Specialty categories ke sidebar buttons ka loading placeholder.
 */
export const SidebarCategoriesSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="w-full h-10 rounded-md bg-gray-800/80 border border-gray-700/70 skeleton-bar skeleton-pulse"
        ></div>
      ))}
    </div>
  );
};

/**
 * Booking Page Skeleton (/booking/:barberId)
 *  Barber booking page load hone tak pura profile aur appointment structure blink karta hai.
 */
export const BookingPageSkeleton = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header Placeholder */}
      <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 skeleton-pulse">
        <div className="h-8 w-20 rounded-full skeleton-bar"></div>
        <div className="h-6 w-36 rounded skeleton-bar"></div>
        <div className="h-7 w-16 rounded-full skeleton-bar"></div>
      </div>

      {/* Profile Card Placeholder */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl skeleton-pulse">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          {/* Avatar Circle */}
          <div className="w-52 h-52 rounded-full skeleton-bar flex-shrink-0"></div>

          {/* Right Details Grid */}
          <div className="flex-1 w-full space-y-4">
            <div className="h-7 w-48 rounded skeleton-bar"></div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="h-20 rounded-2xl skeleton-bar"></div>
              <div className="h-20 rounded-2xl skeleton-bar"></div>
              <div className="h-20 rounded-2xl skeleton-bar"></div>
              <div className="h-20 rounded-2xl skeleton-bar"></div>
            </div>
            <div className="h-20 rounded-2xl skeleton-bar"></div>
          </div>
        </div>
      </div>

      {/* Appointment Booking Box Placeholder */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl skeleton-pulse space-y-6">
        <div className="h-6 w-56 rounded skeleton-bar"></div>
        
        {/* Date Pills */}
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-16 h-20 rounded-2xl skeleton-bar flex-shrink-0"></div>
          ))}
        </div>

        {/* Services / Slot times */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-20 rounded-2xl skeleton-bar"></div>
          <div className="h-20 rounded-2xl skeleton-bar"></div>
        </div>

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-20 h-9 rounded-full skeleton-bar"></div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * My Bookings Cards Skeleton (/my-bookings)
 * My Bookings page me user ke appointment card ka loading placeholder.
 */
export const MyBookingsGridSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex flex-col bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-3xl p-6 space-y-4 skeleton-pulse"
        >
          {/* Header Row: Avatar & Barber Name */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-16 h-16 rounded-full skeleton-bar flex-shrink-0"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 w-40 rounded skeleton-bar"></div>
              <div className="h-3 w-28 rounded skeleton-bar"></div>
            </div>
            <div className="h-6 w-20 rounded-full skeleton-bar"></div>
          </div>

          {/* Booking Details Row */}
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded skeleton-bar"></div>
            <div className="h-4 w-1/2 rounded skeleton-bar"></div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-24 rounded-xl skeleton-bar"></div>
            <div className="h-9 w-20 rounded-xl skeleton-bar"></div>
          </div>
        </div>
      ))}
    </>
  );
};
