# BarberQ

A modern appointment booking system for barbershops — saves time and eliminates queues by letting users browse barbers, book slots, and pay online. ⚡️

---

## Project Overview

BarberQ is a full-stack MERN-style application with separate frontends for customers and admins. It provides user authentication, barber profiles, booking management, payment integration, and admin/barber dashboards to manage bookings and availability.

- **Purpose:** Reduce waiting time and eliminate queues by enabling online bookings.
- **Structure:** Three apps in one repository — `client` (customer), `admin` (admin dashboard), and `server` (API).

---

## Features

- ✅ User registration & authentication (users, barbers, admins)  
- ✅ Browse barbers and view profiles (images via Cloudinary)  
- ✅ Book appointments and view booking history  
- ✅ Razorpay payment integration for bookings  
- ✅ Admin panel to add/manage barbers and bookings  
- ✅ Barber dashboard to view/manage their bookings  
- ✅ Role-based middleware (`authUser`, `authBarber`, `authAdmin`)  
- ✅ Image uploads using `multer` + Cloudinary  
- ✅ RESTful API with Express and MongoDB (Mongoose)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, Vite, Tailwind CSS, React Router |
| **Backend** | Node.js, Express 5 |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (JSON Web Tokens) |
| **File Storage** | Cloudinary |
| **Payments** | Razorpay |
| **Utilities** | Axios, bcrypt, multer, dotenv, validator |

---

## Installation

### Prerequisites
- Node.js >= 18
- npm
- MongoDB (local or MongoDB Atlas)

### Steps

1. **Clone the repository**
   ```bash
   git clone <[repo-url](https://github.com/anuragkashyap302/BarberQ)>
   cd BarberQ
   ```

2. **Setup Server**
   ```bash
   cd server
   npm install
   ```

3. **Setup Client (Customer)**
   ```bash
   cd ../client
   npm install
   ```

4. **Setup Admin**
   ```bash
   cd ../admin
   npm install
   ```

5. **Configure Environment Variables**
   
   Create `server/.env`:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   PORT=5000
   ```

---

## Usage

### Running the Application

**Start Backend Server:**
```bash
cd server
npm run server   # Uses nodemon for auto-reload
# or
npm start        # Runs once
```

**Start Client (Customer App):**
```bash
cd client
npm run dev
```

**Start Admin (Admin Dashboard):**
```bash
cd admin
npm run dev
```

The apps will be available at:
- Client: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Server: `http://localhost:5000`

### Building for Production

```bash
cd client
npm run build    # Creates optimized production build

cd ../admin
npm run build
```

---

## Project Structure

```
BarberQ/
├── server/                    # Express.js API server
│   ├── config/
│   │   ├── mongodb.js        # MongoDB connection
│   │   └── cloudinary.js     # Cloudinary setup
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── barberController.js
│   │   └── userController.js
│   ├── models/
│   │   ├── barbermodel.js
│   │   ├── bookingModel.js
│   │   └── userModel.js
│   ├── middlewares/
│   │   ├── authAdmin.js      # Admin auth middleware
│   │   ├── authBarber.js     # Barber auth middleware
│   │   ├── authUser.js       # User auth middleware
│   │   └── multer.js         # File upload handler
│   ├── routes/
│   │   ├── adminRoute.js
│   │   ├── barberRoute.js
│   │   └── userRoute.js
│   ├── server.js             # Entry point
│   ├── package.json
│   └── vercel.json
│
├── client/                    # Customer React App (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Booking.jsx
│   │   │   ├── MyBooking.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   ├── Barber.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Login.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Banner.jsx
│   │   │   ├── Services.jsx
│   │   │   ├── TopBarbers.jsx
│   │   │   └── Footer.jsx
│   │   ├── context/
│   │   │   └── AppContext.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
├── admin/                     # Admin Dashboard React App (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   └── Admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── BarberList.jsx
│   │   │       ├── AddBarber.jsx
│   │   │       └── AllBooking.jsx
│   │   │   └── Barber/
│   │   │       ├── BarberDashboard.jsx
│   │   │       ├── BarberBookings.jsx
│   │   │       └── BarberProfile.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── context/
│   │   │   ├── AdminContext.jsx
│   │   │   ├── BarberContext.jsx
│   │   │   └── AppContext.jsx
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
│
└── Readme.md
```

---

## How It Works (Architecture)

1. **Frontend Communication:** Client and Admin apps communicate with the backend API via Axios.
2. **Authentication:** JWT-based authentication with role-specific middleware (`authUser`, `authBarber`, `authAdmin`).
3. **Data Persistence:** All data is stored in MongoDB using Mongoose schemas.
4. **File Uploads:** Images are uploaded via `multer` and stored on Cloudinary.
5. **Payments:** Razorpay integration handles payment processing and validation.
6. **Separate UIs:** Customer and admin frontends are isolated for better UX and maintainability.

---

## API Endpoints (Quick Reference)

### User Routes (`/api/user`)
- `POST /register` — Register a new user
- `POST /login` — User login
- `GET /profile` — Get user profile
- `POST /book` — Create a booking
- `GET /my-bookings` — Get user's bookings

### Barber Routes (`/api/barber`)
- `POST /register` — Register a new barber
- `POST /login` — Barber login
- `GET /profile` — Get barber profile
- `GET /bookings` — Get barber's bookings

### Admin Routes (`/api/admin`)
- `GET /stats` — Get dashboard statistics
- `POST /add-barber` — Add new barber
- `GET /barbers` — List all barbers
- `GET /bookings` — View all bookings

---

## Future Improvements

- 📅 **Calendar Integration:** Add barber availability calendar with time-slot optimization
- 🔔 **Notifications:** Email/SMS reminders for booking confirmations and reminders
- 🧪 **Testing:** Unit and integration tests (Jest, Supertest, React Testing Library)
- 🔐 **Enhanced Security:** Two-factor authentication, rate limiting, input validation
- 📊 **Analytics:** Dashboard analytics for barber performance and revenue
- 🌐 **Internationalization:** Multi-language support
- 📱 **Mobile App:** React Native mobile version
- 🔄 **CI/CD Pipeline:** GitHub Actions for automated tests and deployment
- 💬 **Chat Support:** Real-time chat between barbers and customers
- ⭐ **Ratings & Reviews:** Customer ratings and reviews for barbers

---


## Support

For questions, feature requests, or bug reports, please open an issue on GitHub or contact the development team.

**Happy Booking! 🎉**
