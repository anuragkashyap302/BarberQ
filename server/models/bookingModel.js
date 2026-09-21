import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId: {type: String , required: true},
    barberId: {type: String , required: true},
    slotDate: {type: String , required: true},
    slotTime: {type: String , required: true},
    userData : {type: Object , required: true},
    barberData: {type: Object , required: true},
    serviceId: {type: String},
    serviceName: {type: String},
    amount: {type: Number , required: true},
    date: {type: Number , required: true},
    cancelled: {type: Boolean , default: false},
    payment: {type: Boolean , default: false},
    isCompleted: {type: Boolean , default: false},
    // Yeh store karega ki user ne payment Cash se kiya hai ya Online (Stripe) se
    paymentMethod: {type: String, default: "Cash"},
    stripeSessionId: {type: String}
});
// Database indexing: Frequent queries ko fast karne ke liye indexes define kiye
// 1. Barber ke specific date ke slots lookup karne ke liye compound index
bookingSchema.index({ barberId: 1, slotDate: 1 });

// 2. User ke booking history ko date-wise sort karke fast lane ke liye index
bookingSchema.index({ userId: 1, date: -1 });

// 3. Queue calculation aur dashboard stats ke liye compound index
bookingSchema.index({ barberId: 1, isCompleted: 1, cancelled: 1 });

const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);
export default bookingModel;