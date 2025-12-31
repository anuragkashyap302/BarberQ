import mongoose from "mongoose";

const barberSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String , required: true },
    services: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees : { type: Number, required: true },
    address: { type: Object, required: true },
    date :{ type : Number, required: true },
    slots_booked : { type : Object, default: {} },
    
 },{ minimize: false });

const BarberModel = mongoose.models.barber || mongoose.model('barber', barberSchema);
export default BarberModel;





// thora advanced schema for future use

// import mongoose from "mongoose";

// const barberSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   phone: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   email: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   experience: {
//     type: Number, // in years
//     default: 0
//   },
//   specialization: {
//     type: [String], // e.g. ["Fade", "Beard Trim", "Coloring"]
//     default: []
//   },
//   services: [
//     {
//       serviceName: { type: String, required: true },
//       price: { type: Number, required: true },
//       duration: { type: Number, required: true } // in minutes
//     }
//   ],
//   workingHours: {
//     start: { type: String, default: "09:00" }, // e.g. "09:00"
//     end: { type: String, default: "18:00" }
//   },
//   daysOff: {
//     type: [String], // e.g. ["Sunday"]
//     default: []
//   },
//   rating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },
//   isAvailable: {
//     type: Boolean,
//     default: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Barber = mongoose.model("Barber", barberSchema);

// export default Barber;
