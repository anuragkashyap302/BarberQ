import mongoose from "mongoose";
import ServiceModel from "../models/serviceModel.js";
import BarberModel from "../models/barbermodel.js";
import bcrypt from "bcrypt";

// Yeh function database connected hone par default services ko automatically seed/insert karta hai
const seedServices = async () => {
    try {
        const count = await ServiceModel.countDocuments();
        if (count === 0) {
            console.log("Seeding default services...");
            const defaultServices = [
                { name: "Haircut & Styling", description: "Professional haircuts tailored to your style, handled by skilled barbers.", price: 300, duration: 30 },
                { name: "Beard Grooming", description: "Keep your beard sharp and stylish with precision trimming.", price: 150, duration: 20 },
                { name: "Facial & Spa", description: "Relax and refresh with our premium facial and spa treatments.", price: 500, duration: 45 },
                { name: "Hair Spa", description: "Rejuvenating hair treatments to nourish scalp and hair roots.", price: 600, duration: 45 },
                { name: "Hair Coloring", description: "Professional hair coloring with premium products.", price: 800, duration: 60 },
                { name: "Kids Haircut", description: "Gentle and stylish haircuts for children.", price: 200, duration: 25 },
                { name: "Head Massage", description: "Stress-relieving traditional head massage with herbal oils.", price: 150, duration: 15 },
                { name: "Manicure", description: "Professional hand and nail care therapy.", price: 250, duration: 30 },
                { name: "Pedicure", description: "Relaxing foot bath and nail care therapy.", price: 300, duration: 30 }
            ];
            await ServiceModel.insertMany(defaultServices);
            console.log("Default services seeded successfully!");
        }
    } catch (error) {
        console.error("Error seeding services:", error);
    }
};

// Yeh function database connected hone par default barbers ko auto-seed karta hai
const seedBarbers = async () => {
    try {
        const count = await BarberModel.countDocuments();
        if (count < 12) {
            console.log("Seeding default barbers...");
            await BarberModel.deleteMany({}); // Clear to avoid duplicate duplicates
            const services = await ServiceModel.find({});
            const serviceMap = {};
            services.forEach(s => {
                serviceMap[s.name] = s._id;
            });

            // Hash a default password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("barber123", salt);

            const defaultBarbers = [
                {
                    name: 'Rajesh Kumar',
                    email: 'rajesh@barberq.com',
                    password: hashedPassword,
                    image: 'barber1',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Kids Haircut"]].filter(Boolean),
                    experience: '6 Years',
                    about: 'Rajesh is a master stylist known for his precision cuts and modern styles. He blends traditional barbering with contemporary trends.',
                    fees: 300,
                    rating: 4.9,
                    address: { line1: 'MG Road', line2: 'Bengaluru, Karnataka' },
                    date: Date.now()
                },
                {
                    name: 'Aman Verma',
                    email: 'aman@barberq.com',
                    password: hashedPassword,
                    image: 'barber2',
                    services: [serviceMap["Beard Grooming"], serviceMap["Head Massage"]].filter(Boolean),
                    experience: '4 Years',
                    about: 'Aman is an expert in beard shaping and styling. Whether it’s a rugged look or a clean sharp finish, he ensures your beard enhances your personality.',
                    fees: 250,
                    rating: 4.8,
                    address: { line1: 'Connaught Place', line2: 'New Delhi' },
                    date: Date.now()
                },
                {
                    name: 'Sameer Shaikh',
                    email: 'sameer@barberq.com',
                    password: hashedPassword,
                    image: 'barber3',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Beard Grooming"], serviceMap["Facial & Spa"]].filter(Boolean),
                    experience: '5 Years',
                    about: 'Sameer offers a complete grooming experience including haircuts, beard trims, and premium facials, ensuring clients leave looking and feeling their best.',
                    fees: 350,
                    rating: 4.7,
                    address: { line1: 'Marine Drive', line2: 'Mumbai, Maharashtra' },
                    date: Date.now()
                },
                {
                    name: 'Karan Mehta',
                    email: 'karan@barberq.com',
                    password: hashedPassword,
                    image: 'barber4',
                    services: [serviceMap["Kids Haircut"], serviceMap["Haircut & Styling"]].filter(Boolean),
                    experience: '3 Years',
                    about: 'Karan is known for his friendly approach and patience, making him a favourite for kids and family haircuts.',
                    fees: 200,
                    rating: 4.5,
                    address: { line1: 'Park Street', line2: 'Kolkata, West Bengal' },
                    date: Date.now()
                },
                {
                    name: 'Chahat Mishra',
                    email: 'chahat@barberq.com',
                    password: hashedPassword,
                    image: 'barber5',
                    services: [serviceMap["Hair Coloring"], serviceMap["Hair Spa"], serviceMap["Haircut & Styling"]].filter(Boolean),
                    experience: '7 Years',
                    about: 'Chahat specialises in hair colouring, highlights, and trendy cuts. Her work is known for attention to detail and vibrant results.',
                    fees: 500,
                    rating: 4.9,
                    address: { line1: 'Banjara Hills', line2: 'Hyderabad, Telangana' },
                    date: Date.now()
                },
                {
                    name: 'Aditya Verma',
                    email: 'aditya@barberq.com',
                    password: hashedPassword,
                    image: 'barber6',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Beard Grooming"]].filter(Boolean),
                    experience: '5 Years',
                    about: 'Aditya brings a touch of elegance to every cut, perfecting timeless classic hairstyles and beard trims with expert craftsmanship.',
                    fees: 300,
                    rating: 4.6,
                    address: { line1: 'Hazratganj', line2: 'Lucknow, Uttar Pradesh' },
                    date: Date.now()
                },
                {
                    name: 'Suresh Reddy',
                    email: 'suresh@barberq.com',
                    password: hashedPassword,
                    image: 'barber7',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Beard Grooming"]].filter(Boolean),
                    experience: '6 Years',
                    about: 'Suresh is passionate about transforming looks with modern hairstyles and perfectly shaped beards.',
                    fees: 350,
                    rating: 4.8,
                    address: { line1: 'RK Beach', line2: 'Visakhapatnam, Andhra Pradesh' },
                    date: Date.now()
                },
                {
                    name: 'Rohit Gupta',
                    email: 'rohit@barberq.com',
                    password: hashedPassword,
                    image: 'barber8',
                    services: [serviceMap["Beard Grooming"], serviceMap["Head Massage"]].filter(Boolean),
                    experience: '4 Years',
                    about: 'Rohit crafts unique beard and moustache styles that suit your face shape and lifestyle.',
                    fees: 250,
                    rating: 4.4,
                    address: { line1: 'Sector 17', line2: 'Chandigarh' },
                    date: Date.now()
                },
                {
                    name: 'Vikas Nair',
                    email: 'vikas@barberq.com',
                    password: hashedPassword,
                    image: 'barber9',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Hair Coloring"]].filter(Boolean),
                    experience: '3 Years',
                    about: 'Vikas is always up to date with the latest trends in men’s haircuts and ensures each client walks away with a fresh, stylish look.',
                    fees: 300,
                    rating: 4.3,
                    address: { line1: 'Fort Kochi', line2: 'Kochi, Kerala' },
                    date: Date.now()
                },
                {
                    name: 'Deepak Yadav',
                    email: 'deepak@barberq.com',
                    password: hashedPassword,
                    image: 'barber10',
                    services: [serviceMap["Hair Spa"], serviceMap["Facial & Spa"], serviceMap["Head Massage"]].filter(Boolean),
                    experience: '8 Years',
                    about: 'Deepak provides luxury grooming services including hair spa, facial treatments, and precision cuts for a premium experience.',
                    fees: 600,
                    rating: 4.9,
                    address: { line1: 'Bistupur', line2: 'Jamshedpur, Jharkhand' },
                    date: Date.now()
                },
                {
                    name: 'Arjun Singh',
                    email: 'arjun@barberq.com',
                    password: hashedPassword,
                    image: 'barber11',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Beard Grooming"], serviceMap["Facial & Spa"], serviceMap["Hair Spa"]].filter(Boolean),
                    experience: '6 Years',
                    about: 'Arjun specialises in preparing grooms for their big day with premium styling packages.',
                    fees: 800,
                    rating: 4.8,
                    address: { line1: 'MI Road', line2: 'Jaipur, Rajasthan' },
                    date: Date.now()
                },
                {
                    name: 'Imran Shaikh',
                    email: 'imran@barberq.com',
                    password: hashedPassword,
                    image: 'barber12',
                    services: [serviceMap["Haircut & Styling"], serviceMap["Beard Grooming"]].filter(Boolean),
                    experience: '5 Years',
                    about: 'Imran is known for his sharp fades and clean taper cuts, giving clients a modern, polished appearance.',
                    fees: 400,
                    rating: 4.7,
                    address: { line1: 'Paltan Bazaar', line2: 'Dehradun, Uttarakhand' },
                    date: Date.now()
                }
            ];

            await BarberModel.insertMany(defaultBarbers);
            console.log("Default barbers seeded successfully!");
        }
    } catch (error) {
        console.error("Error seeding barbers:", error);
    }
};

const connectDB = async () => {
    mongoose.connection.on('connected', async () => {
        console.log('MongoDB connected successfully');
        await seedServices();
        await seedBarbers();
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/BarberQ`);
}
export default connectDB;