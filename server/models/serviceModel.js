import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    duration: { type: Number, required: true, default: 30 } // in minutes
});

const ServiceModel = mongoose.models.service || mongoose.model('service', serviceSchema);
export default ServiceModel;
