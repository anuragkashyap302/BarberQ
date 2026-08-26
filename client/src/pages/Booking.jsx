import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { barberImages } from "../assets/assets";

const Booking = () => {
  const { barberId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { barbers, backendURL, token, getBarbersData,userData } =
    useContext(AppContext);

  const [barberSlots, setBarberSlots] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  // Payment method ke status ko track karne ke liye state (Cash or Stripe)
  const [paymentMethod, setPaymentMethod] = useState("Cash");

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const barber = barbers.find((b) => b._id === barberId);
  const preSelectedServiceName = searchParams.get("service");

  // Yeh hook URL parameter se aayi pre-selected service ko state me set karta hai
  useEffect(() => {
    if (barber && preSelectedServiceName) {
      const found = (barber.services || []).find(s => s.name === preSelectedServiceName);
      if (found) {
        setSelectedService(found);
      }
    }
  }, [barber, preSelectedServiceName]);

  // Related barbers who offer at least one shared service
  // Yeh related barbers filter karta hai jo same type ki service dete hain
  const relatedBarbers = barber
    ? barbers.filter(
        (b) => b._id !== barberId && (
          Array.isArray(b.services) && Array.isArray(barber.services)
            ? b.services.some(s1 => barber.services.some(s2 => s1._id === s2._id))
            : false
        )
      )
    : [];

  //  Generate slots for next 7 days
  const generateSlots = () => {
    let today = new Date();
    let weekSlots = [];

    for (let i = 0; i < 7; i++) {
      let currDate = new Date(today);
      currDate.setDate(today.getDate() + i);

      let start = new Date(currDate);
      start.setHours(10, 0, 0, 0);

      let end = new Date(currDate);
      end.setHours(22, 0, 0, 0);

      let slotTime = new Date(start);

      if (currDate.toDateString() === today.toDateString() && today < end) {
        let minSlotTime = new Date(today.getTime() + 30 * 60000);
        if (minSlotTime > slotTime) {
          slotTime = new Date(minSlotTime);
          let minutes = slotTime.getMinutes();
          if (minutes > 0 && minutes <= 30) {
            slotTime.setMinutes(30, 0, 0);
          } else if (minutes > 30) {
            slotTime.setHours(slotTime.getHours() + 1, 0, 0, 0);
          }
        }
      }

      let slots = [];
      while (slotTime <= end) {
        slots.push({
          time: slotTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          datetime: new Date(slotTime),
        });
        slotTime.setMinutes(slotTime.getMinutes() + 30);
      }

      weekSlots.push({ date: currDate, slots });
    }

    setBarberSlots(weekSlots);
  };
  // ek functionallty add karna hai book slot ka jo book ho chuka hai wo disable ho jaye
  // but wo dikhe usme redis bullmq use kargnge for solt locking
   /*
   let day = currDate.getDate();
    let month = currDate.getMonth() + 1;
    let year = currDate.getFullYear();
    const slotDate = day + "-" + month + "-" + year;
   const slotTime = selectedSlot.time;  
    const isSlotAvailable = barberInfo.slots_booked[slotDate] && barberInfo.slots_booked[slotDate].includes(slotTime)? false : true;
      
  */
 const bookSlot = async () => {
  if (!token){
    toast.warn("Please login to book a slot");
    navigate("/login");
    scrollTo(0, 0);
    return;
  }

  if (!selectedService) {
    toast.warn("Please select a service first");
    return;
  }

  try {
    const date = selectedSlot.datetime;  // use selected slot
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = day + "-" + month + "-" + year;

    // book-slot API call me user ke input ke sath selected paymentMethod bhi send kiya
    const { data } = await axios.post(
      backendURL + "/api/user/book-slot",
      {
        userId: userData._id,
        barberId,
        slotDate,
        slotTime: selectedSlot.time,
        serviceId: selectedService._id,
        serviceName: selectedService.name,
        paymentMethod
      },
      { headers: { token } }
    );

    if (data.success) {
      toast.success(data.message);
      getBarbersData();
      
      //  Agar stripe checkout link response me aayi hai toh user ko uspar redirect kiya
      if (data.session_url) {
        window.location.href = data.session_url;
      } else {
        navigate("/my-bookings");
        scrollTo(0, 0);
      }
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};


  useEffect(() => {
    generateSlots();
    setDayIndex(0);
    setSelectedSlot(null);
  }, [barberId]);

  const getFormattedSelectedDate = () => {
    if (!selectedSlot) return "Not selected";
    const date = selectedSlot.datetime;
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <section className="pt-6 pb-24 px-4 max-w-6xl mx-auto text-white space-y-8 animate-fadeIn">
      {!barber ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-gray-400 text-lg">Barber not found</p>
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-pink-500 rounded-full text-sm font-semibold cursor-pointer">
            Go Home
          </button>
        </div>
      ) : (
        <>
          {/* Header Bar */}
          <div className="flex items-center justify-between bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-6 py-4 shadow-md">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-1.5 border border-white/20 hover:border-pink-500/50 hover:bg-pink-500/10 text-white rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Back
            </button>
            <h1 className="text-xl font-bold tracking-wide text-white">Barber Profile</h1>
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-sm font-extrabold shadow-sm">
              <span>★</span>
              <span>{barber.rating || "4.5"}</span>
            </div>
          </div>

          {/* Profile Card (Top Card) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Image and Stats */}
              <div className="flex flex-col items-center gap-6 lg:w-1/3 flex-shrink-0">
                <div className="relative group">
                  {/* Glowing Halos */}
                  <div className="absolute inset-0 bg-pink-500/25 blur-3xl rounded-full scale-90 -z-10 group-hover:bg-pink-500/35 transition-all duration-500"></div>
                  <img
                    src={barberImages[barber.image] || barber.image}
                    alt={barber.name}
                    className="w-52 h-52 rounded-full object-cover border-4 border-pink-500/20 shadow-2xl relative z-10 hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>

                {/* 3 Widgets Grid */}
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm">
                  {/* Stat 1 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center shadow-inner hover:bg-white/10 hover:border-pink-500/20 transition-all duration-300">
                    <svg className="w-5 h-5 mx-auto text-pink-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <p className="text-base font-extrabold text-white">{barber.rating || "4.5"}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Rating</p>
                  </div>
                  {/* Stat 2 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center shadow-inner hover:bg-white/10 hover:border-pink-500/20 transition-all duration-300">
                    <svg className="w-5 h-5 mx-auto text-pink-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <p className="text-base font-extrabold text-white">{barber.experience || "3 Years"}</p>
                    <p className="text-[10px] text-gray-400 font-medium">Experience</p>
                  </div>
                  {/* Stat 3 */}
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-3 text-center shadow-inner hover:bg-white/10 hover:border-pink-500/20 transition-all duration-300">
                    <svg className="w-5 h-5 mx-auto text-pink-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <p className="text-base font-extrabold text-white">150+</p>
                    <p className="text-[10px] text-gray-400 font-medium">Clients</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Profile Info & Grid Box */}
              <div className="flex-grow flex flex-col justify-between space-y-6 lg:w-2/3">
                <div className="space-y-4">
                  {/* Name and Designation */}
                  <div>
                    <h2 className="text-3xl font-extrabold text-white tracking-wide">{barber.name}</h2>
                    <span className="inline-flex items-center gap-1.5 bg-pink-500/20 border border-pink-500/30 text-pink-400 text-xs font-bold px-3 py-1 rounded-full mt-2 shadow-sm">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path>
                      </svg>
                      Master Stylist
                    </span>
                  </div>

                  {/* 4 Info Boxes Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Box 1: Specialties */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-pink-500/10 transition-all duration-300">
                      <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7a3 3 0 11-6 0 3 3 0 016 0zm-3 12a3 3 0 100-6 3 3 0 000 6z"></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Expertise</p>
                        <p className="text-sm font-bold text-white truncate">
                          {Array.isArray(barber.services) ? barber.services.map(s => s.name).slice(0, 2).join(", ") : barber.services}
                        </p>
                      </div>
                    </div>

                    {/* Box 2: Location */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-pink-500/10 transition-all duration-300">
                      <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Location</p>
                        <p className="text-sm font-bold text-white truncate">
                          {barber.address.line2 || barber.address.line1}
                        </p>
                      </div>
                    </div>

                    {/* Box 3: Fee */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-pink-500/10 transition-all duration-300">
                      <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Service Fee</p>
                        <p className="text-sm font-extrabold text-pink-400">
                          ₹{selectedService ? selectedService.price : barber.fees}
                        </p>
                      </div>
                    </div>

                    {/* Box 4: Availability */}
                    <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 hover:border-pink-500/10 transition-all duration-300">
                      <div className="p-3 bg-pink-500/10 rounded-xl text-pink-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Status</p>
                        <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full ${
                          barber.available 
                            ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}>
                          {barber.available ? "Available" : "Busy"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* About Section Box */}
                <div className="bg-white/5 border border-white/5 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4.5 h-4.5 text-pink-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h4 className="text-sm font-bold text-white tracking-wide">About Barber</h4>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed font-light">{barber.about}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking / Appointment Section (Bottom Card) */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            {/* Title */}
            <div className="flex items-center gap-2 mb-8 border-b border-white/5 pb-4">
              <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <h3 className="text-xl font-bold tracking-tight text-white">Book Your Appointment</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Selection Details (Date, Service, Time) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Select Date */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Select Date</h4>
                  </div>
                  {/* Date Pills */}
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
                    {barberSlots.map((day, index) => {
                      let dayName = daysOfWeek[day.date.getDay()];
                      let dateNum = day.date.getDate();
                      let monthName = day.date.toLocaleString('default', { month: 'short' });
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            setDayIndex(index);
                            setSelectedSlot(null);
                          }}
                          className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl border transition-all duration-300 flex-shrink-0 cursor-pointer
                            ${
                              dayIndex === index
                                ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/20 scale-105"
                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                            }`}
                        >
                          <span className="text-[10px] uppercase font-semibold opacity-80">{dayName}</span>
                          <span className="text-lg font-extrabold my-0.5">{dateNum}</span>
                          <span className="text-[10px] uppercase font-semibold opacity-80">{monthName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Select Service */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7a3 3 0 11-6 0 3 3 0 016 0zm-3 12a3 3 0 100-6 3 3 0 000 6z"></path>
                    </svg>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Select Service</h4>
                  </div>
                  {/* Service Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(barber.services) && barber.services.length > 0 ? (
                      barber.services.map((service) => (
                        <button
                          key={service._id}
                          onClick={() => setSelectedService(service)}
                          className={`group flex flex-col p-4 rounded-2xl border text-left transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                            selectedService?._id === service._id
                              ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400 shadow-lg shadow-pink-500/20"
                              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <span className="font-bold text-base transition-colors">{service.name}</span>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                              selectedService?._id === service._id
                                ? "bg-white/20 text-white"
                                : "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                            }`}>
                              ₹{service.price || 0}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] mt-1.5 opacity-80">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>{service.duration || 30} mins</span>
                          </div>

                          <p className={`text-xs mt-2 line-clamp-2 leading-relaxed font-light ${
                            selectedService?._id === service._id ? "text-white/90" : "text-gray-400"
                          }`}>
                            {service.description}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No services listed for this barber.</p>
                    )}
                  </div>
                </div>

                {/* 3. Available Time Slots */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">Available Time Slots</h4>
                  </div>
                  {/* Time slots pills */}
                  <div className="flex flex-wrap gap-2.5">
                    {barberSlots[dayIndex]?.slots.length > 0 ? (
                      barberSlots[dayIndex]?.slots.map((slot, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 cursor-pointer
                            ${
                              selectedSlot?.time === slot.time
                                ? "bg-pink-500 text-white border-pink-500 shadow-md shadow-pink-500/10 scale-105"
                                : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                            }`}
                        >
                          {slot.time}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic py-2">No time slots available for this date.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Summary & Confirmation Card */}
              <div className="lg:col-span-5">
                <div className="bg-pink-500/5 border border-pink-500/10 rounded-2xl p-6 space-y-6 shadow-inner sticky top-24">
                  <h4 className="text-lg font-bold text-white border-b border-pink-500/10 pb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                    </svg>
                    Booking Summary
                  </h4>

                  {/* Details rows */}
                  <div className="space-y-4 text-sm">
                    {/* Barber */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 font-medium">Selected Barber</span>
                      <span className="text-white font-bold">{barber.name}</span>
                    </div>

                    {/* Specialty / Service */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 font-medium">Service</span>
                      <span className={`font-semibold ${selectedService ? "text-white" : "text-gray-500 italic text-xs"}`}>
                        {selectedService ? selectedService.name : "Not selected"}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 font-medium">Selected Date</span>
                      <span className={`font-semibold ${selectedSlot ? "text-white" : "text-gray-500 italic text-xs"}`}>
                        {getFormattedSelectedDate()}
                      </span>
                    </div>

                    {/* Time */}
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-gray-400 font-medium">Selected Time</span>
                      <span className={`font-semibold ${selectedSlot ? "text-white" : "text-gray-500 italic text-xs"}`}>
                        {selectedSlot ? selectedSlot.time : "Not selected"}
                      </span>
                    </div>

                    {/* Consultation Fee */}
                    <div className="flex justify-between items-center gap-4 border-t border-pink-500/10 pt-4">
                      <span className="text-gray-400 font-bold">Total Price</span>
                      <span className="text-xl font-extrabold text-pink-400">
                        ₹{selectedService ? selectedService.price : barber.fees}
                      </span>
                    </div>
                  </div>

                  {/* Hindi Comment: Payment mode select karne ke liye input toggle group (Cash vs Online) */}
                  <div className="flex items-center justify-between border-t border-pink-500/10 pt-4 text-sm">
                    <span className="text-gray-400 font-medium">Payment Mode</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPaymentMethod("Cash")}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "Cash"
                            ? "bg-emerald-600/20 text-emerald-400 border-emerald-500/40"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setPaymentMethod("Stripe")}
                        type="button"
                        className={`px-3 py-1 rounded-full border text-xs font-bold transition-all cursor-pointer ${
                          paymentMethod === "Stripe"
                            ? "bg-pink-500/20 text-pink-400 border-pink-500/40"
                            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                        }`}
                      >
                        Online
                      </button>
                    </div>
                  </div>

                  {/* Confirmation Button */}
                  <button
                    onClick={bookSlot}
                    disabled={!selectedSlot || !selectedService}
                    className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer
                      ${
                        selectedSlot && selectedService
                          ? "bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white shadow-pink-500/10 hover:shadow-pink-500/25 active:scale-[0.99]"
                          : "bg-white/5 border border-white/5 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    {!selectedService
                      ? "Select Service First"
                      : !selectedSlot
                      ? "Select Slot First"
                      : "Confirm Booking"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Related Barbers */}
          {relatedBarbers.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-white">Other Styling Experts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedBarbers.map((rel) => (
                  <div
                    key={rel._id}
                    onClick={() => {
                      navigate(`/booking/${rel._id}`);
                      scrollTo(0, 0);
                    }}
                    className="group cursor-pointer bg-white/5 border border-white/10 p-4 rounded-2xl hover:border-pink-500/30 transition-all duration-300 text-center hover:shadow-lg hover:shadow-pink-500/5 hover:scale-[1.02]"
                  >
                    <div className="relative rounded-xl overflow-hidden mb-3">
                      <img
                        src={barberImages[rel.image] || rel.image}
                        alt={rel.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <h4 className="font-bold text-white group-hover:text-pink-400 transition-colors">{rel.name}</h4>
                    <p className="text-xs text-gray-400 mt-1 font-light">{rel.experience} Exp</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default Booking;
