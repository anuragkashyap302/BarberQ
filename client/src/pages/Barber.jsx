// Barber.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

// Sidebar main categories (only 3 + All)
const mainCategories = ["All", "Haircut & Styling", "Beard Grooming", "Facial & Spa"];

const Barber = () => {
  const { speciality } = useParams();
  const navigate = useNavigate();
  const { barbers } = useContext(AppContext);

  const [selectedSpeciality, setSelectedSpeciality] = useState(
    speciality ? decodeURIComponent(speciality) : "All"
  );

  // ✅ Update state when URL param changes
  useEffect(() => {
    setSelectedSpeciality(speciality ? decodeURIComponent(speciality) : "All");
  }, [speciality]);

  // ✅ Filter directly by barbers' speciality
// ✅ Filter directly by barber.services
const filteredBarbers =
  selectedSpeciality === "All"
    ? barbers
    : barbers.filter((barber) => barber.services === selectedSpeciality);


  // ✅ Sidebar click handler
  const handleCategoryClick = (category) => {
    navigate(category === "All" ? "/barbers" : `/barbers/${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">
        {selectedSpeciality} <span className="text-pink-500">Barbers</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200">
            Browse through the barber's speciality
          </h3>
          {mainCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategoryClick(cat)}
              className={`block w-full text-left px-4 py-2 rounded-md border ${
                selectedSpeciality === cat
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Barber Cards */}
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBarbers.length === 0 ? (
            <p className="col-span-full text-center text-gray-400">
              No barbers found.
            </p>
          ) : (
            filteredBarbers.map((barber) => (
              <div
                key={barber._id}
                onClick={() => {
                  navigate(`/booking/${barber._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center hover:shadow-pink-500/20 hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{barber.name}</h3>
                <p className="text-pink-400">{barber.speciality}</p>
                <p className="text-gray-400 text-sm">{barber.experience}</p>
                <p className="text-gray-300 text-sm mt-2">{barber.about}</p>
                <p className="mt-3 font-bold text-pink-500">₹{barber.fees}</p>
                <p className="text-gray-400 text-sm">
                  {barber.address.line1}, {barber.address.line2}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Barber;
