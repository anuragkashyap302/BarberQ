import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const BarberList = () => {
  const { barbers, aToken, getAllBarbers, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllBarbers(aToken);
    }
  }, [aToken]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Barbers</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {barbers.map((item, index) => (
          <div
            key={index}
            className="bg-[#1e293b]/70 backdrop-blur-md rounded-2xl shadow-lg p-6 transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-52 object-cover rounded-xl mb-4"
            />
            <div>
              <p className="text-xl font-semibold mb-1">{item.name}</p>
              <p className="text-sm text-gray-300 mb-4">{item.services}</p>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.available}
                  onChange={() => changeAvailability(item._id, aToken)}
                  className="w-5 h-5 accent-green-500"
                />
                <span className="text-sm">
                  {item.available ? "Available" : "Not Available"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarberList;
