import React from 'react';

// ==========================================
// ADMIN PANEL SKELETON LOADERS
// ==========================================
//  Admin aur Barber panel ke sabhi pages ke liye reusable
// smooth pulsing/breathing skeleton components.

/**
 * 4 Stat Cards Skeleton for Admin Dashboard
 *  Admin dashboard ke 4 stat cards (Barbers, Bookings, Customers, Revenue) ka skeleton placeholder.
 */
export const AdminDashboardSkeleton = () => {
  return (
    <div className="p-6 text-white space-y-8 animate-fadeIn">
      {/* Top 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg skeleton-pulse"
          >
            {/* Icon Box */}
            <div className="w-14 h-14 rounded-xl skeleton-bar flex-shrink-0"></div>
            {/* Number & Label */}
            <div className="space-y-2 flex-1">
              <div className="h-7 w-16 rounded skeleton-bar"></div>
              <div className="h-4 w-24 rounded skeleton-bar"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings Table Skeleton */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-lg skeleton-pulse space-y-4">
        {/* Table Title */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded skeleton-bar"></div>
          <div className="h-6 w-44 rounded skeleton-bar"></div>
        </div>

        {/* 5 Row Skeletons */}
        <div className="space-y-3 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl gap-4"
            >
              <div className="w-10 h-10 rounded-full skeleton-bar flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded skeleton-bar"></div>
                <div className="h-3 w-48 rounded skeleton-bar"></div>
              </div>
              <div className="h-7 w-20 rounded-full skeleton-bar"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Barber List Cards Skeleton for Admin (BarberList.jsx)
 *  Admin panel ke 'Our Barbers' page ka grid skeleton (6 cards).
 */
export const AdminBarberListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-[#1e293b]/70 backdrop-blur-md rounded-2xl shadow-lg p-6 skeleton-pulse flex flex-col"
        >
          {/* Barber Image Placeholder */}
          <div className="w-full h-52 rounded-xl skeleton-bar mb-4"></div>

          {/* Name & Services */}
          <div className="space-y-2 mb-4">
            <div className="h-5 w-1/2 rounded skeleton-bar"></div>
            <div className="h-4 w-4/5 rounded skeleton-bar"></div>
          </div>

          {/* Checkbox Placeholder */}
          <div className="flex items-center gap-3 mt-auto pt-2">
            <div className="w-5 h-5 rounded skeleton-bar"></div>
            <div className="h-4 w-24 rounded skeleton-bar"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Table Rows Skeleton for Bookings (AllBooking.jsx & BarberBookings.jsx)
 *  Bookings table me 6 rows ka skeleton placeholder.
 */
export const TableRowsSkeleton = ({ rows = 6 }) => {
  return (
    <div className="mt-3 space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-7 gap-4 items-center bg-white/5 rounded-lg px-4 py-3 text-sm skeleton-pulse"
        >
          {/* Col 1: Index */}
          <div className="h-4 w-4 rounded skeleton-bar"></div>

          {/* Col 2: Customer (Avatar + Name) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton-bar flex-shrink-0"></div>
            <div className="h-4 w-24 rounded skeleton-bar"></div>
          </div>

          {/* Col 3: Age */}
          <div className="h-4 w-8 rounded skeleton-bar max-sm:hidden"></div>

          {/* Col 4: Date & Time */}
          <div className="h-4 w-28 rounded skeleton-bar"></div>

          {/* Col 5: Barber (Avatar + Name) */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full skeleton-bar flex-shrink-0"></div>
            <div className="h-4 w-24 rounded skeleton-bar"></div>
          </div>

          {/* Col 6: Fees */}
          <div className="h-4 w-12 rounded skeleton-bar"></div>

          {/* Col 7: Action Button */}
          <div className="h-7 w-20 rounded-full skeleton-bar"></div>
        </div>
      ))}
    </div>
  );
};

/**
 * Barber Dashboard Skeleton (BarberDashboard.jsx)
 *  Barber panel dashboard ke 3 stat cards aur latest bookings ka skeleton.
 */
export const BarberDashboardSkeleton = () => {
  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white space-y-8 animate-fadeIn">
      {/* Top 3 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg skeleton-pulse"
          >
            <div className="w-14 h-14 rounded-xl skeleton-bar flex-shrink-0"></div>
            <div className="space-y-2 flex-1">
              <div className="h-7 w-24 rounded skeleton-bar"></div>
              <div className="h-4 w-20 rounded skeleton-bar"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Bookings Card Skeleton */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-lg skeleton-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded skeleton-bar"></div>
          <div className="h-6 w-44 rounded skeleton-bar"></div>
        </div>

        <div className="space-y-3 pt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl gap-4"
            >
              <div className="w-10 h-10 rounded-full skeleton-bar flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-36 rounded skeleton-bar"></div>
                <div className="h-3 w-40 rounded skeleton-bar"></div>
              </div>
              <div className="h-7 w-16 rounded-full skeleton-bar"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Barber Profile Skeleton (BarberProfile.jsx)
 *  Barber profile update page ka skeleton loading component.
 */
export const BarberProfileSkeleton = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 text-white animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-xl skeleton-pulse space-y-6">
        <div className="flex flex-col sm:flex-row gap-6 items-center">
          <div className="w-32 h-32 rounded-full skeleton-bar flex-shrink-0"></div>
          <div className="space-y-3 flex-1 w-full text-center sm:text-left">
            <div className="h-7 w-48 rounded skeleton-bar mx-auto sm:mx-0"></div>
            <div className="h-4 w-64 rounded skeleton-bar mx-auto sm:mx-0"></div>
            <div className="h-4 w-32 rounded skeleton-bar mx-auto sm:mx-0"></div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-white/10">
          <div className="h-10 w-full rounded-xl skeleton-bar"></div>
          <div className="h-10 w-full rounded-xl skeleton-bar"></div>
          <div className="h-24 w-full rounded-xl skeleton-bar"></div>
        </div>
      </div>
    </div>
  );
};
