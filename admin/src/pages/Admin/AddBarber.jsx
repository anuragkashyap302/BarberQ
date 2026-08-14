import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";
import { 
  User, 
  Mail, 
  Lock, 
  Briefcase, 
  DollarSign, 
  Scissors, 
  MapPin, 
  AlignLeft, 
  Upload, 
  UserPlus 
} from "lucide-react";

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

  };

  return (
    <div className="p-6 text-white w-full max-w-3xl mx-auto space-y-6">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Add <span className="text-pink-500">Barber</span></h2>
        <p className="text-gray-400 text-sm mt-2">Register a new grooming professional to the active roster</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 shadow-2xl space-y-8"
      >
        {/* Upload Section (Centered) */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <p className="text-sm font-semibold text-gray-300">Barber Photo</p>
          <label
            htmlFor="barber-img"
            className="cursor-pointer group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-600 hover:border-pink-500 rounded-full w-36 h-36 overflow-hidden transition-all bg-black/40 shadow-inner"
          >
            {barberImg ? (
              <img
                src={URL.createObjectURL(barberImg)}
                alt="Barber Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-center p-4">
                <Upload size={28} className="text-gray-400 group-hover:text-pink-400 group-hover:scale-110 transition duration-300 mb-1" />
                <span className="text-xs text-gray-400 font-light group-hover:text-pink-300">Click to upload</span>
              </div>
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

        {/* Input Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Barber Name */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <User size={16} className="text-pink-400" />
              Full Name
            </label>
            <input
              onChange={(e) => setBarberName(e.target.value)}
              value={barberName}
              type="text"
              placeholder="e.g. John Doe"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Mail size={16} className="text-pink-400" />
              Email Address
            </label>
            <input
              onChange={(e) => setBarberEmail(e.target.value)}
              value={barberEmail}
              type="email"
              placeholder="john.doe@example.com"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Lock size={16} className="text-pink-400" />
              Password
            </label>
            <input
              onChange={(e) => setBarberPassword(e.target.value)}
              value={barberPassword}
              type="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
            />
          </div>

          {/* Experience */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Briefcase size={16} className="text-pink-400" />
              Experience
            </label>
            <select
              onChange={(e) => setExperience(e.target.value)}
              value={experience}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 transition"
            >
              {[...Array(10)].map((_, i) => (
                <option key={i} value={`${i + 1} Year`} className="bg-[#0f172a] text-white">
                  {i + 1} {i === 0 ? "Year" : "Years"}
                </option>
              ))}
            </select>
          </div>

          {/* Fees */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <DollarSign size={16} className="text-pink-400" />
              Consultation Fees (₹)
            </label>
            <input
              onChange={(e) => setFees(e.target.value)}
              value={fees}
              type="number"
              placeholder="e.g. 500"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
            />
          </div>

          {/* Services Selection */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Scissors size={16} className="text-pink-400" />
              Offered Service
            </label>
            <select
              onChange={(e) => setServices(e.target.value)}
              value={services}
              className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 transition"
            >
              <option className="bg-[#0f172a] text-white" value="Haircut & Styling">Haircut & Styling</option>
              <option className="bg-[#0f172a] text-white" value="Beard Grooming">Beard Grooming</option>
              <option className="bg-[#0f172a] text-white" value="Facial & Spa">Facial & Spa</option>
            </select>
          </div>

          {/* Address details (full width) */}
          <div className="md:col-span-2 relative">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
              <MapPin size={16} className="text-pink-400" />
              Shop Address Details
            </label>
            <div className="space-y-3">
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                type="text"
                placeholder="Address Line 1 (Street, Building)"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                type="text"
                placeholder="Address Line 2 (City, Area Code)"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
            <AlignLeft size={16} className="text-pink-400" />
            Professional Profile / About
          </label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            placeholder="Brief description about the barber's training, background, and expertise..."
            rows={4}
            required
            className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold tracking-wide text-lg shadow-lg hover:shadow-pink-500/20 hover:-translate-y-0.5 active:scale-98 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
        >
          <UserPlus size={20} />
          Add Barber
        </button>
      </form>
    </div>
  );
};

export default AddBarber;
