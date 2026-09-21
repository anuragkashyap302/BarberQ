import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    // Kisne message bheja (UserId ya BarberId)
    senderId: { type: String, required: true },
    
    // Kisko message bheja (UserId ya BarberId)
    receiverId: { type: String, required: true },
    
    // Yeh chat kis booking/appointment ke context me ho rahi hai
    bookingId: { type: String, required: true },
    
    // Message ka actual text content
    text: { type: String, required: true },
    
    // Message kab bheja gaya (timestamps help sort messages chronologically)
    timestamp: { type: Date, default: Date.now }
});

// Database indexing: Chat messages ko bookingId ke basis par chronologically superfast fetch karne ke liye index
messageSchema.index({ bookingId: 1, timestamp: 1 });

const messageModel = mongoose.models.message || mongoose.model('message', messageSchema);
export default messageModel;
