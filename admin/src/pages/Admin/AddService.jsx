import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "../../context/AdminContext";
import { PlusCircle, Scissors, FileText, ClipboardList, DollarSign, Clock } from "lucide-react";

const AddService = () => {
  const { backendURL, aToken } = useContext(AdminContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  // Yeh function database se saare services fetch karne ke liye hai
  const fetchServices = async () => {
    try {
      const { data } = await axios.get(backendURL + "/api/barber/services");
      if (data.success) {
        setServices(data.services);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error fetching services: " + error.message);
    }
  };

  // Yeh function admin dwara naya service create/add karne ke liye hai
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || !price || !duration) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        backendURL + "/api/admin/add-service",
        { name, description, price: Number(price), duration: Number(duration) },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setName("");
        setDescription("");
        setPrice("");
        setDuration("");
        fetchServices();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding service: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [backendURL]);

  return (
    <div className="p-6 text-white w-full max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white">Manage <span className="text-pink-500">Services</span></h2>
        <p className="text-gray-400 text-sm mt-2">Create and view services available for barber selection</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Add Service Form */}
        <form
          onSubmit={handleAddService}
          className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl space-y-6 self-start"
        >
          <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-3">
            <PlusCircle size={20} className="text-pink-500" />
            Add New Service
          </h3>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Scissors size={16} className="text-pink-400" />
                Service Name
              </label>
              <input
                type="text"
                placeholder="e.g. Beard Grooming & Hot Towel"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
              />
            </div>

            {/* Price & Duration Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <DollarSign size={16} className="text-pink-400" />
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="300"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Clock size={16} className="text-pink-400" />
                  Duration (mins)
                </label>
                <input
                  type="number"
                  placeholder="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1.5 flex items-center gap-1.5">
                <FileText size={16} className="text-pink-400" />
                Description
              </label>
              <textarea
                placeholder="Describe the service details, duration, etc..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-black/30 border border-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none text-gray-100 placeholder-gray-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:bg-gray-700 text-white font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? "Adding..." : "Add Service"}
          </button>
        </form>

        {/* Existing Services List */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2 border-b border-white/10 pb-3">
            <ClipboardList size={20} className="text-pink-500" />
            Existing Services ({services.length})
          </h3>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {services.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No services registered yet.</p>
            ) : (
              services.map((service) => (
                <div
                  key={service._id}
                  className="bg-black/20 hover:bg-black/30 border border-white/5 hover:border-pink-500/20 rounded-xl p-4 transition duration-300"
                >
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-pink-400 text-base">{service.name}</h4>
                    <span className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-400 font-bold px-2 py-0.5 rounded">
                      ₹{service.price || 0}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <Clock size={12} /> {service.duration || 30} mins
                  </p>
                  <p className="text-gray-300 text-sm mt-2 leading-relaxed">{service.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddService;
