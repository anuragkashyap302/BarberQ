import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
const AddBarber = () => {
  const [barberImg, setBarberImg] = useState(null);
  const [barberName, setBarberName] = useState("");
  const [barberEmail, setBarberEmail] = useState("");
  const [barberPassword, setBarberPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [services, setServices] = useState("Haircut & Styling");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");

  const {backendURL , aToken} = useContext(AdminContext);

  // ✅ Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
   if(!barberImg){
    return toast.error("Please upload barber image")
   }
   try {
      const formData = new FormData();
    formData.append("image", barberImg);
    formData.append("name", barberName);
    formData.append("email", barberEmail);
    formData.append("password", barberPassword);
    formData.append("experience", experience);
    formData.append("fees", Number(fees));
    formData.append("services", services);
    formData.append("address", JSON.stringify({line1:address1, line2:address2}));
    formData.append("about", about);

   formData.forEach((value, key) => {
    console.log(`${key}: ${value}`);
   })

   const {data} = await axios.post(backendURL + '/api/admin/add-barber', formData, {
    headers: {
        aToken
    }
   })
    if(data.success){
        toast.success(data.message)
        setBarberImg(false);
       setBarberName("");
       setBarberEmail("");
      setBarberPassword("");
     setExperience("1 Year");
      setFees("");
    setServices("Haircut & Styling");
    setAddress1("");
    setAddress2("");
    setAbout("");
    }
    else{
        toast.error(data.message)
    }

    
   } catch (error) {
     toast.error("Error adding barber: " + error.message);
      console.log(error);
   }

    // Reset form after submission
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto bg-white/10 backdrop-blur-lg p-6 md:p-10 rounded-3xl shadow-2xl border border-white/20 mt-6 md:mt-10 overflow-y-auto max-h-[90vh]"
    >
      {/* Title */}
      <p className="text-3xl md:text-4xl font-extrabold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-yellow-400 bg-clip-text text-transparent mb-8 tracking-wide">
        ✨ Add Barber ✨
      </p>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="flex justify-center">
          <label
            htmlFor="barber-img"
            className="cursor-pointer flex flex-col items-center gap-3 border-2 border-dashed border-gray-500 rounded-2xl p-6 w-52 h-52 hover:border-pink-400 transition bg-black/20"
          >
            {barberImg ? (
              <img
                src={URL.createObjectURL(barberImg)}
                alt="Barber Preview"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <img
                  src={assets.upload_area}
                  alt="Upload Icon"
                  className="w-20 h-20 opacity-70"
                />
                <p className="text-gray-300 text-center text-sm font-light">
                  Upload Barber <br /> Picture
                </p>
              </>
            )}
          </label>
          <input
            onChange={(e) => setBarberImg(e.target.files[0])}
            type="file"
            id="barber-img"
            hidden
            accept="image/*"
          />
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-1">Barber Name</label>
            <input
              onChange={(e) => setBarberName(e.target.value)}
              value={barberName}
              type="text"
              placeholder="Name"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Email</label>
            <input
              onChange={(e) => setBarberEmail(e.target.value)}
              value={barberEmail}
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Password</label>
            <input
              onChange={(e) => setBarberPassword(e.target.value)}
              value={barberPassword}
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Experience</label>
            <select
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`${i + 1} Year`} className="bg-[#0f172a]">
                  {i + 1} Year
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 mb-1">Fees</label>
            <input
              onChange={(e) => setFees(e.target.value)}
              value={fees}
              type="number"
              placeholder="Fees"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-300 mb-1">Services</label>
            <select
              onChange={(e) => setServices(e.target.value)}
              value={services}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option className="bg-[#0f172a]" value="Haircut & Styling">
                Haircut & Styling
              </option>
              <option className="bg-[#0f172a]" value="Beard Grooming">
                Beard Grooming
              </option>
              <option className="bg-[#0f172a]" value="Facial & Spa">
                Facial & Spa
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-gray-300 mb-1">Address</label>
            <input
              onChange={(e) => setAddress1(e.target.value)}
              value={address1}
              type="text"
              placeholder="Address 1"
              required
              className="w-full mb-2 px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <input
              onChange={(e) => setAddress2(e.target.value)}
              value={address2}
              type="text"
              placeholder="Address 2"
              required
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* About */}
      <div className="mt-6">
        <label className="block text-gray-300 mb-1">About Barber</label>
        <textarea
          onChange={(e) => setAbout(e.target.value)}
          value={about}
          placeholder="Write about barber..."
          rows={4}
          required
          className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-8 w-full py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold tracking-wide text-lg shadow-lg hover:scale-[1.03] active:scale-95 transition-transform cursor-pointer"
      >
        ➕ Add Barber
      </button>
    </form>
  );
};

export default AddBarber;
