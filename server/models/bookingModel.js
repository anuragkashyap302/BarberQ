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
    // Stripe checkout session ID ko verify karne ke liye yahan save karenge
    stripeSessionId: {type: String}
});
const bookingModel = mongoose.models.booking || mongoose.model('booking', bookingSchema);
export default bookingModel;