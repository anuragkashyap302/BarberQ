import React, { useContext, useEffect, useState } from "react";
import { assets, barberImages } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { BarberContext } from "../../context/BarberContext";
import { 
  User, 
  Mail, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  AlignLeft, 
  Globe, 
  UploadCloud, 
  Edit3, 
  Check, 
  XCircle 
} from "lucide-react";

const BarberProfile = () => {
  const { profileData, setProfileData, bToken,  getProfileData } =
    useContext(BarberContext);
    const { backendURL } = useContext(BarberContext)

  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(false);

 const updateBarberProfileData = async () => {
  try {
    const payload = {
      name: profileData.name,
      experience: profileData.experience,
      fees: profileData.fees,
      about: profileData.about,
      address: profileData.address,
      available: profileData.available
    };

    const { data } = await axios.post(
      backendURL + "/api/barber/update-profile",
      payload,
      { headers: { bToken } }
    );

    if(data.success){
      toast.success(data.message);
      setIsEditing(false);
      getProfileData();
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message);
  }
};

   useEffect(() => {
    if (bToken) getProfileData(bToken);
  }, [bToken]);

  return (
    profileData && (
      <div className="flex-1 p-6 md:p-12 text-white flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-white">My <span className="text-pink-500">Profile</span></h2>
          <p className="text-gray-400 text-sm mt-2">Manage your consultation pricing, contact info, and availability details</p>
        </div>

        {/* Profile Card Container */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-10 shadow-2xl space-y-8 max-w-3xl w-full">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-white/10">
            <div className="relative group">
              {isEditing ? (
                <label htmlFor="image" className="cursor-pointer block relative w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500/40 hover:border-pink-500 transition shadow-lg">
                  {/*  Agar user naya image choose karta hai toh use ObjectURL ke sath show karenge, nahi toh database se loaded local key ya Cloudinary link retrieve karenge */}
                  <img
                    src={image ? URL.createObjectURL(image) : (barberImages[profileData.image] || profileData.image)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <UploadCloud size={20} className="text-pink-400" />
                    <span className="text-[10px] text-gray-300 font-medium">Change Photo</span>
                  </div>
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                  />
                </label>
              ) : (
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-500/40 shadow-lg">
                  <img
                    src={barberImages[profileData.image] || profileData.image}
                    alt="Barber"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <div className="text-center md:text-left space-y-2 flex-1">
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) =>
                      setProfileData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-2xl font-bold w-full"
                  />
                </div>
              ) : (
                <h2 className="text-3xl font-extrabold tracking-tight text-white">{profileData.name}</h2>
              )}
              <p className="text-gray-400 text-sm">{profileData.email}</p>
              <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                {Array.isArray(profileData.services) ? (
                  profileData.services.map((s) => (
                    <span key={s._id} className="inline-block px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
                      {s.name}
                    </span>
                  ))
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-semibold">
                    {profileData.services}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
              <AlignLeft size={16} className="text-pink-400" />
              About Me
            </h3>
            {isEditing ? (
              <textarea
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, about: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed text-sm bg-black/20 p-4 rounded-xl border border-white/5">
                {profileData.about}
              </p>
            )}
          </div>

          {/* Detail Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Briefcase size={16} className="text-pink-400" />
                Experience
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-black/20 border border-white/5 font-medium">
                  {profileData.experience}
                </div>
              )}
            </div>

            {/* Fees */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                <DollarSign size={16} className="text-pink-400" />
                Consultation Fee (₹)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                />
              ) : (
                <div className="px-4 py-3 rounded-xl bg-black/20 border border-white/5 font-medium text-pink-400 text-lg">
                  ₹{profileData.fees}
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                <MapPin size={16} className="text-pink-400" />
                Workplace Address
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profileData.address.line1 || ""}
                    onChange={(e) =>
                      setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line1: e.target.value }
                      }))
                    }
                    placeholder="Street / Shop Details"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                  />
                  <input
                    type="text"
                    value={profileData.address.line2 || ""}
                    onChange={(e) =>
                      setProfileData(prev => ({
                        ...prev,
                        address: { ...prev.address, line2: e.target.value }
                      }))
                    }
                    placeholder="City / Region"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                  />
                </div>
              ) : (
                <div className="px-4 py-3 rounded-xl bg-black/20 border border-white/5 text-gray-300 leading-relaxed text-sm">
                  {profileData.address?.line1}
                  {profileData.address?.line2 && <>, {profileData.address.line2}</>}
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center gap-1.5 uppercase tracking-wider">
                <Globe size={16} className="text-pink-400" />
                Booking Status
              </label>
              {isEditing ? (
                <select
                  value={profileData.available}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      available: e.target.value === "true",
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 outline-none text-gray-100 transition"
                >
                  <option value="true" className="bg-[#0f172a] text-white">Available for Booking</option>
                  <option value="false" className="bg-[#0f172a] text-white">Not Available</option>
                </select>
              ) : (
                <div className="flex items-center">
                  <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${
                    profileData.available 
                      ? "bg-green-500/10 border-green-500/20 text-green-400" 
                      : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${profileData.available ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                    {profileData.available ? "Available" : "Not Available"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition text-white font-medium text-sm flex items-center gap-2 cursor-pointer"
                >
                  <XCircle size={16} />
                  Cancel
                </button>
                <button
                  onClick={updateBarberProfileData}
                  className="px-6 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 transition text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-green-500/20 cursor-pointer"
                >
                  <Check size={16} />
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 transition text-white font-semibold text-sm flex items-center gap-2 shadow-lg hover:shadow-pink-500/20 cursor-pointer hover:-translate-y-0.5"
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default BarberProfile;
