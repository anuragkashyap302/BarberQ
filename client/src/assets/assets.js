import appointment_img from './appointment_img.webp'
import profile_pic from './profile_pic.png'
import contact_image from './contact_image.png'
import about_image from './about_image.png'
import logo from './logo.svg'
import dropdown_icon from './dropdown_icon.svg'
import menu_icon from './menu_icon.svg'
import cross_icon from './cross_icon.png'
import chats_icon from './chats_icon.svg'
import verified_icon from './verified_icon.svg'
import arrow_icon from './arrow_icon.svg'
import info_icon from './info_icon.svg'
import upload_icon from './upload_icon.png'
import stripe_logo from './stripe_logo.png'
import razorpay_logo from './razorpay_logo.png'
import barber1 from './barber1.jpg'
import barber2 from './barber2.jpg'
import barber3 from './barber3.avif'
import barber4 from './barber4.jpg'
import barber5 from './barber5.avif'
import barber6 from './barber6.webp'
import barber7 from './barber7.jpg'
import barber8 from './barber8.jpg'
import barber9 from './barber9.avif'
import barber10 from './barber10.jpg'
import barber11 from './barber11.jpg'
import barber12 from './barber12.webp'


export const assets = {
    appointment_img,
    logo,
    chats_icon,
    verified_icon,
    info_icon,
    profile_pic,
    arrow_icon,
    contact_image,
    about_image,
    menu_icon,
    cross_icon,
    dropdown_icon,
    upload_icon,
    stripe_logo,
    razorpay_logo,
}



export const barbers = [
    {
        _id: 'barber1',
        name: 'Rajesh Kumar',
        image: barber1,
        speciality: 'Hair Stylist',
        experience: '6 Years',
        about: 'Rajesh is a master stylist known for his precision cuts and modern styles. He blends traditional barbering with contemporary trends to give every client a fresh, confident look.',
        fees: 300,
        address: {
            line1: 'MG Road',
            line2: 'Bengaluru, Karnataka'
        }
    },
    {
        _id: 'barber2',
        name: 'Aman Verma',
        image: barber2,
        speciality: 'Beard Specialist',
        experience: '4 Years',
        about: 'Aman is an expert in beard shaping and styling. Whether it’s a rugged look or a clean sharp finish, he ensures your beard enhances your personality.',
        fees: 250,
        address: {
            line1: 'Connaught Place',
            line2: 'New Delhi'
        }
    },
    {
        _id: 'barber3',
        name: 'Sameer Shaikh',
        image: barber3,
        speciality: 'Men’s Grooming Expert',
        experience: '5 Years',
        about: 'Sameer offers a complete grooming experience including haircuts, beard trims, and premium facials, ensuring clients leave looking and feeling their best.',
        fees: 350,
        address: {
            line1: 'Marine Drive',
            line2: 'Mumbai, Maharashtra'
        }
    },
    {
        _id: 'barber4',
        name: 'Karan Mehta',
        image: barber4,
        speciality: 'Kids & Family Haircuts',
        experience: '3 Years',
        about: 'Karan is known for his friendly approach and patience, making him a favourite for kids and family haircuts. Skilled in trendy and classic styles.',
        fees: 200,
        address: {
            line1: 'Park Street',
            line2: 'Kolkata, West Bengal'
        }
    },
    {
        _id: 'barber5',
        name: 'Chahat Mishra',
        image: barber5,
        speciality: 'Hair Colour & Styling',
        experience: '7 Years',
        about: 'Chahat specialises in hair colouring, highlights, and trendy cuts. His work is known for attention to detail and vibrant results.',
        fees: 500,
        address: {
            line1: 'Banjara Hills',
            line2: 'Hyderabad, Telangana'
        }
    },
    {
        _id: 'barber6',
        name: 'Aditya Verma',
        image: barber6,
        speciality: 'Classic Cuts Expert',
        experience: '5 Years',
        about: 'Faizan brings a touch of elegance to every cut, perfecting timeless classic hairstyles and beard trims with expert craftsmanship.',
        fees: 300,
        address: {
            line1: 'Hazratganj',
            line2: 'Lucknow, Uttar Pradesh'
        }
    },
    {
        _id: 'barber7',
        name: 'Suresh Reddy',
        image: barber7,
        speciality: 'Hair & Beard Styling',
        experience: '6 Years',
        about: 'Suresh is passionate about transforming looks with modern hairstyles and perfectly shaped beards.',
        fees: 350,
        address: {
            line1: 'RK Beach',
            line2: 'Visakhapatnam, Andhra Pradesh'
        }
    },
    {
        _id: 'barber8',
        name: 'Rohit Gupta',
        image: barber8,
        speciality: 'Beard & Moustache Artist',
        experience: '4 Years',
        about: 'Rohit crafts unique beard and moustache styles that suit your face shape and lifestyle.',
        fees: 250,
        address: {
            line1: 'Sector 17',
            line2: 'Chandigarh'
        }
        
   //12345678 pass
    },
    {
        _id: 'barber9',
        name: 'Vikas Nair',
        image: barber9,
        speciality: 'Trendy Haircuts',
        experience: '3 Years',
        about: 'Vikas is always up to date with the latest trends in men’s haircuts and ensures each client walks away with a fresh, stylish look.',
        fees: 300,
        address: {
            line1: 'Fort Kochi',
            line2: 'Kochi, Kerala'
        }
        
    },
    {
        _id: 'barber10',
        name: 'Deepak Yadav',
        image: barber10,
        speciality: 'Luxury Grooming',
        experience: '8 Years',
        about: 'Deepak provides luxury grooming services including hair spa, facial treatments, and precision cuts for a premium experience.',
        fees: 600,
        address: {
            line1: 'Bistupur',
            line2: 'Jamshedpur, Jharkhand'
        }
    },
    {
        _id: 'barber11',
        name: 'Arjun Singh',
        image: barber11,
        speciality: 'Wedding Groom Styling',
        experience: '6 Years',
        about: 'Arjun specialises in preparing grooms for their big day with premium styling packages.',
        fees: 800,
        address: {
            line1: 'MI Road',
            line2: 'Jaipur, Rajasthan'
        }
    },
    {
        _id: 'barber12',
        name: 'Imran Shaikh',
        image: barber12,
        speciality: 'Fade & Taper Cuts',
        experience: '5 Years',
        about: 'Imran is known for his sharp fades and clean taper cuts, giving clients a modern, polished appearance.',
        fees: 400,
        address: {
            line1: 'Paltan Bazaar',
            line2: 'Dehradun, Uttarakhand'
        }
    }
];
