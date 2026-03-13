import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { BarberContext } from "../../context/BarberContext";


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
      <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#2c1b1b] flex items-center justify-center px-4 py-10 mt-10 text-white">
        <div className="bg-gray-800 w-full max-w-4xl rounded-2xl shadow-xl p-8">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            {isEditing ? (
              <label htmlFor="image">
                <div className="inline-block relative cursor-pointer">
                  <img
                    src={
                      image ? URL.createObjectURL(image) : profileData.image
                    }
                    alt=""
                    className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 shadow-lg"
                  />
                </div>
                <input
                  onChange={(e) => setImage(e.target.files[0])}
                  type="file"
                  id="image"
                  hidden
                />
              </label>
            ) : (
              <img
                src={profileData.image}
                alt="Barber"
                className="w-36 h-36 rounded-full object-cover border-4 border-pink-500 shadow-lg"
              />
            )}
            <div className="text-center md:text-left space-y-2">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none text-2xl font-bold w-full"
                />
              ) : (
                <h2 className="text-3xl font-bold">{profileData.name}</h2>
              )}
              <p className="text-gray-400">{profileData.email}</p>
              <p className="text-pink-400 font-medium">
                {profileData.services}
              </p>
            </div>
          </div>

          <hr className="border-gray-700 mb-6" />

          {/* About */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-3 text-pink-400">About</h3>
            {isEditing ? (
              <textarea
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, about: e.target.value }))
                }
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
              />
            ) : (
              <p className="text-gray-300 leading-relaxed">
                {profileData.about}
              </p>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Experience */}
            <div>
              <p className="text-gray-400 text-sm">Experience</p>
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
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              ) : (
                <p className="font-medium">{profileData.experience}</p>
              )}
            </div>

            {/* Fees */}
            <div>
              <p className="text-gray-400 text-sm">Service Fee</p>
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
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              ) : (
                <p className="font-medium">₹{profileData.fees}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <p className="text-gray-400 text-sm">Address</p>
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
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
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
                    className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                  />
                </div>
              ) : (
                <p className="font-medium">
                  {profileData.address?.line1}
                  <br />
                  {profileData.address?.line2}
                </p>
              )}
            </div>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <p className="text-gray-400 text-sm">Availability</p>
            {isEditing ? (
              <select
                value={profileData.available}
                onChange={(e) =>
                  setProfileData((prev) => ({
                    ...prev,
                    available: e.target.value === "true",
                  }))
                }
                className="w-full md:w-1/2 px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
              >
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            ) : (
              <p
                className={`font-semibold ${
                  profileData.available ? "text-green-400" : "text-red-400"
                }`}
              >
                {profileData.available ? "Available" : "Not Available"}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={updateBarberProfileData}
                  className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white font-semibold"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 transition text-white font-semibold"
              >
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
