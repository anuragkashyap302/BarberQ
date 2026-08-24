// Barber.jsx
import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Barber = () => {
  const { speciality } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { barbers, services } = useContext(AppContext);

  // Dynamic side category listing
  const mainCategories = ["All", ...(services || []).map(s => s.name)];

  const [selectedSpeciality, setSelectedSpeciality] = useState(
    speciality ? decodeURIComponent(speciality) : searchParams.get("service") || "All"
  );
  const searchCity = searchParams.get("city") || "";

  // ✅ Update state when URL params change
  useEffect(() => {
    if (searchParams.get("service")) {
      setSelectedSpeciality(searchParams.get("service"));
    } else {
      setSelectedSpeciality(speciality ? decodeURIComponent(speciality) : "All");
    }
  }, [speciality, searchParams]);

  // ✅ Filter by both city and speciality checking services array
  const filteredBarbers = barbers.filter((barber) => {
    const matchesCity = !searchCity || barber.address?.line2?.toLowerCase().includes(searchCity.toLowerCase());
    const matchesService = selectedSpeciality === "All" || (
      Array.isArray(barber.services)
        ? barber.services.some(s => s.name === selectedSpeciality)
        : barber.services === selectedSpeciality
    );
    return matchesCity && matchesService;
  });


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
          <h3 className="text-lg font-semibold text-gray-200 mb-3">
            Browse Speciality
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
                  const url = selectedSpeciality !== "All"
                    ? `/booking/${barber._id}?service=${encodeURIComponent(selectedSpeciality)}`
                    : `/booking/${barber._id}`;
                  navigate(url);
                  window.scrollTo(0, 0);
                }}
                className="bg-gray-800/80 backdrop-blur-md border border-gray-700 rounded-xl p-6 text-center hover:shadow-pink-500/20 hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <img
                  src={barber.image}
                  alt={barber.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="text-xl font-semibold">{barber.name}</h3>
                <p className="text-pink-400 text-sm h-6 overflow-hidden mt-1">
                  {Array.isArray(barber.services) 
                    ? barber.services.map(s => s.name).join(", ") 
                    : barber.services}
                </p>
                <p className="text-gray-400 text-sm mt-1">{barber.experience}</p>
                <p className="text-gray-300 text-sm mt-2 line-clamp-2 h-10">{barber.about}</p>
                <p className="mt-3 font-bold text-pink-500">₹{barber.fees}</p>
                <p className="text-gray-400 text-xs mt-2 truncate">
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
