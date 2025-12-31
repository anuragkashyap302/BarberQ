import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const {userData,setUserData, token , backendURL , userProfileData} = useContext(AppContext)

  const [isEditing, setIsEditing] = useState(false);

  const [image , setImage] = useState(false)

  const updateUserProfileData = async()=>{
     try {
       const formData = new FormData();
        formData.append('name', userData.name);
        formData.append('phone', userData.phone);
        formData.append('address', JSON.stringify(userData.address));
        formData.append('gender', userData.gender);
        formData.append('dob', userData.dob);
        image && formData.append('image', image);
        const {data} = await axios.post(backendURL + '/api/user/update-profile' , formData , {headers:{token}})
        if(data.success){
           toast.success(data.message)
         await   userProfileData()
            setIsEditing(false)
            setImage(false)
        }else{
          toast.error(data.message)
        }
     } catch (error) {
        console.log(error)
        toast.error(error.message)
     }
  }

  return userData && (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-10 mt-10">
      <div className="bg-gray-800 w-full max-w-3xl rounded-2xl shadow-xl p-8 text-white">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
          {isEditing ? <label htmlFor="image">
             <div className=" inline-block relative cursor-pointer">
              <img src={image ? URL.createObjectURL(image) : userData.image} alt=""className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"  />
              <img src={image ? '': assets.upload_icon} alt="" className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"  />
             </div>
             <input onChange={(e) =>setImage(e.target.files[0])} type="file" id="image" hidden/>
          </label> :
          <img
            src={userData.image}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-pink-500 shadow-lg"
          />}
          <div className="text-center md:text-left">
            {isEditing ? (
              <input
                type="text"
                value={userData.name}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none text-xl font-semibold w-full"
              />
            ) : (
              <h2 className="text-3xl font-bold">{userData.name}</h2>
            )}
            <p className="text-gray-400 mt-1">{userData.email}</p>
          </div>
        </div>

        <hr className="border-gray-700 mb-6" />

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-pink-400">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Phone */}
            <div>
              <p className="text-gray-400 text-sm">Phone</p>
              {isEditing ? (
                <input
                  type="text"
                  value={userData.phone}
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              ) : (
                <p className="font-medium">{userData.phone}</p>
              )}
            </div>

            {/* Address */}
            {/* Address */}
<div>
  <p className="text-gray-400 text-sm">Address</p>
  {isEditing ? (
    <div className="space-y-2">
      <input
        onChange={(e) =>
          setUserData((prev) => ({
            ...prev,
            address: { ...prev.address, line1: e.target.value },
          }))
        }
        value={userData.address?.line1 || ""}
        type="text"
        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
      />
      <input
        onChange={(e) =>
          setUserData((prev) => ({
            ...prev,
            address: { ...prev.address, line2: e.target.value },
          }))
        }
        value={userData.address?.line2 || ""}
        type="text"
        className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
      />
    </div>
  ) : (
    <p className="font-medium">
      {userData.address?.line1}
      <br />
      {userData.address?.line2}
    </p>
  )}
</div>

          </div>
        </div>

        {/* Basic Info */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-pink-400">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender */}
            <div>
              <p className="text-gray-400 text-sm">Gender</p>
              {isEditing ? (
                <select
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, gender: e.target.value }))
                  }
                  value={userData.gender}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                <p className="font-medium">{userData.gender}</p>
              )}
            </div>

            {/* DOB */}
            <div>
              <p className="text-gray-400 text-sm">Date of Birth</p>
              {isEditing ? (
                <input
                  type="date"
                  onChange={(e) =>
                    setUserData((prev) => ({ ...prev, dob: e.target.value }))
                  }
                  value={userData.dob}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-pink-500 outline-none"
                />
              ) : (
                <p className="font-medium">{userData.dob}</p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end">
          {isEditing ? (
            <button
              onClick={updateUserProfileData}
              className="px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 transition text-white font-semibold"
            >
              Save Information
            </button>
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
  );
};

export default MyProfile;
