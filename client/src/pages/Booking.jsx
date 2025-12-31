import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const Booking = () => {
  const { barberId } = useParams();
  const navigate = useNavigate();
  const { barbers, backendURL, token, getBarbersData,userData } =
    useContext(AppContext);

  const [barberSlots, setBarberSlots] = useState([]);
  const [dayIndex, setDayIndex] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const barber = barbers.find((b) => b._id === barberId);

  // ✅ Category check (only 3 allowed services)
  const allowedCategories = [
    "Haircut & Styling",
    "Beard Grooming",
    "Facial & Spa",
  ];

  const barberCategory = allowedCategories.includes(barber?.speciality)
    ? barber.speciality
    : null;

  // ✅ Related barbers
  const relatedBarbers = barberCategory
    ? barbers.filter(
        (b) => b._id !== barberId && b.speciality === barberCategory
      )
    : [];

  // ✅ Generate slots for next 7 days
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

  try {
    const date = selectedSlot.datetime;  // use selected slot
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    const slotDate = day + "-" + month + "-" + year;

    const { data } = await axios.post(
  backendURL + "/api/user/book-slot",
  {
    userId: userData._id,        // add this
    barberId,
    slotDate,
    slotTime: selectedSlot.time
  },
  { headers: { token } }
);


    if (data.success) {
      toast.success(data.message);
      getBarbersData();
      navigate("/my-bookings");
      scrollTo(0, 0);
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

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-white">
      {!barber ? (
        <p className="text-center text-gray-400">Barber not found</p>
      ) : (
        <>
          {/* Main Barber */}
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <img
              src={barber.image}
              alt={barber.name}
              className="w-64 h-64 object-cover rounded-lg"
            />
            <div>
              <h2 className="text-3xl font-bold">{barber.name}</h2>
              <p className="text-pink-400">{barber.speciality}</p>
              <p className="text-gray-400">{barber.experience}</p>
              <p className="mt-4">{barber.about}</p>
              <p className="mt-3 font-bold text-pink-500">₹{barber.fees}</p>
            </div>
          </div>

          {/* Booking Slots */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Booking slots</h3>

            {/* Days */}
            <div className="flex gap-3 mb-6 overflow-x-auto">
              {barberSlots.map((day, index) => {
                let dayName = daysOfWeek[day.date.getDay()];
                let dateNum = day.date.getDate();
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setDayIndex(index);
                      setSelectedSlot(null);
                    }}
                    className={`flex flex-col items-center px-4 py-3 rounded-full border 
                      ${
                        dayIndex === index
                          ? "bg-pink-500 text-white border-pink-500"
                          : "bg-gray-900 border-gray-700 text-gray-300"
                      }`}
                  >
                    <span className="font-bold">{dayName}</span>
                    <span>{dateNum}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Slots */}
            <div className="flex flex-wrap gap-3 mb-6">
              {barberSlots[dayIndex]?.slots.map((slot, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-full border 
                    ${
                      selectedSlot?.time === slot.time
                        ? "bg-pink-500 text-white border-pink-500"
                        : "bg-gray-900 border-gray-700 text-gray-300"
                    }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>

            {/* Book Button */}
            <button
              onClick={bookSlot}
              disabled={!selectedSlot}
              className={`w-full py-5 rounded-full font-semibold transition 
                ${
                  selectedSlot
                    ? "bg-pink-500 hover:bg-pink-600 text-white"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
            >
              {selectedSlot ? "Book Appointment" : "Select a slot to book"}
            </button>
          </div>

          {/* Related Barbers */}
          {relatedBarbers.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-semibold mb-4">
                Other {barberCategory} Experts
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedBarbers.map((rel) => (
                  <div
                    key={rel._id}
                    onClick={() => {
                      navigate(`/booking/${rel._id}`);
                      scrollTo(0, 0);
                    }}
                    className="cursor-pointer bg-gray-800 p-4 rounded-lg text-center hover:shadow-pink-500/20 transition"
                  >
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="w-full h-40 object-cover rounded-lg mb-2"
                    />
                    <h4 className="text-lg font-semibold">{rel.name}</h4>
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
